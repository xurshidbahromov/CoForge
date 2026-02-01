"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Task } from "@/hooks/useProjects";

interface TaskCardProps {
    task: Task;
    onStatusChange: (taskId: number, status: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onView: (task: Task) => void;
}

export function TaskCard({ task, onStatusChange, onEdit, onDelete, onView }: TaskCardProps) {
    const nextStatus = {
        todo: "in_progress",
        in_progress: "done",
        done: "todo"
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-xl bg-background border border-foreground/5 hover:border-foreground/10 transition-all group cursor-pointer relative"
            onClick={() => onView(task)}
        >
            <div className="flex items-start gap-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(task.id, nextStatus[task.status as keyof typeof nextStatus]);
                    }}
                    className={cn(
                        "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110",
                        task.status === "done"
                            ? "border-green-500 bg-green-500"
                            : task.status === "in_progress"
                                ? "border-purple-500"
                                : "border-foreground/20"
                    )}
                >
                    {task.status === "done" && <CheckCircle2 className="w-3 h-3 text-white" />}
                </button>
                <div className="flex-1 pr-14">
                    <h4 className={cn(
                        "font-bold text-sm transition-colors",
                        task.status === "done" && "line-through text-foreground/40"
                    )}>
                        {task.title}
                    </h4>
                    <p className="text-xs text-foreground/40 mt-1 line-clamp-2">
                        {task.description}
                    </p>
                </div>

                {/* Actions (visible on hover) */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                        }}
                        className="p-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors"
                        title="Edit Task"
                    >
                        <Pencil className="w-3 h-3" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task);
                        }}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
