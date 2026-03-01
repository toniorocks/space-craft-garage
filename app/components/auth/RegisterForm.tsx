"use client";

import { useState } from "react";
import { processRegistration } from "@/app/actions/auth.actions";
import { useModal } from "@/lib/services/modal.service";

export function RegisterForm() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const { closeModal } = useModal();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await processRegistration(formData);

        if (result.error) {
            setError(result.error);
            setIsPending(false);
        } else if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                closeModal();
            }, 2000);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <p className="text-emerald-400 font-medium text-lg mb-2">
                    ✅ ¡Registro exitoso!
                </p>
                <p className="text-zinc-400 text-sm">Cerrando modal...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 rounded-lg bg-red-900/50 border border-red-800 text-red-300 text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="nombreCompleto">
                    Nombre Completo *
                </label>
                <input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="Ej. Chepe Galáctico"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="email">
                    Correo Electrónico *
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
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="telefono">
                    Teléfono (Opcional)
                </label>
                <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="1234567890"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="password">
                    Contraseña *
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-800 disabled:text-indigo-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
            >
                {isPending ? "Registrando..." : "Registrarse"}
            </button>
        </form>
    );
}
