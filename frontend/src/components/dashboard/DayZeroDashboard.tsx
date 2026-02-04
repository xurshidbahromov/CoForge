import { motion } from "framer-motion";
import { Plus, Users, Sparkles, ArrowRight, BookOpen, User } from "lucide-react";
import Link from "next/link";

interface DayZeroProps {
    user: any; // Using any for now to avoid strict type issues with backend response, can refine later
}

export function DayZeroDashboard({ user }: DayZeroProps) {
    // Logic to determine recommendations
    const mode = user.work_preferences?.mode || "both";
    const level = user.level || "junior";

    // Determine Primary Action
    let PrimaryAction = {
        title: "Join a Project",
        desc: "Collaborate with others to build real-world experience.",
        cta: "Explore Projects",
        icon: Users,
        href: "/dashboard/projects",
        color: "bg-blue-500"
    };

    if (mode === "solo") {
        PrimaryAction = {
            title: "Start a Solo Project",
            desc: "Build a project on your own to showcase your individual skills.",
            cta: "Start Solo Project",
            icon: User,
            href: "/dashboard/projects/new",
            color: "bg-purple-500"
        };
    } else if (mode === "both" || mode === "team") {
        if (level === "senior" || level === "expert") {
            PrimaryAction = {
                title: "Create Your First Project",
                desc: "Lead a team and mentor others while building something great.",
                cta: "Create Project",
                icon: Plus,
                href: "/dashboard/projects/new",
                color: "bg-primary"
            };
        }
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-4xl mx-auto text-center px-4">

            {/* 1. Welcome & Confirmation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase tracking-wider mb-6">
                    <Sparkles className="w-3 h-3" />
                    Profile Verified
                </div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                    Welcome, <span className="text-gradient capitalize">{user.first_name}</span>.
                </h1>
                <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                    Your profile is ready. You’re all set to start building real experience.
                    <br className="hidden md:block" />
                    The best way to learn is to build.
                </p>
            </motion.div>

            {/* 2. Primary Action Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full max-w-lg mb-12"
            >
                <div className="glass-panel p-1 rounded-[2.5rem] relative group border-primary/20 hover:border-primary/40 transition-all shadow-2xl shadow-primary/5">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-[2.5rem] opacity-50 pointer-events-none" />

                    <div className="bg-card/50 backdrop-blur-xl rounded-[2.3rem] p-8 md:p-10 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 p-16 rounded-full blur-[80px] opacity-20 ${PrimaryAction.color}`} />

                        <div className={`w-16 h-16 rounded-3xl ${PrimaryAction.color} bg-opacity-10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500`}>
                            <PrimaryAction.icon className={`w-8 h-8 ${PrimaryAction.color.replace('bg-', 'text-')}`} />
                        </div>

                        <h2 className="text-2xl font-bold mb-3">{PrimaryAction.title}</h2>
                        <p className="text-foreground/60 mb-8 leading-relaxed">
                            {PrimaryAction.desc}
                        </p>

                        <Link href={PrimaryAction.href}>
                            <button className="w-full py-4 rounded-2xl bg-foreground text-background font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-foreground/10 group/btn">
                                <span className="relative z-10">{PrimaryAction.cta}</span>
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </Link>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium opacity-40">
                            <Sparkles className="w-3 h-3" />
                            Recommended based on your <strong>{user.primary_role}</strong> role & <strong>{mode}</strong> preference
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 3. Secondary Actions & Empty State */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col md:flex-row items-center gap-8 opacity-60 hover:opacity-100 transition-opacity"
            >
                <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
                    <User className="w-4 h-4" />
                    View My Profile
                </Link>
                <div className="w-1 h-1 rounded-full bg-foreground/20 hidden md:block" />
                <Link href="#" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
                    <BookOpen className="w-4 h-4" />
                    How Projects Work
                </Link>
            </motion.div>

        </div>
    );
}
