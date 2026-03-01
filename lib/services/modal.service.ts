"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ModalOptions {
    /** Optional title shown in the modal header */
    title?: string;
    /** The content (form or any node) to render inside the modal */
    content: ReactNode;
}

export interface ModalContextValue {
    /** Open the modal with the given options */
    openModal: (options: ModalOptions) => void;
    /** Close the currently open modal */
    closeModal: () => void;
    /** Whether the modal is currently visible */
    isOpen: boolean;
}

// ── Context ────────────────────────────────────────────────────────────────────

export const ModalContext = createContext<ModalContextValue | null>(null);

// ── Hook ───────────────────────────────────────────────────────────────────────

/**
 * useModal — consume the modal service from any client component.
 *
 * @example
 * const { openModal, closeModal } = useModal();
 * openModal({ title: "Login", content: <LoginForm /> });
 */
export function useModal(): ModalContextValue {
    const ctx = useContext(ModalContext);
    if (!ctx) {
        throw new Error("useModal must be used inside <ModalProvider>");
    }
    return ctx;
}
