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
            <div className="p-10 md:p-14 rounded-[3rem] border border-foreground/[0.05] bg-foreground/[0.01] mb-12 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{project.title}</h1>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                                {project.type}
                            </span>
                            <span className="px-3 py-1.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                                {project.stack}
                            </span>
                        </div>
                    </div>
                    <p className="text-xl text-foreground/50 mb-12 max-w-2xl leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center gap-10">
                        <div className="flex-1">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20 mb-4">
                                <span>Project Completion</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-foreground opacity-70"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href={`/projects/${id}/kanban`}
                                className="glass-button bg-foreground text-background flex items-center gap-2 group"
                            >
                                <Layout className="w-4 h-4" />
                                <span>Open Kanban</span>
                            </Link>
                            <div className="hidden sm:flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-foreground/[0.05] bg-foreground/[0.02]">
                                <Trophy className="w-4 h-4 text-foreground/20" />
                                <span className="text-sm font-bold tracking-tight">+{completedTasks * 50} XP</span>
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
                        <div className="p-16 rounded-[2.5rem] border border-dashed border-foreground/10 text-center">
                            <Sparkles className="w-10 h-10 text-foreground/5 mx-auto mb-6" />
                            <h3 className="text-xl font-bold mb-3 tracking-tight">Generate Roadmap</h3>
                            <p className="text-sm text-foreground/40 mb-8 max-w-xs mx-auto leading-relaxed">
                                Let AI break down this project into actionable milestones for you.
                            </p>
                            <button
                                onClick={handleGenerateTasks}
                                disabled={isGenerating}
                                className="glass-button inline-flex items-center gap-3 py-3.5 group"
                            >
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                                <span>{isGenerating ? "Roadmap loading..." : "Generate AI Roadmap"}</span>
                            </button>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {tasks.map((task) => (
                                <motion.div
                                    layout
                                    key={task.id}
                                    className={`p-6 rounded-2xl border border-foreground/[0.05] bg-foreground/[0.01] cursor-pointer hover:bg-foreground/[0.02] transition-colors mb-4 ${task.status === 'done' ? 'opacity-40 grayscale-[0.8]' : ''}`}
                                    onClick={() => toggleTaskStatus(task)}
                                >
                                    <div className="flex gap-5">
                                        <div className="pt-0.5">
                                            {updatingTaskId === task.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-foreground/20" />
                                            ) : task.status === 'done' ? (
                                                <CheckCircle2 className="w-5 h-5 text-foreground/40" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-foreground/10" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-bold tracking-tight mb-1.5 ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>
                                                {task.title}
                                            </h3>
                                            <p className="text-sm text-foreground/40 leading-relaxed">
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
