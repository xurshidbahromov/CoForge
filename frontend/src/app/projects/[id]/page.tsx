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
import { cn } from "@/lib/utils";

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
    const { checkAuth } = useAuth();
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
            const projRes = await api.get(`/projects`);
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
                <h2 className="text-3xl font-black mb-4 tracking-tighter">Node Not Found</h2>
                <Link href="/dashboard" className="text-primary font-bold hover:underline">Return to Secure Channel</Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
            {/* Nav & Back */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 hover:text-primary transition-all group"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Return to Core Dashboard
            </Link>

            {/* Project Header */}
            <div className="p-12 md:p-16 rounded-[3.5rem] border border-foreground/[0.03] bg-foreground/[0.01] relative overflow-hidden shadow-2xl shadow-black/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-8 mb-10">
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <span className="px-3 py-1 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em]">
                                    {project.type}
                                </span>
                                <span className="px-3 py-1 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground/40 text-[9px] font-black uppercase tracking-[0.2em]">
                                    {project.stack}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">{project.title}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href={`/projects/${id}/kanban`}
                                className="h-14 bg-foreground text-background px-8 rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-foreground/10 overflow-hidden relative group"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                <Layout className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Open Kanban</span>
                            </Link>
                            <div className="hidden sm:flex flex-col items-end px-8 py-3 rounded-2xl border border-foreground/[0.05] bg-foreground/[0.02]">
                                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/20 mb-1">Impact Potential</span>
                                <span className="text-lg font-black tracking-tighter">+{completedTasks * 50} <span className="text-[10px] opacity-20 uppercase">XP</span></span>
                            </div>
                        </div>
                    </div>

                    <p className="text-xl text-foreground/40 font-bold mb-12 max-w-3xl leading-relaxed">
                        {project.description}
                    </p>

                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Deployment Status</div>
                            <div className="text-2xl font-black tracking-tighter">{Math.round(progress)}%</div>
                        </div>
                        <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.5)]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Task List Component */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-foreground/20 flex items-center gap-4">
                            <div className="w-8 h-[1px] bg-foreground/10" />
                            Execution Sequence
                        </h2>
                        {tasks.length > 0 && (
                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                                {tasks.length} Nodes Active
                            </div>
                        )}
                    </div>

                    {tasks.length === 0 ? (
                        <div className="p-20 rounded-[3rem] border border-dashed border-foreground/5 bg-foreground/[0.01] text-center group">
                            <div className="w-20 h-20 rounded-[2rem] bg-foreground/[0.03] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-10 h-10 text-foreground/10" />
                            </div>
                            <h3 className="text-3xl font-black mb-4 tracking-tighter">Initialize Roadmap</h3>
                            <p className="text-foreground/30 font-bold text-sm mb-10 max-w-xs mx-auto leading-relaxed">
                                AI is ready to architect a high-performance roadmap for this node.
                            </p>
                            <button
                                onClick={handleGenerateTasks}
                                disabled={isGenerating}
                                className="bg-foreground text-background px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-4 mx-auto hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-foreground/20 overflow-hidden relative group/btn"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin p-0.5" />
                                        <span className="relative z-10">Compiling Sequence...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 relative z-10" />
                                        <span className="relative z-10">Architect AI Roadmap</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {tasks.map((task, i) => (
                                    <motion.div
                                        layout
                                        key={task.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className={cn(
                                            "p-8 rounded-[2rem] border border-foreground/[0.03] bg-foreground/[0.01] cursor-pointer hover:bg-foreground/[0.03] hover:border-foreground/[0.08] transition-all duration-300 flex items-center gap-8 group relative overflow-hidden",
                                            task.status === 'done' && "opacity-40 grayscale-[0.8]"
                                        )}
                                        onClick={() => toggleTaskStatus(task)}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative z-10 pt-1">
                                            {updatingTaskId === task.id ? (
                                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                            ) : task.status === 'done' ? (
                                                <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-lg border-2 border-foreground/10 group-hover:border-primary/40 transition-colors" />
                                            )}
                                        </div>

                                        <div className="flex-1 relative z-10">
                                            <h3 className={cn(
                                                "text-xl font-black tracking-tighter mb-1.5 group-hover:text-primary transition-colors",
                                                task.status === 'done' && "line-through opacity-50"
                                            )}>
                                                {task.title}
                                            </h3>
                                            <p className="text-sm font-bold text-foreground/30 leading-relaxed line-clamp-2">
                                                {task.description}
                                            </p>
                                        </div>

                                        <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Info Sidebar */}
                <div className="space-y-10">
                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/[0.08] via-transparent to-purple-500/[0.08] border border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl" />
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-primary flex items-center gap-3">
                            <MessageSquare className="w-4 h-4" />
                            Tactical Advisor
                        </h2>
                        <div className="p-6 rounded-2xl bg-foreground text-background shadow-2xl shadow-foreground/10 mb-8 relative">
                            <p className="text-sm font-bold italic leading-relaxed">
                                "Phase initialization complete. Focus on core architectural patterns before scaling features. Every node committed brings us closer to peak performance."
                            </p>
                        </div>
                        <button className="w-full h-12 rounded-xl bg-foreground/[0.03] border border-foreground/[0.05] text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-300">
                            Query Intelligence
                        </button>
                    </div>

                    <div className="p-8 rounded-[2.5rem] border border-foreground/[0.03] bg-foreground/[0.01]">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-foreground/20 flex items-center gap-3">
                            <ExternalLink className="w-4 h-4" />
                            Node Resources
                        </h2>
                        <div className="space-y-4">
                            {[
                                { label: "Project Schema", icon: Github },
                                { label: "Tech Specification", icon: Layout },
                                { label: "Deployment Docs", icon: Zap }
                            ].map((res, i) => (
                                <a key={i} href="#" className="flex items-center justify-between p-4 rounded-xl hover:bg-foreground/[0.02] border border-transparent hover:border-foreground/[0.05] transition-all group">
                                    <div className="flex items-center gap-3">
                                        <res.icon className="w-4 h-4 text-foreground/10 group-hover:text-primary transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-foreground transition-colors">{res.label}</span>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-foreground/10 group-hover:text-primary transition-all" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
