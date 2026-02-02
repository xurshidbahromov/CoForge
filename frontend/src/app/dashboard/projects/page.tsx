"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Search, Filter, Rocket, Database, Globe, Smartphone, ArrowRight, Star } from "lucide-react";
import { useState } from "react";

const projectIdeas = [
    { title: "AI Medical Consultant", stack: ["Python", "FastAPI", "OpenAI"], difficulty: "Hard", description: "Build a HIPPA-compliant chatbot for preliminary diagnosis." },
    { title: "Crypto Arbitrage Bot", stack: ["Rust", "Actix", "Redis"], difficulty: "Extreme", description: "High-frequency trading bot across 3 major exchanges." },
    { title: "Real-time Collab Whiteboard", stack: ["React", "Socket.io", "Node.js"], difficulty: "Medium", description: "Miro clone with real-time cursors and drawing." },
];

const communityProjects = [
    { title: "Defi Lending Protocol", author: "Sarah Connor", stars: 124, roles: ["Frontend", "Solidity"] },
    { title: "EcoTrack Mobile App", author: "GreenTeam", stars: 89, roles: ["React Native"] },
    { title: "Distributed File Storage", author: "PiedPiper", stars: 256, roles: ["Go", "DevOps"] },
    { title: "Social CRM", author: "SalesForceLite", stars: 45, roles: ["Vue", "Laravel"] },
    { title: "VR Museum Tour", author: "MetaVerseExplorer", stars: 210, roles: ["Unity", "C#"] },
    { title: "IoT Home Automation", author: "SmartHomeLabs", stars: 150, roles: ["C++", "Python"] },
];

export default function ProjectHub() {
    const [activeFilter, setActiveFilter] = useState("All");

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-black mb-2">Project Hub</h2>
                <p className="text-foreground/60">Discover your next breakthrough. Build solo or find a team.</p>
            </div>

            {/* 1. AI Generated Ideas */}
            <section>
                <div className="flex items-center gap-2 mb-6 text-primary font-bold uppercase tracking-widest text-xs">
                    <Sparkles className="w-4 h-4" />
                    Curated for you by AI
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {projectIdeas.map((idea, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-3xl group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3">
                                <span className="text-[10px] font-bold uppercase border border-white/10 px-2 py-1 rounded bg-white/5">{idea.difficulty}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{idea.title}</h3>
                            <p className="text-sm text-foreground/60 mb-6">{idea.description}</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {idea.stack.map(tech => (
                                    <span key={tech} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/5 font-mono opacity-70">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <button className="w-full py-2 rounded-lg bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                <div className="relative z-10 flex items-center gap-2"><Rocket className="w-4 h-4" /> Start Project</div>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 2. Community Projects */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <div className="flex items-center gap-2 text-foreground font-bold uppercase tracking-widest text-xs opacity-70">
                        <Users className="w-4 h-4" />
                        Community Projects
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                        {["All", "Frontend", "Backend", "Mobile", "Web3"].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeFilter === filter ? 'bg-foreground text-background' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communityProjects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="glass-panel p-5 rounded-2xl flex flex-col h-full border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-bold text-sm">
                                    {project.author[0]}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-yellow-400">
                                    <Star className="w-3 h-3 fill-yellow-400" /> {project.stars}
                                </div>
                            </div>

                            <h3 className="font-bold mb-1">{project.title}</h3>
                            <div className="text-xs text-foreground/40 mb-4">by {project.author}</div>

                            <div className="mt-auto">
                                <div className="text-[10px] font-bold uppercase opacity-50 mb-2">Open Roles</div>
                                <div className="flex gap-2">
                                    {project.roles.map(role => (
                                        <span key={role} className="text-xs px-2 py-1 rounded bg-rose-500/10 text-rose-400 font-medium">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
