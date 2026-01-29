"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Layout,
    Plus,
    Search,
    Filter,
    ArrowRight,
    Clock,
    CheckCircle2,
    Zap,
    TrendingUp,
    Award
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

interface Project {
    id: number;
    title: string;
    description: string;
    stack: string;
    type: string;
    created_at: string;
}

export default function DashboardPage() {
    const { user, checkAuth } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            try {
                const response = await api.get('/projects');
                setProjects(response.data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 px-2">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter mb-3">
                        Welcome back, {user?.username || 'Developer'}
                    </h1>
                    <p className="text-lg text-foreground/50 tracking-tight">
                        Your development journey at a glance.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/hub"
                        className="glass-button bg-foreground text-background flex items-center gap-2 group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        <span>New Project</span>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                    { label: "Active Projects", value: projects.length, icon: TrendingUp },
                    { label: "Tasks Completed", value: "0", icon: CheckCircle2 },
                    { label: "Experience Points", value: "0", icon: Award }
                ].map((stat) => (
                    <div key={stat.label} className="p-10 rounded-[2.5rem] border border-foreground/[0.05] bg-foreground/[0.01] flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center">
                            <stat.icon className="w-6 h-6 text-foreground/40" />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-foreground/30 mb-1">{stat.label}</div>
                            <div className="text-3xl font-bold tracking-tighter">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Active Projects List */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Layout className="w-5 h-5 text-primary" />
                            Your Projects
                        </h2>
                        <Link href="/projects" className="text-sm text-primary hover:underline">
                            View All
                        </Link>
                    </div>

                    {projects.length === 0 ? (
                        <div className="p-20 rounded-[3rem] border border-foreground/[0.05] bg-foreground/[0.01] text-center">
                            <div className="w-20 h-20 rounded-[2rem] bg-foreground/5 flex items-center justify-center mx-auto mb-8">
                                <Zap className="w-8 h-8 text-foreground/10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tighter">No active projects</h3>
                            <p className="text-foreground/40 mb-10 max-w-xs mx-auto text-lg leading-relaxed">
                                Start by generating an AI project or joining a team.
                            </p>
                            <Link
                                href="/hub"
                                className="glass-button inline-flex items-center gap-3 py-4"
                            >
                                <span>Go to Project Hub</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {projects.map((proj) => (
                                <Link
                                    key={proj.id}
                                    href={`/projects/${proj.id}`}
                                    className="p-8 rounded-[2rem] border border-foreground/[0.05] bg-foreground/[0.01] hover:bg-foreground/[0.02] transition-colors flex items-center justify-between group px-10"
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                            <Layout className="w-6 h-6 text-foreground/20 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors mb-2">
                                                {proj.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-foreground/30">
                                                <span className="flex items-center gap-1.5 grayscale opacity-50">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Started
                                                </span>
                                                <span className="bg-foreground/5 px-2.5 py-1 rounded-lg">
                                                    {proj.stack}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20 mb-3">Progress</div>
                                            <div className="w-24 h-1 bg-foreground/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-[10%] opacity-70" />
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-foreground/10 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar / AI Recommendations */}
                <div className="space-y-6">
                    <div className="glass rounded-3xl p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-accent" />
                            AI Recommendations
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="text-xs text-accent font-medium mb-1">Recommended Skill</div>
                                <h4 className="font-medium group-hover:text-primary transition-colors">Mastering Redux Toolkit</h4>
                                <p className="text-xs text-foreground/60 mt-1">Based on your recent React projects.</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="text-xs text-secondary font-medium mb-1">New Challenge</div>
                                <h4 className="font-medium group-hover:text-primary transition-colors">API Rate Limiting</h4>
                                <p className="text-xs text-foreground/60 mt-1">Level up your Backend expertise.</p>
                            </div>
                        </div>
                        <button className="w-full mt-4 text-sm text-primary hover:underline">
                            View Learning Path
                        </button>
                    </div>

                    <div className="glass rounded-3xl p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                        <h3 className="font-bold mb-2">Unicorn Challenge 🦄</h3>
                        <p className="text-sm text-foreground/70 mb-4">
                            Complete 3 projects this month to earn the Rare Badge!
                        </p>
                        <div className="w-full h-2 bg-white/10 rounded-full mb-2">
                            <div className="h-full bg-primary w-[33%]" />
                        </div>
                        <p className="text-xs text-foreground/50">1/3 Completed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
