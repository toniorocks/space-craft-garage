"use client";

import { useModal } from "@/lib/services/modal.service";
import { RegisterForm } from "../auth/RegisterForm";
import { LoginForm } from "../auth/LoginForm";

export function OpenModalTestButton() {
    const { openModal } = useModal();

    return (
        <div className="flex gap-4">
            <button
                type="button"
                onClick={() => {
                    openModal({
                        title: "Iniciar Sesión",
                        content: <LoginForm />,
                    });
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
                Iniciar Sesión
            </button>
            <button
                type="button"
                onClick={() => {
                    openModal({
                        title: "Crear Cuenta",
                        content: <RegisterForm />,
                    });
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-medium transition-colors"
            >
                Registrarse
            </button>
        </div>
    );
}
