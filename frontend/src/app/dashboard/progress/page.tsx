"use client";

import { motion } from "framer-motion";
import { Award, TrendingUp, Zap, Calendar } from "lucide-react";

export default function ProgressPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black mb-2">My Progress</h2>
                <p className="text-foreground/60">Track your skills, streaks, and contributions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Skill Radar (Mock) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass-panel p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-12"
                >
                    <div className="flex-1 space-y-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <TrendingUp className="text-primary w-6 h-6" />
                            Skill Growth
                        </h3>
                        <p className="opacity-60">Your expertise is visualized based on completed tasks, code reviews, and AI assessments.</p>

                        <div className="space-y-4">
                            {[
                                { label: "Backend Architecture", val: 85, color: "bg-primary" },
                                { label: "Database Design", val: 70, color: "bg-blue-500" },
                                { label: "DevOps & CI/CD", val: 55, color: "bg-purple-500" },
                                { label: "System Security", val: 40, color: "bg-rose-500" },
                            ].map(skill => (
                                <div key={skill.label}>
                                    <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider opacity-70">
                                        <span>{skill.label}</span>
                                        <span>{skill.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.val}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full rounded-full ${skill.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Simple Radar Chart Visualization (CSS Shapes) */}
                    <div className="w-64 h-64 relative flex items-center justify-center">
                        {/* Background Circles */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="absolute rounded-full border border-white/5" style={{ width: `${i * 33}%`, height: `${i * 33}%` }} />
                        ))}
                        {/* Mock Polygon */}
                        <div className="absolute inset-0 bg-primary/20 rotate-12 scale-[0.7] skew-x-12 rounded-3xl blur-xl" />
                        <div className="absolute w-40 h-40 bg-gradient-to-br from-primary/40 to-blue-500/40 border-2 border-primary/50 mix-blend-screen rounded-full animate-pulse" style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }} />

                        <div className="absolute top-2 text-[10px] font-bold">Backend</div>
                        <div className="absolute bottom-6 right-2 text-[10px] font-bold">DB</div>
                        <div className="absolute bottom-6 left-2 text-[10px] font-bold">DevOps</div>
                    </div>
                </motion.div>

                {/* 2. Streak Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
                    <div className="w-24 h-24 mb-6 relative">
                        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
                        <Zap className="w-full h-full text-orange-500 fill-orange-500 relative z-10" />
                    </div>
                    <div className="text-5xl font-black mb-2">5</div>
                    <div className="text-sm font-bold uppercase tracking-widest opacity-60 mb-6">Day Streak</div>
                    <p className="text-xs opacity-50 px-6">You're on fire! 🔥 Keep coding for 2 more days to unlock the "Week Warrior" badge.</p>
                </motion.div>
            </div>

            {/* 3. Contribution Heatmap */}
            <div className="glass-panel p-8 rounded-[2rem] overflow-x-auto">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Calendar className="text-foreground/50 w-5 h-5" />
                    Activity Log
                </h3>
                <div className="flex gap-1 min-w-[800px]">
                    {[...Array(52)].map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {[...Array(7)].map((_, dayIndex) => {
                                const active = Math.random() > 0.7;
                                const intensity = Math.random();
                                return (
                                    <div
                                        key={dayIndex}
                                        className={`w-3 h-3 rounded-sm ${active ? (intensity > 0.5 ? 'bg-primary' : 'bg-primary/40') : 'bg-white/5'}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
