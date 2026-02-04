"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, MessageSquare, Github, Calendar, CheckCircle2, MoreHorizontal, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from 'next/link';

interface TeamProject {
    id: number;
    title: string;
    description: string;
    stack: string;
    user_role: string;
    members_count: number;
    preview_members: {
        id: number;
        username: string;
        avatar_url?: string;
    }[];
}

export default function TeamsPage() {
    const [teams, setTeams] = useState<TeamProject[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await axios.get("http://localhost:8000/projects/teams/mine", {
                withCredentials: true
            });
            setTeams(response.data);
        } catch (error) {
            console.error("Failed to fetch teams:", error);
            // toast.error("Failed to load your teams");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black mb-2">My Teams</h2>
                    <p className="text-foreground/60">Manage your squads and collaborate.</p>
                </div>
                <Link href="/dashboard/projects/new?type=team">
                    <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center gap-2 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        <UserPlus className="w-4 h-4 relative z-10" /> <span className="relative z-10">Create Team</span>
                    </button>
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-panel h-64 rounded-[2rem] flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Teams */}
                    {teams.map((team, index) => (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-8 rounded-[2rem] border-l-4 border-l-primary relative overflow-hidden group hover:border-l-primary/80 transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <Link href={`/dashboard/projects/${team.id}?tab=squad`} className="flex-1">
                                    <div className="flex items-center gap-4 cursor-pointer">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                                            {team.title.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{team.title}</h3>
                                            <div className="text-sm font-medium text-foreground/40">{team.stack.split(',')[0]} Microservices</div>
                                        </div>
                                    </div>
                                </Link>
                                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                    <MoreHorizontal className="w-5 h-5 opacity-50" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="text-xs font-bold uppercase opacity-40 mb-1">Your Role</div>
                                    <div className="font-bold text-primary">{team.user_role}</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="text-xs font-bold uppercase opacity-40 mb-1">Status</div>
                                    <div className="font-bold">Active</div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="text-sm font-bold opacity-60">Team Members</div>
                                <div className="flex -space-x-3">
                                    {team.preview_members.map((member, i) => (
                                        <div key={member.id} className="w-10 h-10 rounded-full bg-background border-2 border-background flex items-center justify-center text-xs font-bold bg-white/10 backdrop-blur-md overflow-hidden relative">
                                            {member.avatar_url ? (
                                                <img src={member.avatar_url} alt={member.username} className="w-full h-full object-cover" />
                                            ) : (
                                                member.username.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    ))}
                                    {team.members_count > team.preview_members.length && (
                                        <div className="w-10 h-10 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-xs font-bold text-foreground/40">
                                            +{team.members_count - team.preview_members.length}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link href={`/dashboard/projects/${team.id}`} className="flex-1">
                                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-colors border border-white/5">
                                        View Board
                                    </button>
                                </Link>
                                <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-sm transition-colors border border-white/5">
                                    Team Chat
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Team Matcher Promo */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-8 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <UserPlus className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Find a new squad</h3>
                        <p className="text-sm text-foreground/50 max-w-xs mb-6">Match with developers sharing your stack and timezone.</p>
                        <Link href="/dashboard/projects?tab=community">
                            <button className="px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:scale-105 transition-transform">
                                Start Matching
                            </button>
                        </Link>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
