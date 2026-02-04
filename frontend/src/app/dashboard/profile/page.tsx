"use client";

import { useEffect, useState } from "react";
import { Github, Globe, Linkedin, Mail, MapPin, Share2, Code, Database, Layout, Clock, User, Edit2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

interface UserProfile {
    username: string;
    first_name: string;
    last_name: string;
    primary_role: string;
    level: string;
    bio: string;
    city: string;
    country: string;
    skills: Record<string, string>;
    social_links: Record<string, string>;
    work_preferences: { mode: string };
    is_onboarding_completed: boolean;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Try fetching from backend
                const response = await axios.get("http://localhost:8000/profile/me", { withCredentials: true });
                setProfile(response.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                // Fallback to local storage for demo if backend fails or no cookie
                const localData = localStorage.getItem("onboarding-storage");
                if (localData) {
                    const parsed = JSON.parse(localData);
                    setProfile(parsed.state.data);
                } else {
                    toast.error("Could not load profile");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleShare = () => {
        if (!profile) return;
        // Construct public URL (assuming /u/username structure for future)
        // If username is missing, fallback to dashboard link or similar
        const username = profile.username || "me";
        const url = `${window.location.origin}/u/${username}`;
        navigator.clipboard.writeText(url);
        toast.success("Profile link copied to clipboard!");
    };

    if (loading) {
        return <div className="p-8 text-center opacity-50">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="p-8 text-center">Profile not found. <Link href="/onboarding" className="text-primary underline">Complete Onboarding</Link></div>;
    }

    return (
        <div className="space-y-8">
            {/* 1. Header Card */}
            <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-blue-500/20" />

                <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center gap-6 mt-12 px-4">
                    <div className="w-32 h-32 rounded-full border-4 border-background bg-zinc-800 flex items-center justify-center text-3xl font-bold shadow-2xl relative group">
                        {/* Placeholder for Avatar */}
                        <span className="uppercase">{profile.first_name?.[0]}{profile.last_name?.[0]}</span>
                        <Link href="/onboarding">
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs cursor-pointer text-white font-medium gap-1">
                                <Edit2 className="w-3 h-3" /> Edit
                            </div>
                        </Link>
                    </div>

                    <div className="flex-1 mb-2">
                        <div className="flex items-center gap-4 mb-1">
                            <h1 className="text-3xl font-black">{profile.first_name} {profile.last_name}</h1>
                            <Link href="/onboarding" className="p-2 hover:bg-white/5 rounded-full text-foreground/40 hover:text-primary transition-colors">
                                <Edit2 className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="text-foreground/60 font-medium flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-1"><Code className="w-4 h-4" /> {profile.level ? (profile.level.charAt(0).toUpperCase() + profile.level.slice(1)) : ''} {profile.primary_role}</span>
                            {(profile.city || profile.country) && (
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.city}, {profile.country}</span>
                            )}
                            {profile.work_preferences?.mode && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs uppercase font-bold tracking-wider">
                                    {profile.work_preferences.mode}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {profile.social_links?.github && (
                            <a
                                href={profile.social_links.github.startsWith('http') ? profile.social_links.github : `https://${profile.social_links.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-foreground block"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                        {profile.social_links?.linkedin && (
                            <a
                                href={profile.social_links.linkedin.startsWith('http') ? profile.social_links.linkedin : `https://${profile.social_links.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-foreground block"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                        <button
                            onClick={handleShare}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            <Share2 className="w-4 h-4" /> Share Profile
                        </button>
                    </div>
                </div>

                <div className="mt-8 px-4 max-w-3xl">
                    <h3 className="font-bold uppercase text-xs tracking-widest opacity-50 mb-2">About</h3>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {profile.bio || "No bio added yet."}
                    </p>
                </div>

                <div className="mt-8 px-4 flex flex-wrap gap-2">
                    {profile.skills && Object.keys(profile.skills).map(skill => (
                        <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-foreground/70">
                            {skill}
                        </span>
                    ))}
                    {(!profile.skills || Object.keys(profile.skills).length === 0) && (
                        <span className="text-sm opacity-50 italic">No skills selected</span>
                    )}
                </div>
            </div>

            {/* 2. User Projects (Static Placeholder) */}
            <div>
                <h3 className="text-xl font-bold mb-6 px-2">Verified Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project 1 */}
                    <div className="glass-card p-6 rounded-3xl group cursor-pointer hover:border-primary/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary"><Database className="w-6 h-6" /></div>
                            <div className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase rounded border border-green-500/20">Verified</div>
                        </div>
                        <h4 className="text-lg font-bold mb-2">E-Commerce API</h4>
                        <p className="text-sm text-foreground/60 mb-6">High-performance REST API handling 10k req/s.</p>
                        <div className="flex items-center gap-4 text-xs font-bold opacity-50">
                            <span className="flex items-end gap-1"><Github className="w-4 h-4" /> Repo</span>
                            <span className="flex items-end gap-1"><Globe className="w-4 h-4" /> Live Demo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
