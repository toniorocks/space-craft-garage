"use client";

import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { ModalContext } from "@/lib/services/modal.service";
import type { ModalOptions } from "@/lib/services/modal.service";
import { Modal } from "./Modal";

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ModalOptions | null>(null);

    const openModal = useCallback((opts: ModalOptions) => {
        setOptions(opts);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        // Slight delay so the close animation can play before unmounting content
        setTimeout(() => setOptions(null), 300);
    }, []);

    return (
        <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
            {children}
            <Modal isOpen={isOpen} title={options?.title} onClose={closeModal}>
                {options?.content}
            </Modal>
        </ModalContext.Provider>
    );
}
