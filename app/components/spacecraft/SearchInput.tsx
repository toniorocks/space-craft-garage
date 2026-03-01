"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useRef } from "react";

export function SearchInput() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="relative w-full max-w-sm mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`w-5 h-5 ${isPending ? "text-[#4DEEEA] animate-pulse" : "text-[#5A6399]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Buscar nave por nombre..."
                className="w-full pl-10 pr-4 py-2 bg-[#1B2142]/80 border border-[#2D3560] rounded-lg text-white placeholder-[#A1A7CD] focus:outline-none focus:border-[#4DEEEA]/50 focus:ring-1 focus:ring-[#4DEEEA]/50 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm"
                defaultValue={searchParams.get("query")?.toString()}
                onChange={(e) => {
                    const val = e.target.value.trim();
                    if (timeoutId.current) clearTimeout(timeoutId.current);
                    timeoutId.current = setTimeout(() => {
                        handleSearch(val);
                    }, 400);
                }}
            />
        </div>
    );
}
