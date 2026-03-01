"use client";

import { useModal } from "@/lib/services/modal.service";
import { AddSpacecraftForm } from "./AddSpacecraftForm";

export function AddSpacecraftButton() {
    const { openModal } = useModal();

    return (
        <button
            onClick={() => {
                openModal({
                    title: "Registrar Nueva Nave",
                    content: <AddSpacecraftForm />,
                });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B2142]/80 hover:bg-[#252B52] border border-[#4DEEEA]/50 text-[#4DEEEA] text-sm font-semibold tracking-wide rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all backdrop-blur-sm uppercase"
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Nave
        </button>
    );
}
