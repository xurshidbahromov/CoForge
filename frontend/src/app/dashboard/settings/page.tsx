"use client";

import { useTheme } from "next-themes";
import { Bell, Lock, User, Palette, Globe, Github, Moon, Sun, Monitor } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="max-w-3xl">
            <h2 className="text-3xl font-black mb-8">Settings</h2>

            <div className="space-y-8">
                {/* 1. Account */}
                <section>
                    <h3 className="font-bold uppercase text-xs tracking-widest opacity-50 mb-4 px-2">Account</h3>
                    <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                        <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <User className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" />
                                <div>
                                    <div className="font-bold text-sm">Profile Information</div>
                                    <div className="text-xs text-foreground/40">Change your name and bio</div>
                                </div>
                            </div>
                            <button className="text-primary text-xs font-bold">Edit</button>
                        </div>
                        <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <Github className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" />
                                <div>
                                    <div className="font-bold text-sm">Connected Accounts</div>
                                    <div className="text-xs text-foreground/40">GitHub linked</div>
                                </div>
                            </div>
                            <span className="text-green-500 text-xs font-bold">Connected</span>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <Lock className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" />
                                <div>
                                    <div className="font-bold text-sm">Security</div>
                                    <div className="text-xs text-foreground/40">Password and 2FA</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Appearance */}
                <section>
                    <h3 className="font-bold uppercase text-xs tracking-widest opacity-50 mb-4 px-2">Appearance</h3>
                    <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                        {/* Theme Toggle */}
                        <div className="p-6 border-b border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <Palette className="w-5 h-5 text-foreground/60" />
                                    <div>
                                        <div className="font-bold text-sm">Interface Theme</div>
                                        <div className="text-xs text-foreground/40">Select your preferred look</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: 'light', icon: Sun, label: 'Light' },
                                    { value: 'dark', icon: Moon, label: 'Dark' },
                                    { value: 'system', icon: Monitor, label: 'System' },
                                ].map((option) => {
                                    const Icon = option.icon;
                                    const isActive = theme === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => setTheme(option.value)}
                                            className={`
                                                flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200
                                                ${isActive
                                                    ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10'
                                                    : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10 text-foreground/60'
                                                }
                                            `}
                                        >
                                            <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                                            <span className="text-xs font-bold">{option.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="p-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <Bell className="w-5 h-5 text-foreground/60" />
                                <div>
                                    <div className="font-bold text-sm">Notifications</div>
                                    <div className="text-xs text-foreground/40">Push and Email alerts</div>
                                </div>
                            </div>
                            <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                        </div>

                        {/* Language */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Globe className="w-5 h-5 text-foreground/60" />
                                <span className="font-bold text-sm">Language</span>
                            </div>
                            <span className="text-xs font-bold opacity-60">English</span>
                        </div>
                    </div>
                </section>

                <div className="pt-4">
                    <button className="text-red-400 text-sm font-bold hover:text-red-300 transition-colors">Delete Account</button>
                </div>
            </div>
        </div>
    );
}
