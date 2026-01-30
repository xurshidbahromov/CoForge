"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title: string;
    description: string;
    itemName?: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, description, itemName }: DeleteModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        try {
            setIsDeleting(true);
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Failed to delete:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-background border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-red-500/5">
                            {/* Header */}
                            <div className="p-6 border-b border-foreground/5">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-red-500/10">
                                        <AlertTriangle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black">{title}</h3>
                                        <p className="text-sm text-foreground/40">{description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {itemName && (
                                    <div className="p-4 rounded-xl bg-foreground/5 border border-foreground/5 mb-6">
                                        <p className="text-sm font-medium text-foreground/60">You are about to delete:</p>
                                        <p className="font-bold mt-1">{itemName}</p>
                                    </div>
                                )}
                                <p className="text-sm text-foreground/50">
                                    This action cannot be undone. All associated tasks and data will be permanently removed.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="p-6 pt-0 flex gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-foreground/5 hover:bg-foreground/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
