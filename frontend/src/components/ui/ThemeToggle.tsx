"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('[data-theme-toggle]')) {
                setShowOptions(false);
            }
        };

        if (showOptions) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => document.removeEventListener('click', handleClickOutside);
    }, [showOptions]);

    if (!mounted) {
        return (
            <button className="p-2 rounded-xl bg-secondary/10 opacity-50 cursor-not-allowed">
                <Sun className="w-5 h-5" />
            </button>
        );
    }

    const getCurrentIcon = () => {
        if (theme === "system") {
            return <Monitor className="w-5 h-5 text-primary transition-all duration-300 group-hover:scale-110" />;
        }
        if (theme === "dark") {
            return <Moon className="w-5 h-5 text-primary transition-all duration-300 group-hover:rotate-12" />;
        }
        return <Sun className="w-5 h-5 text-orange-500 transition-all duration-300 group-hover:rotate-90" />;
    };

    const options = [
        { value: "light", label: "Light", icon: Sun, color: "text-orange-500" },
        { value: "dark", label: "Dark", icon: Moon, color: "text-primary" },
        { value: "system", label: "System", icon: Monitor, color: "text-primary" },
    ];

    return (
        <div className="relative" data-theme-toggle>
            <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-xl hover:bg-foreground/5 transition-colors relative overflow-hidden group border border-transparent hover:border-foreground/10"
                aria-label="Toggle theme"
            >
                <div className="relative z-10">
                    {getCurrentIcon()}
                </div>
            </button>

            {/* Theme Options Dropdown */}
            {showOptions && (
                <div className="absolute right-0 mt-2 w-40 z-50">
                    {/* Glassmorphic background */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-xl rounded-xl border border-foreground/10 shadow-lg" />

                    <div className="relative p-1">
                        {options.map((option) => {
                            const Icon = option.icon;
                            const isActive = theme === option.value;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setTheme(option.value);
                                        setShowOptions(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? option.color : ""}`} />
                                    <span>{option.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* System preference indicator */}
                    {theme === "system" && (
                        <div className="relative px-3 py-2 border-t border-foreground/10">
                            <p className="text-xs text-foreground/50">
                                Using: {systemTheme === "dark" ? "Dark" : "Light"}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
