"use client";

import { useState } from "react";
import { processLogin } from "@/app/actions/auth.actions";
import { useModal } from "@/lib/services/modal.service";

export function LoginForm({
    onSuccess,
    onSwitchToRegister,
}: {
    onSuccess?: () => void;
    onSwitchToRegister?: () => void;
} = {}) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const { closeModal } = useModal();

    const checkValidity = (formData: FormData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
        if (!password) return false;

        return true;
    };

    const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        setIsValid(checkValidity(formData));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        if (!checkValidity(formData)) {
            return;
        }

        setIsPending(true);

        const result = await processLogin(formData);

        if (result.error) {
            setError(result.error);
            setIsPending(false);
        } else if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    closeModal();
                }
            }, 1500);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <p className="text-emerald-400 font-medium text-lg mb-2">
                    ✅ ¡Bienvenido de nuevo!
                </p>
                <p className="text-zinc-400 text-sm">Cerrando modal...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} onChange={handleChange} className="space-y-4">
            {error && (
                <div className="p-3 rounded-lg bg-red-900/50 border border-red-800 text-red-300 text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="email">
                    Correo Electrónico
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="correo@ejemplo.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="password">
                    Contraseña
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={!isValid || isPending}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-800 disabled:text-indigo-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
            >
                {isPending ? "Ingresando..." : "Iniciar Sesión"}
            </button>

            {onSwitchToRegister && (
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
                    >
                        ¿No tienes cuenta? Regístrate
                    </button>
                </div>
            )}
        </form>
    );
}
