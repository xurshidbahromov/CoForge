"use client";

import { useAuth } from "@/lib/auth";
import { Bell, Search } from "lucide-react";

export function Header() {
    const { user } = useAuth();

    return (
        <header className="h-16 sticky top-0 md:pl-64 z-30 flex items-center justify-between px-6 bg-background/50 backdrop-blur-md border-b border-foreground/5">
            {/* Left: Breadcrumbs / Title */}
            <div className="flex items-center gap-4">
                <h1 className="text-sm font-bold text-foreground/60 uppercase tracking-widest">Dashboard</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search Bar (Visual) */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 border border-foreground/5 text-sm text-foreground/40 w-64">
                    <Search className="w-4 h-4" />
                    <span>Search projects...</span>
                </div>

                {/* Notifications */}
                <button className="p-2 rounded-full hover:bg-foreground/5 relative text-foreground/60 hover:text-foreground transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background" />
                </button>

                {/* User Mini Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-foreground/10">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold leading-none">{user?.username || "Developer"}</div>
                        <div className="text-[10px] text-foreground/40 uppercase font-semibold mt-0.5">Junior Engineer</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-background">
                        {user?.username?.charAt(0).toUpperCase() || "D"}
                    </div>
                </div>
            </div>
        </header>
    );
}
