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
    const { user, checkAuth } = useAuth();
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
            // Redirect to the new project's task list
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Header */}
            <div className="relative mb-16 overflow-hidden rounded-[3rem] border border-foreground/[0.05] bg-foreground/[0.01] p-12 md:p-20">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/40 text-[10px] font-bold uppercase tracking-widest mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            AI-Powered Design
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.1]">
                            The <span className="opacity-30">Project</span> Hub
                        </h1>
                        <p className="text-xl text-foreground/50 mb-10 max-w-lg leading-relaxed">
                            Generate custom projects tailored to your stack or join teams
                            to solve high-impact challenges.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleGenerateIdea}
                                disabled={isGenerating}
                                className="glass-button bg-foreground text-background flex items-center gap-3 px-8 py-4 group"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Roadmap loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span>Generate AI Idea</span>
                                    </>
                                )}
                            </button>
                            <button className="glass-button flex items-center gap-3 px-8 py-4">
                                <Users className="w-5 h-5 opacity-40" />
                                <span>Form a Team</span>
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-end pr-8">
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-72 h-44 rounded-3xl border border-foreground/[0.05] bg-foreground/[0.02] p-8 relative"
                        >
                            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-6">
                                <Code2 className="w-5 h-5 text-foreground/20" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-1.5 w-full bg-foreground/5 rounded-full" />
                                <div className="h-1.5 w-4/5 bg-foreground/5 rounded-full" />
                            </div>
                            <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full bg-primary/10" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
                <div className="relative w-full md:w-[28rem]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                    <input
                        type="text"
                        placeholder="Search for projects, stacks, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="glass-input w-full pl-14 h-14"
                    />
                </div>
                <div className="flex gap-1.5 p-1.5 rounded-2xl border border-foreground/[0.05] bg-foreground/[0.01] w-full md:w-auto h-14">
                    {["all", "solo", "team"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={`flex-1 md:px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filterType === type ? 'bg-foreground text-background shadow-md' : 'text-foreground/40 hover:text-foreground'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Project Grid */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="glass-card h-64 animate-pulse opacity-50" />
                    ))}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl border-dashed">
                    <h3 className="text-xl font-medium mb-2">No projects found</h3>
                    <p className="text-foreground/60">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={project.id}
                            className="p-10 rounded-[2.5rem] border border-foreground/[0.05] bg-foreground/[0.01] hover:bg-foreground/[0.02] transition-colors flex flex-col group"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div className="px-3 py-1.5 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/40 text-[9px] font-bold uppercase tracking-widest">
                                    {project.type}
                                </div>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-foreground/20">
                                    ID {project.id}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold tracking-tighter mb-4 group-hover:text-primary transition-colors">
                                {project.title}
                            </h3>

                            <p className="text-foreground/40 text-sm leading-relaxed mb-10 line-clamp-3">
                                {project.description}
                            </p>

                            <div className="mt-auto">
                                <div className="flex flex-wrap gap-1.5 mb-10">
                                    {project.stack.split(',').map(s => (
                                        <span key={s} className="px-2.5 py-1 rounded-lg bg-foreground/5 text-foreground/40 text-[10px] font-bold uppercase tracking-wider">
                                            {s.trim()}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    href={`/projects/${project.id}`}
                                    className="glass-button w-full flex items-center justify-center gap-3 py-4 group-hover:bg-foreground group-hover:text-background"
                                >
                                    <span>View Details</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
