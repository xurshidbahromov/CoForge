"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    MessageSquare,
    Shield,
    Clock,
    Plus,
    MoreHorizontal,
    Mail,
    Github,
    Award,
    ArrowUpRight,
    TrendingUp,
    History,
    UserPlus
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock Data
const TEAM_MEMBERS = [
    {
        id: 1,
        name: "Xurshid Bahromov",
        role: "Lead Maintainer",
        avatar: "X",
        status: "online",
        stats: { commits: 124, tasks: 42 },
        tags: ["Fullstack", "Architect"],
        social: { github: "xurshidb" }
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Senior Frontend",
        avatar: "S",
        status: "idle",
        stats: { commits: 89, tasks: 28 },
        tags: ["React", "Motion"],
        social: { github: "sarahc" }
    },
    {
        id: 3,
        name: "Marcus Miller",
        role: "Backend Engineer",
        avatar: "M",
        status: "online",
        stats: { commits: 156, tasks: 35 },
        tags: ["Python", "FastAPI"],
        social: { github: "mmiller" }
    },
    {
        id: 4,
        name: "Elena Rodriguez",
        role: "Security Lead",
        avatar: "E",
        status: "offline",
        stats: { commits: 45, tasks: 12 },
        tags: ["Security", "DevOps"],
        social: { github: "erodriguez" }
    }
];

const ACTIVITY_FEED = [
    { id: 1, user: "Marcus Miller", action: "merged PR", target: "#124 Optimize Redis", time: "2 min ago", icon: TrendingUp, color: "text-green-500" },
    { id: 2, user: "Sarah Chen", action: "commented on", target: "Hero.tsx", time: "1 hour ago", icon: MessageSquare, color: "text-blue-500" },
    { id: 3, user: "Xurshid Bahromov", action: "updated project", target: "Auth Flow", time: "3 hours ago", icon: Shield, color: "text-purple-500" },
    { id: 4, user: "Elena Rodriguez", action: "added task", target: "API Audit", time: "Yesterday", icon: Award, color: "text-amber-500" },
];

const PENDING_REQUESTS = [
    { id: 1, name: "Arjun Singh", role: "Junior Frontend", stack: ["Vue", "Tailwind"], xp: 1200 },
    { id: 2, name: "Lisa Wong", role: "Data Engineer", stack: ["Python", "Spark"], xp: 3400 },
];

export default function TeamHubPage() {
    const [activeTab, setActiveTab] = useState("members");

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">My Team</h1>
                    <p className="text-foreground/60 font-medium">Manage collaborators and track project momentum.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-11 px-4 rounded-xl border border-foreground/5 bg-foreground/[0.02] flex items-center gap-2 hover:bg-foreground/[0.05] transition-colors">
                        <UserPlus className="w-4 h-4" />
                        <span className="text-sm font-bold">Invite Member</span>
                    </button>
                    <button className="h-11 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        Create Squad
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Team Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Tabs */}
                    <div className="flex items-center gap-8 border-b border-foreground/5 mb-6">
                        {["members", "requests", "settings"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "pb-4 text-sm font-black uppercase tracking-widest transition-all relative",
                                    activeTab === tab ? "text-primary" : "text-foreground/30 hover:text-foreground/50"
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="teamTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "members" && (
                            <motion.div
                                key="members"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {TEAM_MEMBERS.map((member, i) => (
                                    <div key={member.id} className="glass-panel group p-6 border border-foreground/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center text-xl font-black shadow-lg">
                                                        {member.avatar}
                                                    </div>
                                                    <div className={cn(
                                                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-background shadow-sm",
                                                        member.status === 'online' ? "bg-green-500" : member.status === 'idle' ? "bg-amber-500" : "bg-foreground/20"
                                                    )} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg leading-tight">{member.name}</h3>
                                                    <p className="text-xs font-bold text-primary opacity-80 uppercase tracking-tighter">{member.role}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-foreground/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="w-4 h-4 text-foreground/40" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                                <div className="text-[10px] font-black uppercase tracking-tighter text-foreground/30 mb-1">Commits</div>
                                                <div className="text-xl font-black">{member.stats.commits}</div>
                                            </div>
                                            <div className="p-3 rounded-xl bg-foreground/[0.02] border border-foreground/5">
                                                <div className="text-[10px] font-black uppercase tracking-tighter text-foreground/30 mb-1">Resolved</div>
                                                <div className="text-xl font-black">{member.stats.tasks}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1.5">
                                                {member.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 bg-foreground/[0.03] border border-foreground/5 rounded-md text-[9px] font-bold opacity-50">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Github className="w-3.5 h-3.5 text-foreground/30 hover:text-primary transition-colors cursor-pointer" />
                                                <MessageSquare className="w-3.5 h-3.5 text-foreground/30 hover:text-primary transition-colors cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === "requests" && (
                            <motion.div
                                key="requests"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                {PENDING_REQUESTS.map(req => (
                                    <div key={req.id} className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-dashed border-foreground/10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-black">
                                                {req.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold">{req.name}</h3>
                                                    <span className="px-2 py-0.5 bg-primary/5 text-primary text-[9px] font-black uppercase rounded-md">
                                                        {req.xp} XP
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-foreground/40">{req.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="px-4 py-2 rounded-xl text-sm font-bold text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all">Decline</button>
                                            <button className="px-5 py-2 rounded-xl bg-foreground text-background text-sm font-black shadow-lg hover:scale-105 transition-transform">Accept Join</button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: Sidebar Stats */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Activity Feed */}
                    <div className="glass-panel p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <History className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Activity Feed</h2>
                        </div>
                        <div className="space-y-8 overflow-hidden">
                            {ACTIVITY_FEED.map((act, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    key={act.id}
                                    className="flex gap-4 relative"
                                >
                                    {i !== ACTIVITY_FEED.length - 1 && (
                                        <div className="absolute left-[11px] top-6 w-0.5 h-10 bg-foreground/[0.03]" />
                                    )}
                                    <div className={cn("w-6 h-6 rounded-full bg-foreground/[0.03] flex items-center justify-center shrink-0 mt-1", act.color)}>
                                        <act.icon className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium leading-relaxed">
                                            <span className="font-black text-foreground">{act.user}</span>
                                            <span className="text-foreground/40"> {act.action} </span>
                                            <span className="font-bold text-primary">{act.target}</span>
                                        </p>
                                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-20 mt-1 block">{act.time}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="glass-panel p-8 bg-primary text-white shadow-2xl shadow-primary/20">
                        <div className="flex items-center justify-between mb-8">
                            <TrendingUp className="w-6 h-6 opacity-50" />
                            <ArrowUpRight className="w-6 h-6 opacity-50" />
                        </div>
                        <div className="space-y-2 mb-8">
                            <h3 className="text-primary-foreground/60 font-bold text-sm uppercase tracking-widest">Team Momentum</h3>
                            <div className="text-5xl font-black">+42%</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                            <p className="text-xs font-medium text-white/80 leading-relaxed">
                                Your team has merged **12 PRs** and resolved **8 major blockers** this week. Excellent velocity!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
