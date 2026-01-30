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
    const { checkAuth } = useAuth();
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
                <h2 className="text-3xl font-black mb-4 tracking-tighter">Sector Not Found</h2>
                <Link href="/dashboard" className="text-primary font-bold hover:underline">Return to Hub</Link>
            </div>
        );
    }

    const { stats, projects, ai_summary } = profileData;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
            {/* Profile Header */}
            <div className="relative overflow-hidden rounded-[3rem] border border-foreground/[0.03] bg-foreground/[0.01] p-10 md:p-14 shadow-2xl shadow-black/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-purple-500/10 p-1 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                            <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-background flex items-center justify-center">
                                {profileData.user.avatar_url ? (
                                    <img src={profileData.user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-16 h-16 text-foreground/5" />
                                )}
                            </div>
                        </div>
                        <button className="absolute bottom-2 right-2 p-3 bg-foreground text-background rounded-2xl shadow-2xl hover:scale-110 transition-transform">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{profileData.user.username}</h1>
                            <div className="flex gap-3 justify-center md:justify-start">
                                <span className="px-4 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                                    {profileData.user.level || 'Junior Tier'}
                                </span>
                                <span className="px-4 py-1.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                    VERIFIED ENG
                                </span>
                            </div>
                        </div>

                        <p className="text-lg text-foreground/40 font-bold mb-8 max-w-2xl leading-relaxed">
                            Architecting decentralized solutions. Specialized in <span className="text-foreground">{typeof profileData.user.stack === 'string' ? profileData.user.stack : profileData.user.stack?.join(', ') || 'modern engineering'}</span>.
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-8">
                            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-foreground/20 hover:text-primary transition-colors cursor-pointer group">
                                <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>github/{profileData.user.username}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-foreground/20 hover:text-primary transition-colors cursor-pointer group">
                                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>Connect via Node</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className="p-8 rounded-[2.5rem] bg-foreground text-background shadow-2xl shadow-foreground/10 min-w-[260px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                            <div className="relative z-10">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Cumulative XP</div>
                                <div className="text-5xl font-black tracking-tighter mb-6 flex items-baseline gap-2">
                                    {stats.xp}
                                    <span className="text-xs font-black opacity-20 uppercase tracking-widest">PTS</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                                    <div className="h-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.5)] w-[65%] transition-all duration-1000" />
                                </div>
                                <div className="text-[9px] font-black uppercase tracking-widest opacity-30">Level 4 Node / 1,500 XP to Ascend</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Stats & AI */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="p-8 rounded-[2.5rem] border border-foreground/[0.03] bg-foreground/[0.01]">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-8 text-foreground/20 flex items-center gap-3">
                            <Activity className="w-4 h-4" />
                            Core Metrics
                        </h2>
                        <div className="space-y-4">
                            {[
                                { label: "Deployments", value: stats.projects_count, icon: Layout, color: "text-primary", bg: "bg-primary/5" },
                                { label: "Resolved", value: stats.tasks_completed, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/5" },
                                { label: "Certificates", value: "02", icon: Award, color: "text-purple-500", bg: "bg-purple-500/5" }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.03] hover:border-foreground/[0.08] transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                                            <stat.icon className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-foreground/60">{stat.label}</span>
                                    </div>
                                    <span className="text-xl font-black tracking-tighter">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 border border-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 text-primary flex items-center gap-3">
                            <Sparkles className="w-4 h-4" />
                            Persona Analysis
                        </h2>
                        <p className="text-sm font-bold text-foreground/60 leading-relaxed italic relative z-10">
                            "{ai_summary}"
                        </p>
                    </div>
                </div>

                {/* Project History */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-xl font-black uppercase tracking-[0.3em] text-foreground/20 flex items-center gap-3">
                            <Zap className="w-5 h-5" />
                            Deployment History
                        </h2>
                        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:scale-105 transition-transform flex items-center gap-2">
                            Export Dossier <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {projects.length === 0 ? (
                            <div className="p-20 text-center rounded-[3rem] border border-dashed border-foreground/5 bg-foreground/[0.01]">
                                <p className="text-xs font-black uppercase tracking-widest text-foreground/20 mb-8">No active record in this cluster.</p>
                                <Link href="/hub" className="bg-foreground text-background px-8 py-4 rounded-2xl font-black text-xs hover:scale-105 transition-transform shadow-xl">
                                    Initiate Deployment
                                </Link>
                            </div>
                        ) : (
                            projects.map((proj) => (
                                <Link
                                    key={proj.id}
                                    href={`/projects/${proj.id}`}
                                    className="p-8 rounded-[2.5rem] border border-foreground/[0.03] bg-foreground/[0.01] hover:bg-foreground/[0.03] hover:border-foreground/[0.1] transition-all duration-500 group flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                            <Layout className="w-8 h-8 text-foreground/10 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors mb-1">{proj.title}</h3>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">{proj.stack}</span>
                                                <div className="w-1 h-1 rounded-full bg-foreground/10" />
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{proj.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10 relative z-10">
                                        <div className="text-right">
                                            <div className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.3em] mb-2">Operational Impact</div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black tracking-tighter leading-none">{proj.tasks_done} <span className="text-[10px] opacity-20">/ {proj.tasks_count}</span></span>
                                                </div>
                                                <div className="w-24 h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)] transition-all duration-1000"
                                                        style={{ width: `${(proj.tasks_done / proj.tasks_count) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-foreground/[0.03] flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
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
