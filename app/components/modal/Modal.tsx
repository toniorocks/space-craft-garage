"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    title?: string;
    children: ReactNode;
    onClose: () => void;
    disableClose?: boolean;
}

export function Modal({ isOpen, title, children, onClose, disableClose = false }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !disableClose) onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose, disableClose]);

    // Prevent body scroll while open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current && !disableClose) onClose();
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
        >
            <div className="relative w-full max-w-[480px] m-4 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                    {title && (
                        <h2 id="modal-title" className="text-lg font-semibold text-zinc-100">
                            {title}
                        </h2>
                    )}
                    {!disableClose && (
                        <button
                            onClick={onClose}
                            className="text-zinc-500 hover:text-zinc-200 transition-colors p-1"
                            aria-label="Cerrar modal"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}
