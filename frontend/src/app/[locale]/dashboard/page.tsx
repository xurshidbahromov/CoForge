"use client";

import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Trophy, Code2, GitPullRequest, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();

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
                        System Status: <span className="text-green-500">Operational</span> / Active Session
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 group cursor-default">
                        <Flame className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-black text-sm tracking-tight text-primary">3 Day Streak</span>
                    </div>
                </div>
            </motion.div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total XP", value: "12,450", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/5" },
                    { label: "Active Nodes", value: "03", icon: Code2, color: "text-primary", bg: "bg-primary/5" },
                    { label: "Deployments", value: "24", icon: GitPullRequest, color: "text-purple-500", bg: "bg-purple-500/5" },
                    { label: "Global Rank", value: "#4", icon: ArrowUpRight, color: "text-green-500", bg: "bg-green-500/5" }
                ].map((stat, i) => (
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
                            Current Deployment
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-tight">
                            E-Commerce API <br />Service Node
                        </h2>
                        <p className="text-background/50 mb-10 max-w-md font-bold text-sm leading-relaxed">
                            Implementing advanced Redis caching patterns and refining session persistence layers for high-load environments.
                        </p>

                        <div className="flex flex-wrap items-center gap-8 mb-10">
                            <div className="flex -space-x-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-2xl bg-background/10 border-4 border-foreground flex items-center justify-center text-xs font-black shadow-xl">
                                        U{i}
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-2xl bg-primary text-white border-4 border-foreground flex items-center justify-center text-sm font-black shadow-xl">+2</div>
                            </div>
                            <div className="h-10 w-px bg-background/10 hidden sm:block" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-background/30 tracking-widest mb-1">Completion</span>
                                <span className="text-xl font-black tracking-tight">85.4<span className="text-primary opacity-60">%</span></span>
                            </div>
                        </div>

                        <button className="bg-background text-foreground px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-black/20 overflow-hidden relative group/btn">
                            <div className="absolute inset-0 bg-foreground/5 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            <span className="relative z-10">Resume Execution</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* 4. Priority Tasks */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 px-4">Priority Sequence</h3>
                    <div className="space-y-4">
                        {[
                            { title: "Review PR #34", time: "2h ago", type: "CRITICAL", color: "text-red-500", dot: "bg-red-500" },
                            { title: "Complete SQL Lab", time: "15m left", type: "DAILY", color: "text-primary", dot: "bg-primary" },
                            { title: "Team Sync", time: "Tomorrow", type: "UPCOMING", color: "text-foreground/40", dot: "bg-foreground/20" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="p-6 rounded-[2rem] border border-foreground/[0.03] bg-foreground/[0.01] hover:bg-foreground/[0.03] transition-all duration-300 cursor-pointer group flex items-center justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                                        <span className={`text-[10px] font-black tracking-widest ${item.color}`}>{item.type}</span>
                                    </div>
                                    <div className="font-black tracking-tight group-hover:text-primary transition-colors text-lg">{item.title}</div>
                                    <div className="text-[10px] font-bold opacity-30 mt-1 uppercase tracking-tighter">{item.time}</div>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-foreground/10 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
