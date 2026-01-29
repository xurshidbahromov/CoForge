"use client";

import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Trophy, Code2, GitPullRequest, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {/* 1. Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Welcome back, {user?.username || "Developer"}
                    </h1>
                    <p className="text-foreground/60">Ready to ship some code today?</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-xl border border-foreground/5">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-bold">3 Day Streak</span>
                </div>
            </motion.div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total XP", value: "12,450", icon: Trophy, color: "text-yellow-500" },
                    { label: "Projects", value: "3", icon: Code2, color: "text-primary" },
                    { label: "PRs Merged", value: "24", icon: GitPullRequest, color: "text-purple-500" },
                    { label: "Team Rank", value: "#4", icon: ArrowUpRight, color: "text-green-500" }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-6 glass-panel rounded-2xl bg-white/50 dark:bg-white/5 border border-foreground/5 hover:border-foreground/10 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            <span className="text-xs font-bold uppercase opacity-40">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* 3. Active Project (Large) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2 p-8 rounded-[2rem] bg-foreground text-background relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider mb-6">
                            Active Sprint
                        </div>
                        <h2 className="text-3xl font-bold mb-2">E-Commerce API Service</h2>
                        <p className="text-white/60 mb-8 max-w-md">
                            Implement the main product filtering logic and integrate Redis for caching session data.
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white/10 border-2 border-black flex items-center justify-center text-xs font-bold">
                                        U{i}
                                    </div>
                                ))}
                            </div>
                            <div className="h-10 w-[1px] bg-white/10" />
                            <div className="text-sm font-bold">
                                <span className="text-primary">85%</span> Complete
                            </div>
                        </div>

                        <div className="mt-8">
                            <button className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                                Continue Work <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Recommendations / Next Steps */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 px-2">Recommended</h3>
                    {[
                        { title: "Review PR #34", time: "2h ago", type: "Urgent" },
                        { title: "Complete SQL Drills", time: "15m left", type: "Daily" },
                        { title: "Team Sync", time: "Tomorrow", type: "Event" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            className="p-4 rounded-xl border border-foreground/5 bg-background hover:bg-foreground/[0.02] transition-colors cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-foreground/5 text-foreground/60">{item.type}</span>
                                <span className="text-xs opacity-40">{item.time}</span>
                            </div>
                            <div className="font-bold group-hover:text-primary transition-colors">{item.title}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
