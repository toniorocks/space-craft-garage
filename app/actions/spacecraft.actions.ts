"use server";

import { revalidatePath } from "next/cache";
import { addSpaceCraft } from "@/lib/services/spacecraft.service";
import type { CreateSpaceCraftInput } from "@/lib/models";
import { verifySession } from "@/lib/session";

export async function processAddSpacecraft(formData: FormData) {
    try {
        const session = await verifySession();
        if (!session?.isAuth) {
            return { error: "No autorizado. Inicia sesión para continuar." };
        }

        const name = formData.get("name") as string;
        const nationality = formData.get("nationality") as string | null;
        const maxSpeedStr = formData.get("maxSpeed") as string | null;
        const buildYearStr = formData.get("buildYear") as string | null;
        const priceStr = formData.get("price") as string | null;
        const imageUrl = formData.get("imageUrl") as string | null;

        if (!name || name.trim() === "") {
            return { error: "El nombre es obligatorio" };
        }

        const input: CreateSpaceCraftInput = {
            name: name.trim(),
            nationality: nationality?.trim() || null,
            maxSpeed: maxSpeedStr ? Number(maxSpeedStr) : null,
            buildYear: buildYearStr ? Number(buildYearStr) : null,
            price: priceStr ? Number(priceStr) : null,
            imageUrl: imageUrl?.trim() || null,
        };

        const craft = await addSpaceCraft(input);

        // Revalidate the home page to show the new spacecraft
        revalidatePath("/");

        return { success: true, craftId: craft.id };
    } catch (e) {
        console.error("Error adding spacecraft:", e);
        return { error: e instanceof Error ? e.message : "Ocurrió un error al agregar la nave." };
    }
}
