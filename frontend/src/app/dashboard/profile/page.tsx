"use client";

import { Github, Globe, Linkedin, Mail, MapPin, Share2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
    return (
        <div className="space-y-8">
            {/* 1. Header Card */}
            <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-blue-500/20" />

                <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center gap-6 mt-12 px-4">
                    <div className="w-32 h-32 rounded-full border-4 border-background bg-zinc-800 flex items-center justify-center text-3xl font-bold shadow-2xl relative group">
                        {/* Placeholder for Avatar */}
                        <span>JS</span>
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs cursor-pointer">Edit</div>
                    </div>

                    <div className="flex-1 mb-2">
                        <h1 className="text-3xl font-black mb-1">John Smith</h1>
                        <div className="text-foreground/60 font-medium flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1"><Code className="w-4 h-4" /> Junior Backend Developer</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> San Francisco, CA</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><Github className="w-5 h-5" /></button>
                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"><Linkedin className="w-5 h-5" /></button>
                        <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                            <Share2 className="w-4 h-4" /> Share Profile
                        </button>
                    </div>
                </div>

                <div className="mt-8 px-4 max-w-3xl">
                    <h3 className="font-bold uppercase text-xs tracking-widest opacity-50 mb-2">About</h3>
                    <p className="text-foreground/80 leading-relaxed">
                        Passionate about building scalable backend systems. Currently mastering Go and Microservices architecture through CoForge. Looking for opportunities to work on high-load distributed systems.
                    </p>
                </div>

                <div className="mt-8 px-4 flex gap-2">
                    {["Go", "Python", "Docker", "Kubernetes", "PostgreSQL", "React"].map(skill => (
                        <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-foreground/70">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* 2. User Projects */}
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

                    {/* Project 2 */}
                    <div className="glass-card p-6 rounded-3xl group cursor-pointer hover:border-primary/30 transition-all opacity-80">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Layout className="w-6 h-6" /></div>
                            <div className="px-2 py-1 bg-white/5 text-foreground/40 text-[10px] font-bold uppercase rounded border border-white/10">In Progress</div>
                        </div>
                        <h4 className="text-lg font-bold mb-2">Task Management SAAS</h4>
                        <p className="text-sm text-foreground/60 mb-6">Real-time collaboration tool using WebSockets.</p>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[60%] rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icons needed for this page
import { Code, Database, Layout } from "lucide-react";
