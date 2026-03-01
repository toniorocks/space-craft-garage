"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { processLogout } from "@/app/actions/auth.actions";

export function LogoutButton({ className = "" }: { className?: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await processLogout();
            router.refresh(); // force the page to re-check the missing session
        });
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isPending}
            className={`px-4 py-2 rounded-lg bg-zinc-800 hover:bg-red-900/50 hover:text-red-300 text-zinc-300 border border-zinc-700 hover:border-red-800 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 ${className}`}
            aria-label="Cerrar Sesión"
        >
            {isPending ? "Saliendo..." : "Cerrar Sesión"}
        </button>
    );
}
