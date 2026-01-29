"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    Layout,
    CheckCircle2,
    Circle,
    Zap,
    Github,
    MessageSquare,
    Sparkles,
    Loader2,
    Trophy,
    ArrowRight,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface Project {
    id: number;
    title: string;
    description: string;
    stack: string;
    type: string;
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { user, checkAuth } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            fetchProjectAndTasks();
        };
        init();
    }, [id]);

    const fetchProjectAndTasks = async () => {
        try {
            const projRes = await api.get(`/projects`); // Note: In a real app we'd have GET /projects/{id}
            // For now, filter from the list
            const proj = projRes.data.find((p: any) => p.id === parseInt(id));
            setProject(proj);

            const tasksRes = await api.get(`/tasks/${id}`);
            setTasks(tasksRes.data);
        } catch (error) {
            console.error("Failed to fetch project details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateTasks = async () => {
        setIsGenerating(true);
        try {
            const response = await api.post(`/tasks/${id}/generate`);
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to generate tasks:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleTaskStatus = async (task: Task) => {
        setUpdatingTaskId(task.id);
        const newStatus = task.status === "done" ? "todo" : "done";
        try {
            await api.patch(`/tasks/${task.id}`, { status: newStatus });
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Failed to update task:", error);
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const completedTasks = tasks.filter(t => t.status === "done").length;
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Project not found</h2>
                <Link href="/dashboard" className="text-primary hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Link */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-8 group"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            {/* Project Header */}
            <div className="glass rounded-3xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase">
                                {project.type}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-foreground/60 text-xs">
                                {project.stack}
                            </span>
                        </div>
                    </div>
                    <p className="text-lg text-foreground/70 mb-8 max-w-3xl">
                        {project.description}
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-foreground/60">Overall Progress</span>
                                <span className="font-bold">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-primary to-secondary"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/projects/${id}/kanban`}
                                className="glass-button bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 flex items-center gap-2 px-6"
                            >
                                <Layout className="w-4 h-4" />
                                Open Kanban
                            </Link>
                            <div className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-2xl glass bg-primary/5 border-primary/20">
                                <Trophy className="w-5 h-5 text-accent" />
                                <span className="font-bold text-primary">+{completedTasks * 50} XP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Task List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Sprints & Tasks
                        </h2>
                        {tasks.length === 0 && (
                            <button
                                onClick={handleGenerateTasks}
                                disabled={isGenerating}
                                className="text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 transition-colors inline-flex items-center gap-2"
                            >
                                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                {isGenerating ? "Generating..." : "Generate Tasks"}
                            </button>
                        )}
                    </div>

                    {tasks.length === 0 ? (
                        <div className="glass rounded-3xl p-12 text-center border-dashed">
                            <Sparkles className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                            <h3 className="font-medium mb-2">No tasks generated yet</h3>
                            <p className="text-sm text-foreground/50 mb-6">
                                Let AI break down this project into actionable steps for you.
                            </p>
                            <button
                                onClick={handleGenerateTasks}
                                disabled={isGenerating}
                                className="glass-button inline-flex items-center gap-2"
                            >
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                {isGenerating ? "Processing..." : "Generate AI Task Breakdown"}
                            </button>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {tasks.map((task) => (
                                <motion.div
                                    layout
                                    key={task.id}
                                    className={`glass-card p-5 cursor-pointer hover:border-primary/50 transition-all ${task.status === 'done' ? 'opacity-60 grayscale-[0.5]' : ''}`}
                                    onClick={() => toggleTaskStatus(task)}
                                >
                                    <div className="flex gap-4">
                                        <div className="pt-1">
                                            {updatingTaskId === task.id ? (
                                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                            ) : task.status === 'done' ? (
                                                <CheckCircle2 className="w-6 h-6 text-success" />
                                            ) : (
                                                <Circle className="w-6 h-6 text-foreground/20" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-semibold mb-1 ${task.status === 'done' ? 'line-through text-foreground/40' : ''}`}>
                                                {task.title}
                                            </h3>
                                            <p className="text-sm text-foreground/60">
                                                {task.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* AI Mentor Sidebar */}
                <div className="space-y-6">
                    <div className="glass rounded-3xl p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            AI Mentor
                        </h2>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
                            <p className="text-sm italic text-foreground/80 leading-relaxed">
                                "Great choice with this project! To get started, focus on setting up the basic scaffold first. Don't worry about the polish yet, just get that main feature working."
                            </p>
                        </div>
                        <button className="w-full glass-button text-sm py-3 flex items-center justify-center gap-2 group">
                            Ask AI for Help
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="glass rounded-3xl p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Github className="w-5 h-5" />
                            Project Resources
                        </h2>
                        <div className="space-y-3">
                            <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                <span className="text-sm font-medium">Starter Template</span>
                                <ExternalLink className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                            </a>
                            <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                <span className="text-sm font-medium">Documentation</span>
                                <ExternalLink className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
