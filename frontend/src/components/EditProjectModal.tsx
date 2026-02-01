"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { Project } from "@/hooks/useProjects";

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, data: Partial<Project>) => Promise<void>;
    project: Project;
}

export function EditProjectModal({ isOpen, onClose, onSave, project }: EditProjectModalProps) {
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);
    const [stack, setStack] = useState(project.stack);
    const [isSaving, setIsSaving] = useState(false);

    // Update state when project changes
    useEffect(() => {
        if (project) {
            setTitle(project.title);
            setDescription(project.description);
            setStack(project.stack);
        }
    }, [project]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            await onSave(project.id, { title, description, stack });
            onClose();
        } catch (error) {
            console.error("Failed to update project:", error);
        } finally {
            setIsSaving(false);
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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
                    >
                        <form onSubmit={handleSave} className="bg-background border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl">
                            {/* Header */}
                            <div className="p-6 border-b border-foreground/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-primary/10">
                                        <Pencil className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black">Edit Project</h3>
                                        <p className="text-sm text-foreground/40">Update project details</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                                >
                                    <X className="w-5 h-5 opacity-50" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground/60">Project Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-foreground/5 border-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                                        placeholder="Enter project title..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground/60">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-foreground/5 border-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px] resize-none"
                                        placeholder="Describe your project..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground/60">Tech Stack (comma separated)</label>
                                    <input
                                        type="text"
                                        value={stack}
                                        onChange={(e) => setStack(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-foreground/5 border-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
                                        placeholder="React, Next.js, TypeScript..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 pt-0 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-foreground/5 hover:bg-foreground/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
