"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Sparkles,
    Search,
    Filter,
    ArrowRight,
    Layout,
    Users,
    Code2,
    Zap,
    CheckCircle2,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

interface Project {
    id: number;
    title: string;
    description: string;
    stack: string;
    type: string;
    created_at: string;
}

export default function ProjectHubPage() {
    const router = useRouter();
    const { checkAuth } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "solo" | "team">("all");

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            fetchProjects();
        };
        init();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateIdea = async () => {
        setIsGenerating(true);
        try {
            const response = await api.post('/projects/generate');
            const newProject = response.data;
            router.push(`/projects/${newProject.id}`);
        } catch (error) {
            console.error("Failed to generate AI project:", error);
            alert("AI generator is busy or not configured. Please try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === "all" || p.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-[3rem] border border-foreground/[0.03] bg-foreground/[0.01] p-12 md:p-20 shadow-2xl shadow-black/5">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            <Sparkles className="w-4 h-4" />
                            AI Persona Matching
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
                            The <br /><span className="text-primary italic">Project</span> Hub
                        </h1>
                        <p className="text-xl text-foreground/40 mb-12 max-w-lg font-bold leading-relaxed">
                            Generate bespoke engineering roadmaps or join high-performance teams to ship real, verified code.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleGenerateIdea}
                                disabled={isGenerating}
                                className="bg-foreground text-background px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-foreground/10 overflow-hidden relative group"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin p-0.5" />
                                        <span className="relative z-10">Architecting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                                        <span className="relative z-10">Generate AI Idea</span>
                                    </>
                                )}
                            </button>
                            <button className="px-8 py-4 rounded-2xl border border-foreground/5 bg-background/50 backdrop-blur-sm font-black text-sm flex items-center gap-3 hover:bg-foreground/5 transition-all group overflow-hidden relative">
                                <div className="absolute inset-0 bg-foreground/5 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                <Users className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10">Assemble Team</span>
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:flex justify-end relative">
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-80 h-48 rounded-[2.5rem] border border-foreground/[0.03] bg-foreground/[0.02] backdrop-blur-sm p-10 shadow-2xl shadow-black/5 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-50" />
                            <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 relative z-10">
                                <Code2 className="w-6 h-6 text-foreground/10" />
                            </div>
                            <div className="space-y-4 relative z-10">
                                <div className="h-1.5 w-full bg-foreground/5 rounded-full" />
                                <div className="h-1.5 w-3/4 bg-foreground/5 rounded-full opacity-60" />
                                <div className="h-1.5 w-1/2 bg-foreground/5 rounded-full opacity-30" />
                            </div>
                            <div className="absolute bottom-10 right-10 w-10 h-10 rounded-full bg-primary/10 blur-xl animate-pulse" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Control Bar */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-foreground/[0.01] border border-foreground/[0.03] p-3 rounded-[2rem]">
                <div className="relative w-full md:w-[32rem] group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search system nodes, stacks, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 h-14 bg-transparent border-none outline-none text-sm font-black tracking-tight placeholder:text-foreground/20"
                    />
                </div>
                <div className="flex gap-1.5 p-1 rounded-2xl bg-foreground/[0.02] w-full md:w-auto h-14">
                    {["all", "solo", "team"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={`flex-1 md:px-10 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${filterType === type ? 'bg-foreground text-background shadow-xl' : 'text-foreground/20 hover:text-foreground hover:bg-foreground/[0.02]'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Project Grid */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-80 rounded-[2.5rem] bg-foreground/[0.02] animate-pulse border border-foreground/[0.03]" />
                    ))}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-32 rounded-[3.5rem] border border-dashed border-foreground/5 bg-foreground/[0.01]">
                    <h3 className="text-3xl font-black mb-4 tracking-tighter">Empty Sector</h3>
                    <p className="text-foreground/30 font-bold uppercase tracking-widest text-[10px]">No active deployments found for this query.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={project.id}
                            className="p-10 rounded-[2.5rem] border border-foreground/[0.03] bg-foreground/[0.01] hover:bg-foreground/[0.02] hover:border-foreground/[0.08] transition-all duration-500 flex flex-col group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="flex justify-between items-center mb-10 relative z-10">
                                <div className="px-3 py-1.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/40 text-[9px] font-black uppercase tracking-[0.2em]">
                                    {project.type}
                                </div>
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/10">
                                    NODE_{project.id.toString().padStart(3, '0')}
                                </div>
                            </div>

                            <h3 className="text-3xl font-black tracking-tighter mb-4 group-hover:text-primary transition-colors leading-none relative z-10">
                                {project.title}
                            </h3>

                            <p className="text-foreground/40 text-sm font-bold leading-relaxed mb-10 line-clamp-3 relative z-10">
                                {project.description}
                            </p>

                            <div className="mt-auto relative z-10">
                                <div className="flex flex-wrap gap-2 mb-10">
                                    {project.stack.split(',').map(s => (
                                        <span key={s} className="px-3 py-1.5 rounded-xl bg-foreground/5 text-foreground/30 text-[9px] font-black uppercase tracking-widest group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                            {s.trim()}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    href={`/projects/${project.id}`}
                                    className="w-full h-14 bg-foreground/[0.03] border border-foreground/[0.05] text-foreground rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-foreground group-hover:text-background shadow-xl hover:shadow-foreground/10 overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                    <span className="relative z-10">Access Node</span>
                                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
