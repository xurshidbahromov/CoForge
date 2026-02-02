"use client";

import { motion } from "framer-motion";
import {
    Zap,
    ArrowRight,
    CheckCircle2,
    Play,
    Sparkles,
    Code2,
    Hammer,
    Trophy,
    Flame
} from "lucide-react";

export default function DashboardOverview() {
    return (
        <div className="space-y-8">
            {/* 1. Welcome Section */}
            <div>
                <h2 className="text-3xl font-black mb-1">Welcome back, <span className="text-gradient">John!</span> 👋</h2>
                <p className="text-foreground/60">Here is what's happening with your projects today.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 2. Active Project Summary (Left - 2 Cols) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-[2rem] relative overflow-hidden group border-primary/20"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Code2 className="w-24 h-24 text-primary/10 -rotate-12" />
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                            Active Project
                        </span>
                        <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <Flame className="w-3 h-3" /> 5 Day Streak
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2">E-Commerce Microservices API</h3>
                    <p className="text-foreground/60 mb-8 max-w-md">Building a scalable backend with Golang, gRPC, and PostgreSQL.</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {["Golang", "PostgreSQL", "Docker", "gRPC"].map(tech => (
                            <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-sm font-mono text-foreground/70">
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-2 mb-8">
                        <div className="flex justify-between text-sm font-bold">
                            <span>Progress</span>
                            <span>45%</span>
                        </div>
                        <div className="h-2 w-full bg-foreground/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[45%] rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="glass-button px-6 py-3 text-sm flex items-center gap-2 group/btn relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            <Play className="w-4 h-4 fill-primary relative z-10" />
                            <span className="relative z-10">Continue Building</span>
                        </button>
                        <button className="px-6 py-3 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">
                            View Details
                        </button>
                    </div>
                </motion.div>

                {/* 3. AI Mentor Tips (Right - 1 Col) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 relative"
                >
                    <div className="flex items-center gap-2 mb-6 text-indigo-400 font-bold uppercase tracking-widest text-xs">
                        <Sparkles className="w-4 h-4" />
                        AI Mentor Tip
                    </div>

                    <p className="text-lg font-medium leading-relaxed mb-6">
                        "I noticed you're struggling with <span className="text-white font-bold bg-indigo-500/20 px-1 rounded">gRPC</span> protobuffers. Want me to generate a simple example for your User service?"
                    </p>

                    <button className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all">
                        Yes, show me example
                    </button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 4. Today's Focus (Left - 1 Col) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-3xl"
                >
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Today's Focus
                    </h3>
                    <div className="space-y-3">
                        {[
                            { text: "Implement JWT Middleware", done: true },
                            { text: "Define proto files for Order Service", done: false },
                            { text: "Fix failing Docker build", done: false },
                        ].map((task, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${task.done ? 'bg-primary border-primary' : 'border-foreground/30 group-hover:border-primary'}`}>
                                    {task.done && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                                </div>
                                <span className={task.done ? 'line-through text-foreground/40' : 'text-foreground/80'}>{task.text}</span>
                            </div>
                        ))}
                        <button className="w-full py-3 mt-2 border border-dashed border-foreground/10 rounded-xl text-sm font-medium text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-all">
                            + Add Task
                        </button>
                    </div>
                </motion.div>

                {/* 5. Progress Snapshot (Middle - 1 Col) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-3xl"
                >
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-orange-400" />
                        Weekly Goals
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2 text-foreground/60">
                                <span>Commits</span>
                                <span>12 / 20</span>
                            </div>
                            <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-400 w-[60%] rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2 text-foreground/60">
                                <span>Code Reviews</span>
                                <span>2 / 5</span>
                            </div>
                            <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-400 w-[40%] rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2 text-foreground/60">
                                <span>Hours Coding</span>
                                <span>8 / 15h</span>
                            </div>
                            <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-400 w-[53%] rounded-full" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 6. Quick Actions (Right - 1 Col) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 rounded-3xl flex flex-col justify-center gap-4"
                >
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        <Hammer className="w-5 h-5 text-primary" />
                        Quick Actions
                    </h3>
                    <button className="w-full py-4 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-left border border-white/5 hover:border-primary/50 transition-all group">
                        <div className="font-bold mb-1 group-hover:text-primary transition-colors">Start New Project</div>
                        <div className="text-xs text-foreground/50">Generate ideas with AI</div>
                    </button>
                    <button className="w-full py-4 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-left border border-white/5 hover:border-primary/50 transition-all group">
                        <div className="font-bold mb-1 group-hover:text-primary transition-colors">Find a Mentor</div>
                        <div className="text-xs text-foreground/50">Get help from seniors</div>
                    </button>
                </motion.div>

            </div>
        </div>
    );
}
