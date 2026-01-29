"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-2 rounded-xl bg-secondary/10 opacity-50 cursor-not-allowed">
                <Sun className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-foreground/5 transition-colors relative overflow-hidden group border border-transparent hover:border-foreground/10"
            aria-label="Toggle theme"
        >
            <div className="relative z-10">
                {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-primary transition-all duration-300 group-hover:rotate-12" />
                ) : (
                    <Sun className="w-5 h-5 text-orange-500 transition-all duration-300 group-hover:rotate-90" />
                )}
            </div>
        </button>
    );
}
