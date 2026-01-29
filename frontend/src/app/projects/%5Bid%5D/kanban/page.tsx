"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    MoreHorizontal,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Github,
    ArrowLeft,
    Loader2,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

interface Task {
    id: number;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "done";
    order: number;
    pr_url?: string;
}

interface Column {
    id: "todo" | "in_progress" | "done";
    title: string;
}

const columns: Column[] = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "done", title: "Done" },
];

export default function KanbanBoardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, checkAuth } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            fetchTasks();
        };
        init();
    }, [id]);

    const fetchTasks = async () => {
        try {
            const response = await api.get(`/tasks/${id}`);
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const moveTask = async (task: Task, newStatus: "todo" | "in_progress" | "done") => {
        setUpdatingTaskId(task.id);
        try {
            await api.patch(`/tasks/${task.id}`, { status: newStatus });
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Failed to move task:", error);
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const handleUpdatePR = async (task: Task) => {
        const url = prompt("Enter GitHub PR URL:", task.pr_url || "");
        if (url === null) return;

        setUpdatingTaskId(task.id);
        try {
            await api.patch(`/tasks/${task.id}`, { pr_url: url });
            setTasks(tasks.map(t => t.id === task.id ? { ...t, pr_url: url } : t));
        } catch (error) {
            console.error("Failed to update PR URL:", error);
        } finally {
            setUpdatingTaskId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href={`/projects/${id}`} className="p-2 glass rounded-xl hover:text-primary transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold">Team Kanban Board</h1>
                </div>
                <div className="flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-foreground/60">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    Live Sync Active
                </div>
            </div>

            {/* Kanban Grid */}
            <div className="grid md:grid-cols-3 gap-6 h-[70vh]">
                {columns.map((column) => (
                    <div key={column.id} className="flex flex-col h-full glass bg-white/5 rounded-3xl p-4">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h2 className="font-bold flex items-center gap-2">
                                {column.title}
                                <span className="text-xs text-foreground/30 font-mono bg-white/5 px-2 py-0.5 rounded-full">
                                    {tasks.filter(t => t.status === column.id).length}
                                </span>
                            </h2>
                            <button className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                                <Plus className="w-4 h-4 text-foreground/40" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pb-4">
                            <AnimatePresence mode="popLayout">
                                {tasks.filter(t => t.status === column.id).map((task) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={task.id}
                                        className="glass-card p-4 hover:border-primary/50 cursor-grab active:cursor-grabbing group border-white/10"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                                {task.title}
                                            </h3>
                                            {updatingTaskId === task.id && (
                                                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                            )}
                                        </div>

                                        <p className="text-xs text-foreground/60 mb-4 line-clamp-2">
                                            {task.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex -space-x-2">
                                                <div className="w-6 h-6 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[8px] font-bold">
                                                    {user?.username?.charAt(0).toUpperCase()}
                                                </div>
                                            </div>

                                            <div className="flex gap-1">
                                                {column.id !== "todo" && (
                                                    <button
                                                        onClick={() => moveTask(task, column.id === "done" ? "in_progress" : "todo")}
                                                        className="p-1.5 glass rounded-lg hover:bg-white/10 text-foreground/40 hover:text-foreground transition-colors"
                                                    >
                                                        <ArrowLeft className="w-3 h-3" />
                                                    </button>
                                                )}

                                                {column.id === "done" ? (
                                                    <button
                                                        onClick={() => handleUpdatePR(task)}
                                                        className={`p-1.5 glass rounded-lg transition-colors ${task.pr_url ? 'text-success hover:bg-success/10' : 'text-foreground/40 hover:text-primary hover:bg-primary/10'}`}
                                                    >
                                                        <Github className="w-3 h-3" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => moveTask(task, column.id === "todo" ? "in_progress" : "done")}
                                                        className="p-1.5 glass rounded-lg hover:bg-white/10 text-foreground/40 hover:text-primary transition-colors"
                                                        style={{ transform: 'rotate(180deg)' }}
                                                    >
                                                        <ArrowLeft className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {task.pr_url && (
                                            <div className="mt-3 py-2 px-3 rounded-xl bg-success/5 border border-success/10 flex items-center justify-between group/link">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <ExternalLink className="w-3 h-3 text-success shrink-0" />
                                                    <span className="text-[10px] text-success/70 truncate">PR Linked</span>
                                                </div>
                                                <a
                                                    href={task.pr_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-[10px] font-bold text-success hover:underline"
                                                >
                                                    View
                                                </a>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
