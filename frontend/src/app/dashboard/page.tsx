"use client";

import { useAuth } from "@/lib/auth";
import { useProjects, useTasks, Project } from "@/hooks/useProjects";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Flame, Trophy, Code2, GitPullRequest, ArrowUpRight, Sparkles, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { user } = useAuth();
    const { projects, isLoading, isGenerating, generateProject } = useProjects();
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const { tasks } = useTasks(activeProject?.id || projects[0]?.id || null);

    const currentProject = activeProject || projects[0];
    const completedTasks = tasks.filter(t => t.status === "done").length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const handleGenerateProject = async () => {
        try {
            const newProject = await generateProject();
            setActiveProject(newProject);
        } catch (error) {
            console.error("Failed to generate project:", error);
        }
    };

    // Stats based on real data
    const stats = [
        { label: "Projects", value: projects.length.toString().padStart(2, '0'), icon: Code2, color: "text-primary", bg: "bg-primary/5" },
        { label: "Tasks Done", value: completedTasks.toString(), icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/5" },
        { label: "In Progress", value: tasks.filter(t => t.status === "in_progress").length.toString(), icon: GitPullRequest, color: "text-purple-500", bg: "bg-purple-500/5" },
        { label: "Pending", value: tasks.filter(t => t.status === "todo").length.toString(), icon: ArrowUpRight, color: "text-orange-500", bg: "bg-orange-500/5" }
    ];

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

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
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
                        <div className="text-4xl font-black tracking-tighter relative z-10 group-hover:scale-[1.02] transition-transform origin-left">{stat.value}</div>
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
                            </div>

                            <button className="bg-background text-foreground px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-black/20 overflow-hidden relative group/btn">
                                <div className="absolute inset-0 bg-foreground/5 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                <span className="relative z-10">View Tasks</span>
                                <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    {/* 4. Other Projects List */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 px-4">All Projects</h3>
                        <div className="space-y-4">
                            {projects.slice(0, 5).map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    onClick={() => setActiveProject(project)}
                                    className={cn(
                                        "p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer group flex items-center justify-between",
                                        currentProject.id === project.id
                                            ? "border-primary/30 bg-primary/5"
                                            : "border-foreground/[0.03] bg-foreground/[0.01] hover:bg-foreground/[0.03]"
                                    )}
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                currentProject.id === project.id ? "bg-primary" : "bg-foreground/20"
                                            )} />
                                            <span className={cn(
                                                "text-[10px] font-black tracking-widest uppercase",
                                                currentProject.id === project.id ? "text-primary" : "text-foreground/40"
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
                                <Plus className="w-5 h-5" />
                                <span className="font-bold text-sm">Generate New</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
