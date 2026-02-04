"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Users,
    Search,
    Filter,
    Rocket,
    Plus,
    Layout,
    Globe,
    ArrowRight,
    Star,
    Loader2
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

export default function ProjectHub() {
    const [activeTab, setActiveTab] = useState<"my_projects" | "community">("my_projects");
    const [myProjects, setMyProjects] = useState([]);
    const [communityProjects, setCommunityProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joiningId, setJoiningId] = useState<number | null>(null);

    // Placeholder for AI Ideas (Curated)
    const projectIdeas = [
        { title: "AI Medical Consultant", stack: ["Python", "FastAPI", "OpenAI"], difficulty: "Hard", description: "Build a HIPPA-compliant chatbot for preliminary diagnosis." },
        { title: "Crypto Arbitrage Bot", stack: ["Rust", "Actix", "Redis"], difficulty: "Extreme", description: "High-frequency trading bot across 3 major exchanges." },
        { title: "Real-time Collab Whiteboard", stack: ["React", "Socket.io", "Node.js"], difficulty: "Medium", description: "Miro clone with real-time cursors and drawing." },
    ];

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const [myRes, commRes] = await Promise.all([
                axios.get("http://localhost:8000/projects", { withCredentials: true }),
                axios.get("http://localhost:8000/projects/community/all", { withCredentials: true })
            ]);
            setMyProjects(myRes.data);
            setCommunityProjects(commRes.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (projectId: number) => {
        setJoiningId(projectId);
        try {
            await axios.post(`http://localhost:8000/projects/${projectId}/join`, {}, { withCredentials: true });
            toast.success("Join request sent successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to join project");
        } finally {
            setJoiningId(null);
        }
    };

    return (
        <div className="space-y-8 min-h-[80vh]">
            <div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">Project Hub</h2>
                <p className="text-foreground/60">Manage your forge or join another squad.</p>
            </div>

            {/* 1. AI Generated Ideas (Restored) */}
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
                            className="glass-card p-6 rounded-3xl group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 p-3">
                                <span className="text-[10px] font-bold uppercase border border-white/10 px-2 py-1 rounded bg-white/5">{idea.difficulty}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{idea.title}</h3>
                            <p className="text-sm text-foreground/60 mb-6 flex-1">{idea.description}</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {idea.stack.map(tech => (
                                    <span key={tech} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/5 font-mono opacity-70">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <Link href={`/dashboard/projects/new?title=${encodeURIComponent(idea.title)}&stack=${encodeURIComponent(idea.stack.join(", "))}&description=${encodeURIComponent(idea.description)}`}>
                                <button className="w-full py-2 rounded-lg bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                    <div className="relative z-10 flex items-center gap-2"><Rocket className="w-4 h-4" /> Start Project</div>
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-2 mt-8">
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("my_projects")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'my_projects' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                    >
                        My Projects
                    </button>
                    <button
                        onClick={() => setActiveTab("community")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'community' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                    >
                        Explore Community
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "my_projects" ? (
                            <motion.div
                                key="my_projects"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-end">
                                    <Link href="/dashboard/projects/new">
                                        <button className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold flex items-center gap-2 transition-all">
                                            <Plus className="w-4 h-4" /> Create Project
                                        </button>
                                    </Link>
                                </div>

                                {myProjects.length === 0 ? (
                                    <div className="text-center py-20 glass-panel rounded-3xl border border-dashed border-white/10">
                                        <Rocket className="w-16 h-16 text-primary/20 mx-auto mb-6" />
                                        <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                                        <p className="text-foreground/50 mb-8 max-w-md mx-auto">
                                            You haven't forged anything yet. Start your journey by creating a new project.
                                        </p>
                                        <Link href="/dashboard/projects/new">
                                            <button className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-colors">
                                                Start Building
                                            </button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {myProjects.map((project: any) => (
                                            <div key={project.id} className="glass-card p-6 rounded-2xl group border border-white/5 hover:border-primary/50 transition-all cursor-pointer">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                                        {project.type}
                                                    </div>
                                                    <Layout className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                                <p className="text-sm opacity-60 line-clamp-2 mb-6 h-10">{project.description}</p>

                                                <div className="flex flex-wrap gap-2 mt-auto">
                                                    {project.stack && project.stack.split(',').slice(0, 3).map((t: string) => (
                                                        <span key={t} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 font-mono opacity-60">
                                                            {t.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="community"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {communityProjects.length === 0 ? (
                                        <div className="col-span-full text-center py-20 opacity-50">
                                            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No community projects found.</p>
                                        </div>
                                    ) : (
                                        communityProjects.map((project: any) => (
                                            <div key={project.id} className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-bold text-sm">
                                                        ?
                                                    </div>
                                                    <div className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                                                        {project.type}
                                                    </div>
                                                </div>

                                                <h3 className="font-bold mb-1 text-lg">{project.title}</h3>
                                                <p className="text-sm text-foreground/60 mb-6 line-clamp-2">{project.description}</p>

                                                <div className="mt-auto space-y-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.stack && project.stack.split(',').slice(0, 3).map((t: string) => (
                                                            <span key={t} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 font-mono opacity-60">
                                                                {t.trim()}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <button
                                                        onClick={() => handleJoin(project.id)}
                                                        disabled={joiningId === project.id}
                                                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-all flex items-center justify-center gap-2 hover:text-primary disabled:opacity-50"
                                                    >
                                                        {joiningId === project.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>Request to Join <ArrowRight className="w-4 h-4" /></>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
