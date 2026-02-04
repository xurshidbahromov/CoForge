"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Code2,
    Layers,
    MoreVertical,
    Play,
    Share2,
    Trophy,
    Users
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id;

    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"execution" | "squad">("execution");
    const [members, setMembers] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

    useEffect(() => {
        if (activeTab === "squad" && projectId) {
            fetchSquadData();
        }
    }, [activeTab, projectId]);

    const fetchProjectData = async () => {
        setLoading(true);
        try {
            const [projRes, tasksRes, userRes] = await Promise.all([
                axios.get(`http://localhost:8000/projects/${projectId}`, { withCredentials: true }),
                axios.get(`http://localhost:8000/tasks/${projectId}`, { withCredentials: true }),
                axios.get("http://localhost:8000/profile/me", { withCredentials: true })
            ]);
            setProject(projRes.data);
            setTasks(tasksRes.data);
            setIsOwner(projRes.data.owner_id === userRes.data.id);
            setLoading(false); // Make sure to start loading false here so we don't block UI if squad data is fetched later
        } catch (error) {
            console.error("Failed to load project", error);
            toast.error("Failed to load project details");
            router.push("/dashboard/projects");
        }
    };

    const fetchSquadData = async () => {
        try {
            const membersRes = await axios.get(`http://localhost:8000/projects/${projectId}/members`, { withCredentials: true });
            setMembers(membersRes.data);

            if (isOwner) {
                const requestsRes = await axios.get(`http://localhost:8000/projects/${projectId}/requests`, { withCredentials: true });
                setRequests(requestsRes.data);
            }
        } catch (error) {
            console.error("Failed to load squad", error);
        }
    };

    const handleRequestAction = async (reqId: number, action: "accept" | "reject") => {
        try {
            await axios.post(`http://localhost:8000/projects/${projectId}/requests/${reqId}/${action}`, {}, { withCredentials: true });
            toast.success(`Request ${action}ed`);
            fetchSquadData(); // Refresh list
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const toggleTaskStatus = async (task: any) => {
        const newStatus = task.status === "done" ? "todo" : "done";

        // Optimistic UI update
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

        try {
            await axios.patch(`http://localhost:8000/tasks/${task.id}`, { status: newStatus }, { withCredentials: true });
            if (newStatus === "done") {
                toast.success("Task completed! 🎉");
            }
        } catch (error) {
            console.error("Failed to update task", error);
            toast.error("Failed to update task");
            // Revert on failure
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t));
        }
    };

    const calculateProgress = () => {
        if (!tasks.length) return 0;
        const done = tasks.filter(t => t.status === "done").length;
        return Math.round((done / tasks.length) * 100);
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <span className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Loading Project...</span>
                </div>
            </div>
        );
    }

    if (!project) return null;

    const progress = calculateProgress();
    const stackList = project.stack ? project.stack.split(',').map((s: string) => s.trim()) : [];

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header / Nav */}
            <div className="mb-8">
                <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Project Hub
                </Link>

                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                                {project.type === 'team' ? 'Team Project' : 'Solo Quest'}
                            </span>
                            <span className="text-xs font-mono text-foreground/40">ID: #{project.id}</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-4">{project.title}</h1>
                        <p className="text-lg text-foreground/60 max-w-2xl leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex gap-3 items-start">
                        <button className="glass-button px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        {/* More actions dropdown placeholder */}
                        <button className="p-3 rounded-xl hover:bg-white/5 transition-colors">
                            <MoreVertical className="w-5 h-5 opacity-50" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats & Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-panel p-6 rounded-2xl md:col-span-2 border-primary/20">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Total Progress</div>
                            <div className="text-3xl font-black">{progress}% <span className="text-lg opacity-40 font-normal">completed</span></div>
                        </div>
                        <Trophy className={`w-8 h-8 ${progress === 100 ? 'text-yellow-400' : 'text-foreground/20'}`} />
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] translate-x-[-100%]" />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex flex-col justify-center">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                        {stackList.map((tech: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-white/5 border border-white/5 rounded text-xs font-mono text-foreground/80">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-white/5 mb-8">
                <button
                    onClick={() => setActiveTab("execution")}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'execution' ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                    Execution
                </button>
                <button
                    onClick={() => setActiveTab("squad")}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'squad' ? 'border-primary text-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                    Squad
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[300px]">
                {activeTab === "execution" ? (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Layers className="w-6 h-6 text-primary" />
                                Execution Plan
                            </h2>
                            <span className="text-sm font-bold opacity-50">{tasks.filter(t => t.status === "done").length}/{tasks.length} Tasks</span>
                        </div>

                        <div className="space-y-4">
                            {tasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`
                                        group relative p-6 rounded-2xl border transition-all duration-300
                                        ${task.status === "done"
                                            ? "bg-primary/5 border-primary/20"
                                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                                        }
                                    `}
                                >
                                    <label className="flex items-start gap-4 cursor-pointer">
                                        <div className="relative pt-1">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={task.status === "done"}
                                                onChange={() => toggleTaskStatus(task)}
                                            />
                                            <div className={`
                                                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                                ${task.status === "done"
                                                    ? "bg-primary border-primary scale-110"
                                                    : "border-foreground/30 peer-hover:border-primary peer-hover:scale-110"
                                                }
                                            `}>
                                                <CheckCircle2 className={`w-4 h-4 text-black font-bold transition-transform duration-300 ${task.status === "done" ? "scale-100" : "scale-0"}`} />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-bold text-lg transition-all ${task.status === "done" ? "text-primary line-through decoration-2 opacity-70" : "text-foreground"}`}>
                                                    {task.title}
                                                </h3>
                                                <span className="text-xs font-mono opacity-30 border border-white/10 px-2 py-0.5 rounded">
                                                    #{index + 1}
                                                </span>
                                            </div>
                                            <p className={`text-sm leading-relaxed transition-opacity ${task.status === "done" ? "opacity-50" : "opacity-70"}`}>
                                                {task.description}
                                            </p>
                                        </div>
                                    </label>

                                    {/* Optional: Add "Guide" button here later */}
                                    {/* <div className="mt-4 pl-10">
                                <button className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    View Guide <ArrowRight className="w-3 h-3" />
                                </button>
                            </div> */}
                                </motion.div>
                            ))}

                            {tasks.length === 0 && (
                                <div className="text-center py-20 opacity-50">
                                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No tasks generated for this project yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                                <Users className="w-6 h-6 text-primary" />
                                Active Squad
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {members.map((member) => (
                                    <div key={member.id} className="glass-card p-6 rounded-2xl flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden">
                                            {/* Avatar would go here */}
                                            <div className="w-full h-full flex items-center justify-center font-bold text-lg bg-gradient-to-br from-primary to-purple-600">
                                                {member.first_name[0]}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold flex items-center gap-2">
                                                {member.first_name} {member.last_name}
                                                {member.role === 'Owner' && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20 uppercase">Owner</span>}
                                            </div>
                                            <div className="text-xs opacity-60 font-mono">{member.primary_role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requests Section for Owner */}
                        {isOwner && (
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-3 mb-6 opacity-80">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Pending Requests
                                </h2>

                                <div className="space-y-4">
                                    {requests.length === 0 ? (
                                        <p className="opacity-40 italic">No pending requests.</p>
                                    ) : (
                                        requests.map((req) => (
                                            <div key={req.request_id} className="glass-panel p-4 rounded-xl flex items-center justify-between border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                                        {req.user.first_name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{req.user.first_name} {req.user.last_name}</div>
                                                        <div className="text-xs opacity-60">Level {req.user.level} {req.user.primary_role}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleRequestAction(req.request_id, "reject")}
                                                        className="px-4 py-2 rounded-lg hover:bg-white/10 text-xs font-bold transition-colors"
                                                    >
                                                        Decline
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(req.request_id, "accept")}
                                                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors"
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
