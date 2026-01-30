"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Users,
    Code2,
    Zap,
    Trophy,
    ArrowRight,
    Monitor,
    Database,
    Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock Data
const PROJECTS = [
    {
        id: 1,
        title: "E-Commerce API Service",
        description: "Build a high-performance RESTful API for a modern e-commerce platform using FastAPI and Redis.",
        stack: ["Python", "FastAPI", "Redis", "PostgreSQL"],
        difficulty: "Intermediate",
        teamSize: 4,
        currentMembers: 2,
        xp: 1200,
        category: "Backend",
    },
    {
        id: 2,
        title: "SaaS Dashboard UI",
        description: "Design and implement a responsive administration dashboard with real-time data visualization.",
        stack: ["React", "TypeScript", "TailwindCSS", "Framer Motion"],
        difficulty: "Beginner",
        teamSize: 3,
        currentMembers: 1,
        xp: 800,
        category: "Frontend",
    },
    {
        id: 3,
        title: "AI Image Processor",
        description: "Integrate OpenAI's DALL-E API into a collaborative tool for designers with version control.",
        stack: ["Node.js", "OpenAI", "AWS S3", "Next.js"],
        difficulty: "Advanced",
        teamSize: 5,
        currentMembers: 3,
        xp: 2500,
        category: "Fullstack",
    },
    {
        id: 4,
        title: "Blockchain Explorer",
        description: "Develop a web-based tool to monitor real-time transactions on a private Ethereum network.",
        stack: ["Solidity", "Go", "Vue.js", "Docker"],
        difficulty: "Advanced",
        teamSize: 6,
        currentMembers: 5,
        xp: 3500,
        category: "Web3",
    },
    {
        id: 5,
        title: "Task Management CLI",
        description: "A developer-focused command line interface for managing local project workflows.",
        stack: ["Rust", "Clap", "SQLite"],
        difficulty: "Intermediate",
        teamSize: 2,
        currentMembers: 1,
        xp: 1500,
        category: "Tools",
    },
    {
        id: 6,
        title: "Chat Application Meta",
        description: "Real-time communication platform with end-to-end encryption and file sharing capabilities.",
        stack: ["Socket.io", "Express", "React", "MongoDB"],
        difficulty: "Intermediate",
        teamSize: 4,
        currentMembers: 2,
        xp: 1800,
        category: "Fullstack",
    }
];

const CATEGORIES = ["All", "Frontend", "Backend", "Fullstack", "Web3", "Tools"];

export default function ProjectHubPage() {
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProjects = PROJECTS.filter(p => {
        const matchesCategory = filter === "All" || p.category === filter;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.stack.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Header & Search Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Project Hub</h1>
                    <p className="text-foreground/60 font-medium">Browse and join real-world engineering projects.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search stack, title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary/50 outline-none transition-all font-medium"
                        />
                    </div>
                    <button className="h-12 px-4 rounded-xl border border-foreground/5 bg-foreground/[0.02] flex items-center gap-2 hover:bg-foreground/[0.05] transition-colors">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-bold">More</span>
                    </button>
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={cn(
                            "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                            filter === cat
                                ? "bg-foreground text-background shadow-lg scale-105"
                                : "bg-foreground/[0.03] text-foreground/40 hover:text-foreground hover:bg-foreground/[0.06]"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel group p-1 flex flex-col rounded-[2.5rem] bg-white/50 dark:bg-white/5 border border-foreground/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
                        >
                            <div className="p-7 flex-1 flex flex-col">
                                {/* Card Top */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                                        project.category === "Backend" ? "bg-blue-500/10 text-blue-500" :
                                            project.category === "Frontend" ? "bg-orange-500/10 text-orange-500" :
                                                project.category === "Fullstack" ? "bg-purple-500/10 text-purple-500" :
                                                    "bg-green-500/10 text-green-500"
                                    )}>
                                        {project.category === "Backend" ? <Database className="w-6 h-6" /> :
                                            project.category === "Frontend" ? <Monitor className="w-6 h-6" /> :
                                                <Terminal className="w-6 h-6" />}
                                    </div>
                                    <div className="px-3 py-1 bg-foreground/[0.03] rounded-lg text-[10px] font-black uppercase tracking-tighter opacity-40">
                                        {project.difficulty}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-foreground/60 leading-relaxed mb-6 flex-1">
                                    {project.description}
                                </p>

                                {/* Stack */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.stack.slice(0, 3).map(s => (
                                        <span key={s} className="px-2.5 py-1 bg-foreground/[0.03] border border-foreground/5 rounded-md text-[10px] font-bold opacity-60">
                                            {s}
                                        </span>
                                    ))}
                                    {project.stack.length > 3 && (
                                        <span className="px-2.5 py-1 text-[10px] font-bold opacity-30">+{project.stack.length - 3} more</span>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="pt-6 border-t border-foreground/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[...Array(project.currentMembers)].map((_, i) => (
                                                <div key={i} className="w-7 h-7 rounded-full bg-foreground/[0.1] border-2 border-background flex items-center justify-center text-[8px] font-black shadow-sm">
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                            ))}
                                            {[...Array(project.teamSize - project.currentMembers)].map((_, i) => (
                                                <div key={i} className="w-7 h-7 rounded-full bg-foreground/[0.02] border-2 border-background border-dashed flex items-center justify-center text-[10px] opacity-20 shadow-sm">
                                                    +
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-foreground/40">{project.currentMembers}/{project.teamSize} Slots</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-primary">
                                        <Trophy className="w-3.5 h-3.5" />
                                        <span className="text-xs font-black">{project.xp} XP</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Join Button Overlay (Optional subtle effect) */}
                            <div className="p-2 pt-0 mt-auto">
                                <button
                                    onClick={() => toast.success(`Applied to ${project.title}!`, {
                                        description: "The project lead has been notified of your interest.",
                                    })}
                                    className="w-full py-4 bg-primary text-white rounded-[1.8rem] font-bold flex items-center justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-primary/20"
                                >
                                    Apply to Project
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-24 text-center glass-panel rounded-[3rem] border border-dashed border-foreground/10"
                >
                    <div className="w-16 h-16 bg-foreground/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Code2 className="w-8 h-8 text-foreground/20" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No projects found</h3>
                    <p className="text-foreground/40 max-w-xs mx-auto">Try adjusting your filters or search keywords to find other opportunities.</p>
                </motion.div>
            )}
        </div>
    );
}
