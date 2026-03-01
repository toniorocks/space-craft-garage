"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { Modal } from "../modal/Modal";

export function AuthGate() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);

    const handleSuccess = () => {
        // Refrescar la ruta para que Server Component re-evalúe la sesión
        router.refresh();
    };

    return (
        <Modal
            isOpen={true}
            disableClose={true}
            title={isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            onClose={() => { }}
        >
            <div className="mb-4 text-zinc-400 text-sm">
                Debes {isLogin ? "iniciar sesión" : "crear una cuenta"} para acceder al sistema.
            </div>

            {isLogin ? (
                <LoginForm
                    onSuccess={handleSuccess}
                    onSwitchToRegister={() => setIsLogin(false)}
                />
            ) : (
                <RegisterForm
                    onSuccess={handleSuccess}
                    onSwitchToLogin={() => setIsLogin(true)}
                />
            )}
        </Modal>
    );
}
