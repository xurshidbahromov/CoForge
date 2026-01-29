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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                        Welcome back, {user?.username || 'Developer'}!
                    </h1>
                    <p className="text-foreground/70">
                        Track your progress and build new real-world experience.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/hub"
                        className="glass-button bg-gradient-to-r from-primary to-secondary text-white flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Project
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-card flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/20">
                        <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <div className="text-sm text-foreground/60">Active Projects</div>
                        <div className="text-2xl font-bold">{projects.length}</div>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-success/20">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                    <div>
                        <div className="text-sm text-foreground/60">Tasks Completed</div>
                        <div className="text-2xl font-bold">0</div>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent/20">
                        <Award className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <div className="text-sm text-foreground/60">XP Earned</div>
                        <div className="text-2xl font-bold">0</div>
                    </div>
                </div>
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
                        <div className="glass rounded-3xl p-12 text-center">
                            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 mb-4">
                                <Zap className="w-8 h-8 text-foreground/20" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">No active projects yet</h3>
                            <p className="text-foreground/60 mb-8 max-w-sm mx-auto">
                                Start by generating an AI project or joining a team to build your experience.
                            </p>
                            <Link
                                href="/hub"
                                className="glass-button inline-flex items-center gap-2"
                            >
                                Go to Project Hub
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {projects.map((proj) => (
                                <Link
                                    key={proj.id}
                                    href={`/projects/${proj.id}`}
                                    className="glass-card hover:translate-x-1 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Layout className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                {proj.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-foreground/50 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Just started
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full bg-white/10">
                                                    {proj.stack}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-xs text-foreground/40 mb-1">Progress</div>
                                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-[10%]" />
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
