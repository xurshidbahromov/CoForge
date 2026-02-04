"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Briefcase, Award, Globe, Github, Linkedin, Twitter } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface UserProfileModalProps {
    userId: number | null;
    onClose: () => void;
}

interface UserProfile {
    id: number;
    username: string;
    avatar_url: string | null;
    first_name: string;
    last_name: string;
    bio: string;
    country: string;
    primary_role: string;
    level: string;
    skills: Record<string, string>;
    social_links: Record<string, string>;
    stats: {
        projects_count: number;
    };
}

export default function UserProfileModal({ userId, onClose }: UserProfileModalProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchProfile(userId);
        }
    }, [userId]);

    const fetchProfile = async (id: number) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/profile/${id}`, { withCredentials: true });
            setProfile(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load user profile");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!userId) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-panel w-full max-w-md rounded-3xl overflow-hidden relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                    >
                        <X className="w-5 h-5 opacity-70" />
                    </button>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : profile ? (
                        <>
                            {/* Header / Cover */}
                            <div className="h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 relative">
                                <div className="absolute -bottom-10 left-6">
                                    <div className="w-20 h-20 rounded-full bg-background border-4 border-background flex items-center justify-center text-2xl font-bold shadow-lg overflow-hidden">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
                                                {profile.username[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 px-6 pb-6 space-y-4">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        {profile.first_name} {profile.last_name}
                                        <span className="text-sm font-normal opacity-50">@{profile.username}</span>
                                    </h2>
                                    <div className="flex items-center gap-3 text-sm opacity-60 mt-1">
                                        <div className="flex items-center gap-1">
                                            <Briefcase className="w-3.5 h-3.5" />
                                            {profile.primary_role}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {profile.country}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm opacity-80 leading-relaxed">
                                    {profile.bio || "No bio provided yet."}
                                </p>

                                {/* Stats & Level */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="text-xs opacity-50 uppercase font-bold">Level</div>
                                        <div className="font-medium text-primary capitalize">{profile.level}</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="text-xs opacity-50 uppercase font-bold">Projects</div>
                                        <div className="font-medium">{profile.stats.projects_count}</div>
                                    </div>
                                </div>

                                {/* Skills */}
                                {profile.skills && Object.keys(profile.skills).length > 0 && (
                                    <div>
                                        <div className="text-xs opacity-50 uppercase font-bold mb-2">Top Skills</div>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.keys(profile.skills).slice(0, 5).map(skill => (
                                                <span key={skill} className="px-2 py-1 bg-white/5 rounded-lg text-xs border border-white/5">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Social Links */}
                                {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                                    <div className="flex gap-3 pt-2">
                                        {profile.social_links.github && (
                                            <a href={profile.social_links.github} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                        {profile.social_links.linkedin && (
                                            <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                        {profile.social_links.twitter && (
                                            <a href={profile.social_links.twitter} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                                <Twitter className="w-4 h-4" />
                                            </a>
                                        )}
                                        {profile.social_links.website && (
                                            <a href={profile.social_links.website} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                                <Globe className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-red-500">
                            User info unavailable
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
