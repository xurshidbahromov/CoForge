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
    Loader2,
    X,
    BrainCircuit,
    RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function ProjectHub() {
    const [activeTab, setActiveTab] = useState<"my_projects" | "community">("my_projects");
    const [myProjects, setMyProjects] = useState([]);
    const [communityProjects, setCommunityProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [joiningId, setJoiningId] = useState<number | null>(null);
    const router = useRouter();

    // Suggestions State
    const [suggestedIdeas, setSuggestedIdeas] = useState<any[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);

    // Brainstorming State
    const [isBrainstormOpen, setIsBrainstormOpen] = useState(false);
    const [brainstormStep, setBrainstormStep] = useState<"input" | "loading" | "results">("input");
    const [brainstormStack, setBrainstormStack] = useState("");
    const [brainstormLevel, setBrainstormLevel] = useState("Junior");
    const [brainstormIdeas, setBrainstormIdeas] = useState<any[]>([]);

    useEffect(() => {
        fetchProjects();
        fetchSuggestions();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const [myRes, commRes, userRes] = await Promise.all([
                axios.get("http://localhost:8000/projects", { withCredentials: true }),
                axios.get("http://localhost:8000/projects/community/all", { withCredentials: true }),
                axios.get("http://localhost:8000/profile/me", { withCredentials: true })
            ]);
            setMyProjects(myRes.data);
            setCommunityProjects(commRes.data);
            setCurrentUserId(userRes.data.id);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestions = async () => {
        setSuggestionsLoading(true);
        try {
            // We can allow this to fail silently or show a small error state, but let's try-catch it
            const response = await axios.get("http://localhost:8000/projects/suggestions", { withCredentials: true });
            if (response.data && response.data.length > 0) {
                setSuggestedIdeas(response.data);
            } else {
                // Fallback static data if AI fails or returns empty for some reason
                setSuggestedIdeas([
                    { title: "Portfolio Website", stack: "HTML, CSS, JS", difficulty: "Beginner", description: "A personal portfolio to showcase your skills." },
                    { title: "Task Manager", stack: "React, LocalStorage", difficulty: "Intermediate", description: "A simple kanban board for managing tasks." },
                    { title: "Weather App", stack: "React, OpenWeatherAPI", difficulty: "Beginner", description: "Fetch and display weather data for cities." },
                ]);
            }
        } catch (error) {
            console.error("Failed to fetch suggestions", error);
            setSuggestedIdeas([
                { title: "Portfolio Website", stack: "HTML, CSS, JS", difficulty: "Beginner", description: "A personal portfolio to showcase your skills." },
                { title: "Task Manager", stack: "React, LocalStorage", difficulty: "Intermediate", description: "A simple kanban board for managing tasks." },
                { title: "Weather App", stack: "React, OpenWeatherAPI", difficulty: "Beginner", description: "Fetch and display weather data for cities." },
            ]);
        } finally {
            setSuggestionsLoading(false);
        }
    }

    const refreshSuggestions = async () => {
        setSuggestionsLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/projects/suggestions/refresh", {}, { withCredentials: true });
            if (response.data && response.data.length > 0) {
                setSuggestedIdeas(response.data);
            }
        } catch (error) {
            console.error("Failed to refresh suggestions", error);
            toast.error("Failed to refresh suggestions");
        } finally {
            setSuggestionsLoading(false);
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

    const handleBrainstorm = async () => {
        if (!brainstormStack.trim()) {
            toast.error("Please enter a tech stack!");
            return;
        }
        setBrainstormStep("loading");
        try {
            const response = await axios.post("http://localhost:8000/projects/brainstorm", {
                stack: brainstormStack,
                level: brainstormLevel
            }, { withCredentials: true });
            setBrainstormIdeas(response.data);
            setBrainstormStep("results");
        } catch (error) {
            console.error("Brainstorm failed", error);
            toast.error("Failed to generate ideas. Please try again.");
            setBrainstormStep("input");
        }
    };

    return (
        <div className="space-y-8 min-h-[80vh] relative">
            <div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">Project Hub</h2>
                <p className="text-foreground/60">Manage your forge or join another squad.</p>
            </div>

            {/* AI Inspiration Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" /> Project Inspiration
                        </h2>
                        <p className="text-foreground/60">Personalized ideas based on your skills.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={refreshSuggestions}
                            disabled={suggestionsLoading}
                            className="p-2 rounded-lg hover:bg-white/5 text-foreground/50 hover:text-foreground transition-colors"
                            title="Refresh Suggestions"
                        >
                            <RefreshCw className={`w-5 h-5 ${suggestionsLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => { setIsBrainstormOpen(true); setBrainstormStep("input"); }}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-sm flex items-center gap-2"
                        >
                            <BrainCircuit className="w-4 h-4 text-primary" /> Brainstorm with AI
                        </button>
                    </div>
                </div>

                {suggestionsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass-card p-6 rounded-3xl h-[280px] animate-pulse flex flex-col">
                                <div className="h-6 w-3/4 bg-white/10 rounded mb-4" />
                                <div className="h-4 w-full bg-white/5 rounded mb-2" />
                                <div className="h-4 w-5/6 bg-white/5 rounded mb-6" />
                                <div className="mt-auto h-10 w-full bg-white/5 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {suggestedIdeas.map((idea, i) => (
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
                                <p className="text-sm text-foreground/60 mb-6 flex-1 line-clamp-3">{idea.description}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {(Array.isArray(idea.stack) ? idea.stack : (idea.stack || "").split(',')).map((tech: string) => (
                                        <span key={tech} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/5 font-mono opacity-70">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={async () => {
                                        if (idea.id) {
                                            try {
                                                await axios.delete(`http://localhost:8000/projects/suggestions/${idea.id}`, { withCredentials: true });
                                            } catch (e) {
                                                console.error("Failed to remove suggestion", e);
                                            }
                                        }
                                        router.push(`/dashboard/projects/new?title=${encodeURIComponent(idea.title)}&stack=${encodeURIComponent(Array.isArray(idea.stack) ? idea.stack.join(", ") : idea.stack)}&description=${encodeURIComponent(idea.description)}`);
                                    }}
                                    className="w-full py-2 rounded-lg bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                    <div className="relative z-10 flex items-center gap-2"><Rocket className="w-4 h-4" /> Start Project</div>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            {/* Brainstorm Modal Overlay */}
            <AnimatePresence>
                {isBrainstormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsBrainstormOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-panel w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsBrainstormOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-foreground/5 rounded-full transition-colors order-1"
                            >
                                <X className="w-5 h-5 opacity-50" />
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <BrainCircuit className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black mb-2">AI Project Architect</h3>
                                <p className="text-foreground/60">Let's find the perfect project for your stack.</p>
                            </div>

                            {brainstormStep === "input" && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold opacity-70 mb-2">Project Difficulty Level</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                            {["Beginner", "Junior", "Intermediate", "Advanced"].map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setBrainstormLevel(level)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${brainstormLevel === level ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 hover:bg-white/10 opacity-70 hover:opacity-100"}`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold opacity-70 mb-2">What tech stack do you want to use?</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Python, React, AWS"
                                            value={brainstormStack}
                                            onChange={(e) => setBrainstormStack(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-foreground/30"
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && handleBrainstorm()}
                                        />
                                        <p className="text-xs text-foreground/40 mt-2">Separate technologies with commas.</p>
                                    </div>
                                    <button
                                        onClick={handleBrainstorm}
                                        className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="w-5 h-5" /> Generate Ideas
                                    </button>
                                </div>
                            )}

                            {brainstormStep === "loading" && (
                                <div className="text-center py-12 space-y-4">
                                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                                    <p className="font-medium animate-pulse">Analyzing tech stack...</p>
                                </div>
                            )}

                            {brainstormStep === "results" && (
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {brainstormIdeas.map((idea, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:border-primary/30 transition-colors group flex flex-col md:flex-row gap-4 items-start md:items-center"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-bold text-lg">{idea.title}</h4>
                                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-foreground/60">{idea.difficulty}</span>
                                                </div>
                                                <p className="text-sm text-foreground/70 mb-2">{idea.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {idea.stack.split(',').map((t: string) => (
                                                        <span key={t} className="text-[10px] font-mono opacity-50 bg-black/5 dark:bg-black/20 px-1.5 py-0.5 rounded border border-white/5 dark:border-white/5">{t.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <Link href={`/dashboard/projects/new?title=${encodeURIComponent(idea.title)}&stack=${encodeURIComponent(idea.stack)}&description=${encodeURIComponent(idea.description)}`}>
                                                <button className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg text-sm hover:bg-primary hover:text-white transition-all flex items-center gap-2 whitespace-nowrap">
                                                    Start <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </motion.div>
                                    ))}
                                    <button
                                        onClick={() => setBrainstormStep("input")}
                                        className="w-full py-3 mt-4 text-sm font-bold opacity-50 hover:opacity-100 transition-opacity"
                                    >
                                        Try another stack
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-2 mt-8">
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setActiveTab("my_projects")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'my_projects' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 opacity-60 hover:opacity-100 hover:text-foreground'}`}
                    >
                        <Layout className="w-4 h-4" /> My Projects
                    </button>
                    <button
                        onClick={() => setActiveTab("community")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'community' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 opacity-60 hover:opacity-100 hover:text-foreground'}`}
                    >
                        <Globe className="w-4 h-4" /> Explore Community
                    </button>
                </div>
            </div>

            {
                loading ? (
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
                                            <button className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold flex items-center gap-2 transition-all hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                                <div className="relative z-10 flex items-center gap-2">
                                                    <Plus className="w-4 h-4" /> Create Project
                                                </div>
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
                                                <div key={project.id} className="glass-card p-6 rounded-2xl group border border-white/5 hover:border-primary/50 transition-all cursor-pointer flex flex-col h-full">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                                            {project.type}
                                                        </div>
                                                        <Layout className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                                    <p className="text-sm opacity-60 line-clamp-2 mb-6 h-10">{project.description}</p>

                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {project.stack && project.stack.split(',').slice(0, 3).map((t: string) => (
                                                            <span key={t} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 font-mono opacity-60">
                                                                {t.trim()}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="mt-auto">
                                                        <Link href={`/dashboard/projects/${project.id}`}>
                                                            <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-all flex items-center justify-center gap-2 hover:text-primary">
                                                                Open Project <ArrowRight className="w-4 h-4" />
                                                            </button>
                                                        </Link>
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
                                                        <div className="flex gap-2">
                                                            <div className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                                                                {project.type}
                                                            </div>
                                                            <div className="px-2 py-1 rounded bg-white/5 text-foreground/60 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                                <Users className="w-3 h-3" />
                                                                {project.members_count || 1}
                                                            </div>
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

                                                        {currentUserId === project.owner_id ? (
                                                            <Link href={`/dashboard/projects/${project.id}`}>
                                                                <button className="w-full py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm font-bold transition-all flex items-center justify-center gap-2 border border-purple-500/20">
                                                                    Manage My Project <ArrowRight className="w-4 h-4" />
                                                                </button>
                                                            </Link>
                                                        ) : (
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
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            }
        </div >
    );
}
