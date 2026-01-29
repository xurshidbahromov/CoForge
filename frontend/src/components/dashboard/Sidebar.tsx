"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Code2,
    Users,
    Settings,
    CheckSquare,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";

const sidebarItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Project Hub", href: "/dashboard/projects", icon: Code2 },
    { name: "My Team", href: "/dashboard/team", icon: Users },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? "5rem" : "16rem" }}
            className={cn(
                "fixed left-0 top-0 h-screen bg-background border-r border-foreground/5 z-40 hidden md:flex flex-col transition-all duration-300",
                "glass-panel rounded-none border-y-0 border-l-0" // Using global glass style
            )}
        >
            {/* Sidebar Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-foreground/5">
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
                        <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                            <Code2 className="w-5 h-5" />
                        </div>
                        <span>CoForge</span>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-foreground/5 rounded-lg transition-colors ml-auto text-foreground/60 hover:text-foreground"
                >
                    {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-foreground/5 text-foreground font-semibold"
                                    : "text-foreground/60 hover:bg-foreground/[0.02] hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "group-hover:text-foreground")} />
                            {!collapsed && (
                                <span className="truncate">{item.name}</span>
                            )}

                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full opacity-100" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Footer / User */}
            <div className="p-4 border-t border-foreground/5">
                <button
                    onClick={logout}
                    className={cn(
                        "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-foreground/60 transition-colors",
                        collapsed && "justify-center px-0"
                    )}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="font-medium">Sign Out</span>}
                </button>
            </div>
        </motion.aside>
    );
}
