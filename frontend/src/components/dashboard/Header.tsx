"use client";

import { useAuth } from "@/lib/auth";
import { Bell, Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
    collapsed: boolean;
    mobileOpen?: boolean;
    setMobileOpen?: (open: boolean) => void;
}

export function Header({ collapsed, mobileOpen, setMobileOpen }: HeaderProps) {
    const { user } = useAuth();

    return (
        <header className={cn(
            "h-16 sticky top-0 z-30 flex items-center justify-between px-6 bg-background/50 backdrop-blur-xl border-b border-foreground/[0.03] transition-all duration-300 ease-in-out",
            collapsed ? "md:pl-20" : "md:pl-64"
        )}>
            {/* Left: Breadcrumbs / Title / Mobile Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setMobileOpen?.(!mobileOpen)}
                    className="p-2 -ml-2 hover:bg-foreground/5 rounded-xl md:hidden transition-colors"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <h1 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] hidden sm:block">System / Dashboard</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/[0.05] focus-within:border-primary/30 transition-all duration-300 w-72 group">
                    <Search className="w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search system..."
                        className="bg-transparent border-none outline-none text-xs font-bold text-foreground placeholder:text-foreground/20 w-full"
                    />
                </div>

                {/* Notifications */}
                <button className="p-2.5 rounded-xl hover:bg-foreground/5 relative text-foreground/40 hover:text-foreground transition-all duration-300 group">
                    <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background ring-4 ring-primary/10" />
                </button>

                {/* User Mini Profile */}
                <div className="flex items-center gap-4 pl-6 border-l border-foreground/5">
                    <div className="text-right hidden md:block">
                        <div className="text-xs font-black leading-none tracking-tight">{user?.username || "Developer"}</div>
                        <div className="text-[9px] text-primary uppercase font-black mt-1 tracking-widest opacity-60">Junior Tier</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20 ring-1 ring-white/10 hover:scale-110 transition-transform cursor-pointer">
                        {user?.username?.charAt(0).toUpperCase() || "D"}
                    </div>
                </div>
            </div>
        </header>
    );
}
