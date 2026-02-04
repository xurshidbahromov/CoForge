"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Zap,
    Play,
    Sparkles,
    Code2,
    Trophy,
    Flame,
    Users,
    MessageSquare,
    TrendingUp,
    Clock,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { DayZeroDashboard } from "@/components/dashboard/DayZeroDashboard";

// --- Main Page Component ---

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get("http://localhost:8000/profile/me", { withCredentials: true });
                setUser(data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                toast.error("Could not load dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-pulse text-foreground/20 font-bold tracking-widest uppercase text-xs">Loading Workspace...</div>
            </div>
        );
    }

    if (!user) return null;

    // Day 0 Logic: specific check for empty projects
    // We check both projects array and stats for robustness
    const hasProjects = user.projects && user.projects.length > 0;

    if (!hasProjects) {
        return <DayZeroDashboard user={user} />;
    }

    return <DashboardContent user={user} />;
}


// --- Existing Dashboard Content (renamed) ---

// --- Existing Dashboard Content (renamed) ---

function DashboardContent({ user }: { user: any }) {
    // Get the most recent active project (first one since sorted by desc)
    const activeProject = user.projects && user.projects.length > 0 ? user.projects[0] : null;

    // Calculate progress for active project
    const progress = activeProject && activeProject.tasks_count > 0
        ? Math.round((activeProject.tasks_done / activeProject.tasks_count) * 100)
        : 0;

    // Parse stack for display
    const stackList = activeProject?.stack ? activeProject.stack.split(',').map((s: string) => s.trim()) : [];

    // Transform user skills for chart
    const skillList = user.skills ? Object.entries(user.skills).map(([name, level]) => ({
        label: name,
        val: level === 'Expert' ? 100 : level === 'Advanced' ? 80 : level === 'Intermediate' ? 60 : 40,
        color: 'bg-primary'
    })).slice(0, 3) : [];

    return (
        <div className="space-y-8 pb-8">
            {/* 1. Welcome & Status Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">Good morning, <span className="text-gradient capitalize">{user.first_name || 'Creator'}!</span> ☀️</h2>
                    <div className="flex items-center gap-3 text-foreground/60 font-medium">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs uppercase tracking-wider font-bold">{user.primary_role || 'Developer'}</span>
                        <span className="w-1 h-1 rounded-full bg-foreground/20" />
                        <span>Level {user.level === 'junior' ? '1' : user.level === 'mid' ? '2' : '3'} Contributor</span>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-lg font-medium italic opacity-80">"{user.primary_goal ? `Your goal: ${user.primary_goal}` : "Consistency is the key to mastery."}"</p>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-40 mt-1">Current Focus</div>
                </div>
            </div>

            {/* TOP ROW: Active Project & AI Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 2. Active Project Snapshot (Col span 2) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass-panel p-8 rounded-[2rem] relative overflow-hidden group border-primary/20"
                >
                    {activeProject ? (
                        <>
                            <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-50 transition-opacity">
                                <Code2 className="w-32 h-32 text-primary/10 -rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-wider border border-yellow-500/20">
                                        In Progress
                                    </span>
                                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-foreground/60">
                                        <Users className="w-3 h-3" />
                                        {activeProject.type === 'team' ? 'Team' : 'Solo'}
                                    </div>
                                </div>

                                <h3 className="text-3xl font-black mb-2 tracking-tight">{activeProject.title}</h3>
                                <p className="text-lg text-foreground/60 mb-8 max-w-lg leading-relaxed line-clamp-2">
                                    {activeProject.description || "No description provided."}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {stackList.map((tech: string, i: number) => (
                                        <span key={i} className="px-3 py-1.5 bg-background/50 border border-white/5 rounded-lg text-sm font-mono text-foreground/70">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="space-y-2 mb-8 max-w-xl">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span>Project Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)]" style={{ width: `${progress}%` }} />
                                    </div>
                                    <div className="text-xs text-foreground/40 font-mono text-right mt-1">
                                        {activeProject.tasks_done} / {activeProject.tasks_count} tasks completed
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Link href={`/dashboard/projects/${activeProject.id}`}>
                                        <button className="relative overflow-hidden group glass-button px-8 py-3.5 text-sm flex items-center gap-3 group/btn hover:bg-white/10">
                                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                            <Play className="w-4 h-4 fill-primary relative z-10" />
                                            <span className="relative z-10 font-bold">Continue Work</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-10">
                            <Code2 className="w-16 h-16 text-foreground/20 mb-4" />
                            <h3 className="text-xl font-bold mb-2">No Active Projects</h3>
                            <p className="text-foreground/60 mb-6">Launch your first project to see it here.</p>
                        </div>
                    )}
                </motion.div>

                {/* 7. AI Assistant Panel (Col span 1) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-[2rem] bg-gradient-to-b from-indigo-500/5 to-transparent border-indigo-500/10 flex flex-col"
                >
                    <div className="flex items-center gap-2 mb-6 text-indigo-400 font-bold uppercase tracking-widest text-xs">
                        <Sparkles className="w-4 h-4" />
                        nexus ai assistant
                    </div>

                    <div className="flex-1 flex flex-col justify-center mb-6">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-3 relative">
                            <div className="absolute -left-2 top-4 w-2 h-2 bg-white/5 rotate-45 border-l border-b border-white/5" />
                            <p className="text-sm font-medium leading-relaxed opacity-90">
                                "Ready to code, {user.first_name}? I can help you break down your next task for <strong>{activeProject?.title || 'your project'}</strong>."
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-3">
                        <Flame className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                        <div>
                            <div className="text-xs font-bold text-orange-300 uppercase mb-1">Status</div>
                            <p className="text-xs opacity-70 leading-relaxed">
                                You have {user.stats?.tasks_done || 0} tasks completed in total. Keep the momentum going!
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* MIDDLE ROW: Focus, Team, Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* 3. Today's Focus (Col span 2) - Still MOCKED for now as we don't fetch tasks here */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 glass-card p-6 rounded-[2rem]"
                >
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Quick Actions
                    </h3>

                    <div className="space-y-3">
                        <div className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Play className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Start a Work Session</div>
                                    <div className="text-xs text-foreground/50">Focus timer + AI assistance</div>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </div>
                        <div className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">Find a Mentor</div>
                                    <div className="text-xs text-foreground/50">Get help from senior devs</div>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </div>
                    </div>
                </motion.div>

                {/* 5. Team Snapshot (Col span 1) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-[2rem] flex flex-col"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Squad
                        </h3>
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center gap-4">
                        <div className="text-center opacity-50 text-sm">
                            <p>No active squad.</p>
                            <p className="text-xs mt-1">Join a team project to see members here.</p>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Skill Progress (Col span 1) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 rounded-[2rem] flex flex-col"
                >
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Skills
                    </h3>

                    <div className="space-y-5">
                        {skillList.map((skill, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span className="opacity-70">{skill.label}</span>
                                    <span>{skill.val}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.val}%` }} />
                                </div>
                            </div>
                        ))}
                        {skillList.length === 0 && (
                            <p className="text-xs opacity-50 text-center">No skills added yet.</p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* 6. Activity Feed (Bottom) Mocked for now */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-panel p-6 rounded-[2rem] border-white/5"
            >
                <div className="flex items-center gap-2 mb-4 opacity-50 text-xs font-bold uppercase tracking-widest px-2">
                    <Clock className="w-3 h-3" />
                    Momentum Feed
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="text-sm">
                            <span className="font-bold text-foreground">You</span> completed <span className="opacity-60">Database Schema</span>
                            <div className="text-[10px] opacity-40 font-bold mt-0.5">2 hours ago</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-sm">
                            <span className="font-bold text-foreground">Sarah</span> commented on <span className="opacity-60">PR #42</span>
                            <div className="text-[10px] opacity-40 font-bold mt-0.5">4 hours ago</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <Trophy className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-sm">
                            <span className="font-bold text-foreground">Alpha Squad</span> reached <span className="opacity-60">Milestone 2</span>
                            <div className="text-[10px] opacity-40 font-bold mt-0.5">Yesterday</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
