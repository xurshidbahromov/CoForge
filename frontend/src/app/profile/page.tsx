"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    User as UserIcon,
    Settings,
    MapPin,
    Link as LinkIcon,
    Github,
    Mail,
    Zap,
    Layout,
    CheckCircle2,
    Trophy,
    Activity,
    Award,
    Sparkles,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

interface ProfileData {
    user: {
        username: string;
        avatar_url?: string;
        stack?: string | string[];
        level?: string;
        goal?: string;
    };
    projects: Array<{
        id: number;
        title: string;
        stack: string;
        type: string;
        tasks_count: number;
        tasks_done: number;
    }>;
    stats: {
        projects_count: number;
        tasks_completed: number;
        xp: number;
    };
    ai_summary: string;
}

export default function ProfilePage() {
    const { user, checkAuth } = useAuth();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            try {
                const response = await api.get('/profile/me');
                setProfileData(response.data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
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

    if (!profileData) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
                <Link href="/dashboard" className="text-primary hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    const { stats, projects, ai_summary } = profileData;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <div className="glass rounded-3xl p-8 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 p-1">
                            <div className="w-full h-full rounded-[1.4rem] overflow-hidden glass">
                                {profileData.user.avatar_url ? (
                                    <img src={profileData.user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-full h-full p-8 text-foreground/20" />
                                )}
                            </div>
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 glass rounded-xl bg-white/10 hover:bg-primary/20 transition-colors shadow-xl">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h1 className="text-3xl font-bold">{profileData.user.username}</h1>
                            <div className="flex gap-2 justify-center md:justify-start">
                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase">
                                    {profileData.user.level || 'Junior'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase">
                                    PRO MEMBER
                                </span>
                            </div>
                        </div>

                        <p className="text-foreground/70 mb-6 max-w-2xl">
                            Building real-world experience. Passionate about {typeof profileData.user.stack === 'string' ? profileData.user.stack : profileData.user.stack?.join(', ') || 'software development'}.
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 text-sm text-foreground/50">
                                <Github className="w-4 h-4" />
                                github.com/{profileData.user.username}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground/50">
                                <Mail className="w-4 h-4" />
                                alex@example.com
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="glass shadow-2xl bg-primary/5 border-primary/20 p-6 rounded-3xl min-w-[200px]">
                            <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Total XP</div>
                            <div className="text-4xl font-bold text-primary flex items-baseline gap-1">
                                {stats.xp}
                                <span className="text-xs font-medium text-primary/60">XP</span>
                            </div>
                            <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[65%]" />
                            </div>
                            <div className="text-[10px] text-foreground/40 mt-1">Level 4: 1,500 XP to next rank</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Stats Grid */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass rounded-3xl p-6">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-secondary" />
                            Experience Stats
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Layout className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">Projects</span>
                                </div>
                                <span className="font-bold">{stats.projects_count}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-success/10">
                                        <CheckCircle2 className="w-4 h-4 text-success" />
                                    </div>
                                    <span className="text-sm font-medium">Tasks</span>
                                </div>
                                <span className="font-bold">{stats.tasks_completed}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-accent/10">
                                        <Award className="w-4 h-4 text-accent" />
                                    </div>
                                    <span className="text-sm font-medium">Badges</span>
                                </div>
                                <span className="font-bold">2</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-3xl p-6 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            AI Profile Summary
                        </h2>
                        <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
                            "{ai_summary}"
                        </p>
                    </div>
                </div>

                {/* Project History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Zap className="w-6 h-6 text-primary" />
                            Project Journey
                        </h2>
                        <button className="text-sm font-bold text-primary hover:underline">Download Resume</button>
                    </div>

                    <div className="grid gap-4">
                        {projects.length === 0 ? (
                            <div className="glass rounded-3xl p-12 text-center border-dashed">
                                <p className="text-foreground/50">Your journey hasn't started yet. Go build something amazing!</p>
                                <Link href="/hub" className="glass-button inline-flex items-center gap-2 mt-4">
                                    Explore Hub
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            projects.map((proj) => (
                                <Link
                                    key={proj.id}
                                    href={`/projects/${proj.id}`}
                                    className="glass-card flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-white/5 transition-all group"
                                >
                                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Layout className="w-7 h-7 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{proj.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-foreground/40">{proj.stack}</span>
                                                <div className="w-1 h-1 rounded-full bg-foreground/20" />
                                                <span className="text-xs font-bold text-primary uppercase">{proj.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <div className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider mb-1">Impact</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold">{proj.tasks_done}/{proj.tasks_count} Tasks</span>
                                                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-success"
                                                        style={{ width: `${(proj.tasks_done / proj.tasks_count) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
