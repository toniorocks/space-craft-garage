"use server";

import { registerUser, authenticateUser } from "@/lib/services";
import type { CreateUserInput } from "@/lib/models";
import { createSession, deleteSession } from "@/lib/session";

export async function processRegistration(
    formData: FormData
) {
    const nombreCompleto = formData.get("nombreCompleto") as string;
    const email = formData.get("email") as string;
    const telefono = formData.get("telefono") as string | null;
    const password = formData.get("password") as string;

    if (!nombreCompleto || !email || !password) {
        return { error: "Faltan campos obligatorios" };
    }

    try {
        const input: Omit<CreateUserInput, "password"> & { password: string } = {
            nombreCompleto,
            email,
            telefono: telefono || undefined,
            password,
        };

        const user = await registerUser(input);
        await createSession(user.id.toString());
        return { success: true, user };
    } catch (e: any) {
        if (e.name === "EmailAlreadyInUseError") {
            return { error: e.message };
        }
        return { error: "Ocurrió un error al registrarse. Intenta de nuevo." };
    }
}

export async function processLogin(
    formData: FormData
) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Faltan campos obligatorios" };
    }

    try {
        const user = await authenticateUser(email, password);
        await createSession(user.id.toString());
        return { success: true, user };
    } catch (e: any) {
        if (e.name === "InvalidCredentialsError") {
            return { error: "Correo o contraseña incorrectos" };
        }
        return { error: "Ocurrió un error al iniciar sesión. Intenta de nuevo." };
    }
}

export async function processLogout() {
    await deleteSession();
    return { success: true };
}
