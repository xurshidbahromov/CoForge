"use client";

import { useAuth } from "@/lib/auth";
import { useProjects, useTasks, useStats, Project } from "@/hooks/useProjects";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { DashboardSkeleton } from "@/components/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy, Code2, GitPullRequest, ArrowUpRight, Sparkles, Plus, Loader2, ListTodo, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPage() {
    const { user } = useAuth();
    const { projects, isLoading, isGenerating, generateProject } = useProjects();
    const { stats, refetch: refetchStats } = useStats();
    const [activeProject, setActiveProject] = useState<Project | null>(null);

    const currentProject = activeProject || projects[0];
    const { tasks, generateTasks, isLoading: tasksLoading } = useTasks(currentProject?.id || null);

    const completedTasks = tasks.filter(t => t.status === "done").length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const handleGenerateProject = async () => {
        try {
            const result = await generateProject();
            setActiveProject(result.project);
            refetchStats();
            toast.success(`Project "${result.project.title}" created!`, {
                description: `${result.tasks?.length || 0} tasks auto-generated`
            });
        } catch (error) {
            console.error("Failed to generate project:", error);
            toast.error("Failed to generate project", {
                description: "Please try again later"
            });
        }
    };



    // Stats from profile API
    const statsData = [
        { label: "Projects", value: stats.projects_count, icon: Code2, color: "text-primary", bg: "bg-primary/5" },
        { label: "Completed", value: stats.tasks_done, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/5" },
        { label: "In Progress", value: stats.tasks_in_progress, icon: GitPullRequest, color: "text-purple-500", bg: "bg-purple-500/5" },
        { label: "Pending", value: stats.tasks_todo, icon: ListTodo, color: "text-orange-500", bg: "bg-orange-500/5" }
    ];

    // Show skeleton while loading
    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (

        <div className="space-y-10">
            {/* 1. Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 leading-none">
                        Welcome, <span className="text-primary italic">{user?.username || "Developer"}</span>
                    </h1>
                    <p className="text-foreground/40 font-bold uppercase tracking-[0.2em] text-[10px]">
                        Stack: <span className="text-primary">{user?.stack || "Not set"}</span> / Level: <span className="text-green-500">{user?.level || "Beginner"}</span>
                    </p>
                </div>
                <button
                    onClick={handleGenerateProject}
                    disabled={isGenerating}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300",
                        "bg-primary text-white hover:scale-105 active:scale-95 shadow-lg shadow-primary/20",
                        isGenerating && "opacity-70 cursor-not-allowed"
                    )}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate Project
                        </>
                    )}
                </button>
            </motion.div>

            {/* 2. Stats Grid with Animated Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 glass-panel rounded-[2rem] border border-foreground/[0.03] hover:border-foreground/[0.08] transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className={`${stat.bg} p-2.5 rounded-xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 group-hover:text-foreground/40 transition-colors">{stat.label}</span>
                        </div>
                        <div className="text-4xl font-black tracking-tighter relative z-10 group-hover:scale-[1.02] transition-transform origin-left">
                            <AnimatedCounter value={stat.value} duration={0.8} />
                        </div>
                        {/* Progress bar under stats */}
                        <div className="mt-4 h-1 bg-foreground/5 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${stat.bg.replace('/5', '')} opacity-50`}
                                initial={{ width: 0 }}
                                animate={{ width: stat.value > 0 ? `${Math.min(stat.value * 10, 100)}%` : '0%' }}
                                transition={{ delay: i * 0.1 + 0.5, duration: 0.8 }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}

            {/* Empty State */}
            {!isLoading && projects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 px-8 rounded-[2.5rem] border-2 border-dashed border-foreground/10 text-center"
                >
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter mb-2">No Projects Yet</h2>
                    <p className="text-foreground/40 mb-8 max-w-md">
                        Let AI generate your first project based on your {user?.stack || "stack"} preferences and {user?.goal || "goals"}.
                    </p>
                    <button
                        onClick={handleGenerateProject}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm bg-primary text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-primary/20"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        Generate My First Project
                    </button>
                </motion.div>
            )}

            {/* Active Project */}
            {!isLoading && currentProject && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* 3. Active Project (Large) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 p-10 md:p-12 rounded-[2.5rem] bg-foreground text-background relative overflow-hidden shadow-2xl shadow-foreground/10 group"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-all duration-1000" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-background/10 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Active Project • {currentProject.type}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter leading-tight">
                                {currentProject.title}
                            </h2>
                            <p className="text-background/50 mb-6 max-w-md font-bold text-sm leading-relaxed">
                                {currentProject.description}
                            </p>

                            {/* Stack Tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {currentProject.stack.split(',').map((tech, i) => (
                                    <span key={i} className="px-3 py-1 bg-background/10 rounded-lg text-xs font-bold">
                                        {tech.trim()}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-8 mb-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-background/30 tracking-widest mb-1">Progress</span>
                                    <span className="text-xl font-black tracking-tight">{progress}<span className="text-primary opacity-60">%</span></span>
                                </div>
                                <div className="h-10 w-px bg-background/10 hidden sm:block" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-background/30 tracking-widest mb-1">Tasks</span>
                                    <span className="text-xl font-black tracking-tight">{completedTasks}<span className="text-background/30">/{tasks.length}</span></span>
                                </div>
                                {/* Progress Circle */}
                                <div className="ml-auto">
                                    <svg className="w-16 h-16 transform -rotate-90">
                                        <circle cx="32" cy="32" r="28" className="fill-none stroke-background/10 stroke-[4]" />
                                        <motion.circle
                                            cx="32"
                                            cy="32"
                                            r="28"
                                            className="fill-none stroke-primary stroke-[4]"
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: "0 176" }}
                                            animate={{ strokeDasharray: `${progress * 1.76} 176` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link
                                    href={`/dashboard/projects/${currentProject.id}`}
                                    className="bg-background text-foreground px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-black/20 overflow-hidden relative group/btn"
                                >
                                    <div className="absolute inset-0 bg-foreground/5 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                    <span className="relative z-10">View Tasks</span>
                                    <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>

                                {tasks.length === 0 && (
                                    <button
                                        onClick={() => generateTasks()}
                                        className="bg-primary/20 text-primary px-6 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-primary/30 transition-all"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Generate Tasks
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* 4. Other Projects List */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 px-4">All Projects</h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {projects.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.05) }}
                                    onClick={() => setActiveProject(project)}
                                    className={cn(
                                        "p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer group flex items-center justify-between",
                                        currentProject?.id === project.id
                                            ? "border-primary/30 bg-primary/5"
                                            : "border-foreground/[0.03] bg-foreground/[0.01] hover:bg-foreground/[0.03]"
                                    )}
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                currentProject?.id === project.id ? "bg-primary" : "bg-foreground/20"
                                            )} />
                                            <span className={cn(
                                                "text-[10px] font-black tracking-widest uppercase",
                                                currentProject?.id === project.id ? "text-primary" : "text-foreground/40"
                                            )}>{project.type}</span>
                                        </div>
                                        <div className="font-black tracking-tight group-hover:text-primary transition-colors text-lg">{project.title}</div>
                                        <div className="text-[10px] font-bold opacity-30 mt-1 uppercase tracking-tighter">{project.stack.split(',')[0]}</div>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-foreground/10 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                </motion.div>
                            ))}

                            {/* Add New Project Button */}
                            <button
                                onClick={handleGenerateProject}
                                disabled={isGenerating}
                                className="w-full p-6 rounded-[2rem] border-2 border-dashed border-foreground/10 hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-2 text-foreground/40 hover:text-primary"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Plus className="w-5 h-5" />
                                )}
                                <span className="font-bold text-sm">Generate New</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
