"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();
    const pageName = pathname?.split('/').pop() || 'Overview';
    const formattedTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace('-', ' ');

    return (
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-white/5 bg-background/50 backdrop-blur-sm sticky top-0 z-30">
            {/* Breadcrumbs / Page Title */}
            <div>
                <h1 className="text-xl font-bold tracking-tight">{formattedTitle === "Dashboard" ? "Overview" : formattedTitle}</h1>
                <p className="text-xs text-foreground/40 font-mono">/ {pageName === "dashboard" ? "overview" : pageName}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-full text-sm w-64 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-foreground/20"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-white/5 text-foreground/60 hover:text-foreground transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-500/50"></span>
                </button>
            </div>
        </header>
    );
}
