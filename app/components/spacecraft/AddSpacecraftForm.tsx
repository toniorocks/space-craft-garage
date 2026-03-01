"use client";

import { useState } from "react";
import { processAddSpacecraft } from "@/app/actions/spacecraft.actions";
import { useModal } from "@/lib/services/modal.service";

export function AddSpacecraftForm({
    onSuccess,
}: {
    onSuccess?: () => void;
} = {}) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const { closeModal } = useModal();

    const checkValidity = (formData: FormData) => {
        const name = formData.get("name") as string;
        const maxSpeed = formData.get("maxSpeed") as string;
        const buildYear = formData.get("buildYear") as string;
        const price = formData.get("price") as string;
        const imageUrl = formData.get("imageUrl") as string;

        if (!name || name.trim().length < 2) return false;
        if (maxSpeed && isNaN(Number(maxSpeed))) return false;

        if (buildYear) {
            const year = Number(buildYear);
            if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 10) return false;
        }

        if (price && isNaN(Number(price))) return false;

        if (imageUrl) {
            try {
                new URL(imageUrl);
            } catch (err) {
                return false;
            }
        }

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

        const result = await processAddSpacecraft(formData);

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
                    ✅ ¡Nave registrada con éxito!
                </p>
                <p className="text-zinc-400 text-sm">
                    Cerrando formulario...
                </p>
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
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="name">
                    Nombre de la Nave *
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="Ej. Chepe Galáctico"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="nationality">
                    Nacionalidad o Facción
                </label>
                <input
                    id="nationality"
                    name="nationality"
                    type="text"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="Ej. MX"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="maxSpeed">
                        Velocidad Máx. (km/h)
                    </label>
                    <input
                        id="maxSpeed"
                        name="maxSpeed"
                        type="number"
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        placeholder="Ej. 28000"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="buildYear">
                        Año de Construcción
                    </label>
                    <input
                        id="buildYear"
                        name="buildYear"
                        type="number"
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        placeholder="Ej. 2024"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="price">
                        Precio (MXN)
                    </label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        placeholder="Ej. 5000000"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="imageUrl">
                        URL de Imagen
                    </label>
                    <input
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        placeholder="https://..."
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={!isValid || isPending}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-800 disabled:text-indigo-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
            >
                {isPending ? "Registrando..." : "Registrar Nave"}
            </button>
        </form>
    );
}
