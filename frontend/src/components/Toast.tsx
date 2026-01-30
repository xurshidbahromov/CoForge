"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

const toastConfig = {
    success: { icon: CheckCircle2, bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-500" },
    error: { icon: XCircle, bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-500" },
    warning: { icon: AlertCircle, bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-500" },
    info: { icon: Info, bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-500" }
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, message }]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => {
                        const config = toastConfig[toast.type];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={toast.id}
                                layout
                                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                                className={`
                                    flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl
                                    ${config.bg} ${config.border}
                                    shadow-2xl shadow-black/20 min-w-[300px] max-w-[400px]
                                `}
                            >
                                <Icon className={`w-5 h-5 ${config.text} flex-shrink-0`} />
                                <p className="text-sm font-medium flex-1">{toast.message}</p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="p-1 hover:bg-foreground/10 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 text-foreground/40" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
