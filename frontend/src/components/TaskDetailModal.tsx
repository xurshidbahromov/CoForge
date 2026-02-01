"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { useState, useEffect } from "react";
import { Task } from "@/hooks/useProjects";
import ReactMarkdown from "react-markdown";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onStatusChange: (taskId: number, status: string) => void;
}

export function TaskDetailModal({ isOpen, onClose, task, onStatusChange }: TaskDetailModalProps) {
    const [guide, setGuide] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setGuide(task.content || null);
        } else {
            setGuide(null);
        }
    }, [task]);

    const handleGenerateGuide = async () => {
        if (!task) return;
        try {
            setIsLoading(true);
            const res = await api.post(`/tasks/${task.id}/guide`);
            setGuide(res.data.content);
        } catch (error) {
            console.error("Failed to generate guide:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!task) return null;

    const statusConfig: any = {
        todo: { label: "To Do", icon: ListTodo, color: "text-orange-500", bg: "bg-orange-500/10" },
        in_progress: { label: "In Progress", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
        done: { label: "Done", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" }
    };

    const currentStatus = statusConfig[task.status] || statusConfig.todo;

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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-none"
                    >
                        <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-full pointer-events-auto">
                            {/* Header */}
                            <div className="p-6 border-b border-foreground/5 flex items-start justify-between shrink-0 bg-background z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={cn("px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2", currentStatus.bg, currentStatus.color)}>
                                            <currentStatus.icon className="w-3 h-3" />
                                            {currentStatus.label}
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-black">{task.title}</h2>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                                    <X className="w-5 h-5 opacity-50" />
                                </button>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="p-6 overflow-y-auto custom-scrollbar grow">
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-foreground/40 uppercase mb-2">Description</h3>
                                    <p className="text-foreground/80 leading-relaxed">{task.description}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-foreground/40 uppercase flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-primary" />
                                            AI Implementation Guide
                                        </h3>
                                    </div>

                                    {guide ? (
                                        <div className="prose-sm prose-invert max-w-none bg-foreground/[0.02] p-6 rounded-2xl border border-foreground/5 text-foreground">
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-lg font-black mt-6 mb-3 text-foreground" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-5 mb-2 text-foreground" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-sm font-bold mt-4 mb-2 text-foreground" {...props} />,
                                                    p: ({ node, ...props }) => <p className="text-foreground/70 mb-3 leading-relaxed" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1 text-foreground/70" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground/70" {...props} />,
                                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                    code: ({ node, inline, className, children, ...props }: any) => {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline ? (
                                                            <div className="relative group">
                                                                <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto mb-4 border border-white/10 text-sm font-mono text-white/90" {...props}>
                                                                    <code>{children}</code>
                                                                </pre>
                                                            </div>
                                                        ) : (
                                                            <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-bold font-mono" {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    }
                                                }}
                                            >
                                                {guide}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-center bg-foreground/[0.02] rounded-2xl border border-dashed border-foreground/10">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                                <Sparkles className="w-6 h-6 text-primary" />
                                            </div>
                                            <h4 className="font-bold mb-2">Need Help Implementation?</h4>
                                            <p className="text-sm text-foreground/40 max-w-xs mb-6">
                                                Generate a step-by-step guide tailored for junior developers, complete with code snippets.
                                            </p>
                                            <button
                                                onClick={handleGenerateGuide}
                                                disabled={isLoading}
                                                className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Sparkles className="w-4 h-4" />
                                                )}
                                                Generate AI Guide
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-foreground/5 bg-background shrink-0 flex justify-end gap-3 z-10">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl font-bold text-sm bg-foreground/5 hover:bg-foreground/10 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
