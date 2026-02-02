"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Rocket,
    Users,
    MessageSquare,
    Bot,
    BarChart3,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Code2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Rocket, label: "Project Hub", href: "/dashboard/projects" },
    { icon: Users, label: "Teams", href: "/dashboard/teams" },
    { icon: MessageSquare, label: "Global Chat", href: "/dashboard/chat" },
    { icon: Bot, label: "AI Mentor", href: "/dashboard/mentor" },
    { icon: BarChart3, label: "Progress", href: "/dashboard/progress" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close mobile menu when route changes
    const handleLinkClick = () => setIsOpen(false);

    return (
        <>
            {/* Mobile Header Trigger */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-white/10 flex items-center px-4 z-50 justify-between">
                <div className="font-bold text-xl tracking-tighter">CoForge</div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-background/40 backdrop-blur-3xl border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 pt-20 md:pt-0 flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area (Desktop) */}
                <Link href="/" className="hidden md:flex items-center gap-2.5 group px-6 h-20 border-b border-white/5 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Code2 className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black tracking-tight">CoForge</span>
                </Link>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleLinkClick}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "text-primary navbar-glass shadow-lg shadow-primary/10"
                                        : "text-foreground/60 hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-primary transition-colors")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile / Logout (Bottom) */}
                <div className="p-4 mt-auto border-t border-white/5 mx-4 mb-4">
                    <div className="glass-panel p-3 rounded-xl flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                            JS
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">John Smith</div>
                            <div className="text-xs text-foreground/40 truncate">Level 5 • Junior</div>
                        </div>
                    </div>

                    <button className="relative overflow-hidden group w-full py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20">
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                        <LogOut className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
