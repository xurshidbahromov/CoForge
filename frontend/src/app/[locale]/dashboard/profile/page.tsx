"use client";

import { motion } from "framer-motion";
import {
    User as UserIcon,
    Mail,
    Github,
    Globe,
    Calendar,
    Trophy,
    Zap,
    Code2,
    Star,
    Award,
    GitPullRequest,
    CheckCircle2,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Profile Data
const PROFILE = {
    username: "xurshidbahromov",
    fullName: "Xurshid Bahromov",
    bio: "Full Stack Engineer specializing in premium web experiences and scalable backend architectures. Committed to building verified engineering history through open-source collaboration.",
    email: "xurshid@coforge.com",
    joined: "January 2026",
    xp: 12450,
    level: 14,
    github: "github.com/xurshidbahromov",
    website: "xurshid.dev",
    skills: [
        { name: "React / Next.js", proficiency: 95, category: "Frontend" },
        { name: "FastAPI / Python", proficiency: 90, category: "Backend" },
        { name: "TypeScript", proficiency: 92, category: "Language" },
        { name: "PostgreSQL", proficiency: 85, category: "Database" },
        { name: "Tailwind CSS", proficiency: 98, category: "Design" },
        { name: "AWS", proficiency: 75, category: "DevOps" },
    ],
    experience: [
        {
            id: 1,
            project: "CoForge Ecosystem",
            role: "Lead Maintainer",
            date: "Jan 2026 - Present",
            description: "Architected the core authentication system and premium design language for the developer ecosystem.",
            achievements: ["Zero-downtime migration", "Implemented glassmorphism engine"],
            tags: ["Next.js", "FastAPI", "SQLModel"],
            xp: 2500
        },
        {
            id: 2,
            project: "E-Commerce API Service",
            role: "Backend Developer",
            date: "Dec 2025",
            description: "Optimized database queries and implemented Redis caching for a high-traffic e-commerce platform.",
            achievements: ["Reduced latency by 45%", "Integrated Stripe API"],
            tags: ["Python", "Redis", "PostgreSQL"],
            xp: 1800
        }
    ],
    achievements: [
        { id: 1, name: "Early Adopter", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
        { id: 2, name: "Top Maintainer", icon: Trophy, color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: 3, name: "Clean Code Master", icon: Star, color: "text-purple-500", bg: "bg-purple-500/10" },
        { id: 4, name: "Bug Hunter", icon: Award, color: "text-green-500", bg: "bg-green-500/10" },
    ]
};

export default function ProfilePage() {
    return (
        <div className="space-y-12 pb-20">
            {/* Header Profile Section */}
            <section className="relative">
                {/* Banner Decoration */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-[2.5rem] -z-10 blur-xl opacity-50" />

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 px-6 pt-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group"
                    >
                        <div className="w-32 h-32 rounded-[2.5rem] bg-foreground flex items-center justify-center shadow-2xl overflow-hidden">
                            <div className="text-background text-5xl font-black">
                                {PROFILE.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-xl border-4 border-background">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </motion.div>

                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                                <h1 className="text-4xl font-black tracking-tighter">{PROFILE.fullName}</h1>
                                <span className="text-foreground/30 font-bold px-3 py-1 bg-foreground/[0.03] rounded-lg text-sm md:ml-2">
                                    @{PROFILE.username}
                                </span>
                            </div>
                            <p className="text-lg text-foreground/60 font-medium max-w-2xl mb-6 leading-relaxed">
                                {PROFILE.bio}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-2 text-sm font-bold text-foreground/50">
                                    <Mail className="w-4 h-4" />
                                    {PROFILE.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-primary transition-colors cursor-pointer">
                                    <Github className="w-4 h-4" />
                                    {PROFILE.github}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-primary transition-colors cursor-pointer">
                                    <Globe className="w-4 h-4" />
                                    {PROFILE.website}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-foreground/50">
                                    <Calendar className="w-4 h-4" />
                                    Joined {PROFILE.joined}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Level Stats Block */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-8 text-center min-w-[180px] bg-primary/5 border-primary/10"
                    >
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Current Level</div>
                        <div className="text-6xl font-black text-primary mb-2">{PROFILE.level}</div>
                        <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "65%" }}
                                className="h-full bg-primary"
                            />
                        </div>
                        <div className="mt-2 text-[10px] font-bold text-foreground/40 uppercase">350 XP to Next Level</div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Skills & Achievements */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-panel p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Zap className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">Expertise</h2>
                        </div>
                        <div className="space-y-6">
                            {PROFILE.skills.map((skill, i) => (
                                <div key={skill.name}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold">{skill.name}</span>
                                        <span className="text-[10px] font-black text-foreground/30 uppercase">{skill.category}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-foreground/[0.03] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.proficiency}%` }}
                                            transition={{ delay: 0.3 + (i * 0.1) }}
                                            className="h-full bg-primary/80"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Award className="w-5 h-5 text-amber-500" />
                            <h2 className="text-xl font-bold">Achievements</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {PROFILE.achievements.map((ach) => (
                                <div
                                    key={ach.id}
                                    className={cn("p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105 group", ach.bg)}
                                >
                                    <ach.icon className={cn("w-6 h-6", ach.color)} />
                                    <span className="text-[10px] font-black text-center uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                                        {ach.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Experience Timeline */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-10">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <GitPullRequest className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold">Verified Experience</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-black uppercase tracking-tighter text-green-500/80">Proof Validated</span>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {PROFILE.experience.map((exp, i) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="relative pl-8 border-l-2 border-foreground/5 group"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary group-hover:scale-125 transition-transform" />

                                    <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                                            {exp.project}
                                        </h3>
                                        <span className="text-xs font-bold text-foreground/40 whitespace-nowrap bg-foreground/[0.03] px-2 py-1 rounded-md">
                                            {exp.date}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <Code2 className="w-4 h-4 text-primary opacity-50" />
                                        <span className="text-sm font-bold text-foreground/70 uppercase tracking-wide">
                                            {exp.role}
                                        </span>
                                    </div>

                                    <p className="text-foreground/60 mb-6 leading-relaxed max-w-2xl">
                                        {exp.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {exp.tags.map(tag => (
                                            <span key={tag} className="px-2.5 py-1 bg-foreground/[0.03] border border-foreground/5 rounded-lg text-[10px] font-bold opacity-60">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {exp.achievements.map((ach, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm font-medium text-foreground/70">
                                                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                {ach}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center justify-between pt-4 border-t border-foreground/5">
                                        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-primary hover:gap-3 transition-all">
                                            View Proof on GitHub
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="flex items-center gap-1 text-primary">
                                            <Trophy className="w-3.5 h-3.5" />
                                            <span className="text-xs font-black">+{exp.xp} XP Earned</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
