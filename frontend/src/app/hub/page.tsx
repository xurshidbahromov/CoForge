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
            <div className="relative mb-12 overflow-hidden rounded-3xl glass p-8 md:p-12">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles className="w-4 h-4" />
                            AI-Powered Innovation
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            The <span className="gradient-text">Project Hub</span>
                        </h1>
                        <p className="text-lg text-foreground/70 mb-8 max-w-lg">
                            Generate custom project ideas tailored to your stack or join a team
                            to work on trending open-source challenges.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleGenerateIdea}
                                disabled={isGenerating}
                                className="glass-button bg-gradient-to-r from-primary to-secondary text-white flex items-center gap-2 px-8 py-4"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating your idea...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Generate AI Idea
                                    </>
                                )}
                            </button>
                            <button className="glass-button flex items-center gap-2 px-8 py-4">
                                <Users className="w-5 h-5" />
                                Form a Team
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-center">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative"
                        >
                            <div className="glass p-6 rounded-3xl border-primary/30 w-64 shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-primary/20">
                                        <Code2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="h-4 w-32 bg-white/10 rounded" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/5 rounded" />
                                    <div className="h-2 w-5/6 bg-white/5 rounded" />
                                    <div className="h-2 w-4/6 bg-white/5 rounded" />
                                </div>
                                <div className="mt-6 flex justify-between items-center">
                                    <div className="h-6 w-16 bg-primary/20 rounded-full" />
                                    <div className="h-6 w-6 bg-white/10 rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="glass-input w-full pl-12"
                    />
                </div>
                <div className="flex gap-2 p-1 glass rounded-xl w-full md:w-auto">
                    <button
                        onClick={() => setFilterType("all")}
                        className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'all' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5'}`}
                    >
                        All Projects
                    </button>
                    <button
                        onClick={() => setFilterType("solo")}
                        className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'solo' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5'}`}
                    >
                        Solo
                    </button>
                    <button
                        onClick={() => setFilterType("team")}
                        className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'team' ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5'}`}
                    >
                        Team
                    </button>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={project.id}
                            className="glass-card group flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${project.type === 'team' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                                    {project.type.toUpperCase()}
                                </div>
                                <div className="text-[10px] text-foreground/40 font-mono">
                                    ID: {project.id}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                {project.title}
                            </h3>

                            <p className="text-sm text-foreground/70 mb-6 line-clamp-3">
                                {project.description}
                            </p>

                            <div className="mt-auto pt-6 border-t border-white/5">
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.stack.split(',').map(s => (
                                        <span key={s} className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-medium border border-white/10">
                                            {s.trim()}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    href={`/projects/${project.id}`}
                                    className="glass-button w-full flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white"
                                >
                                    View Details
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
