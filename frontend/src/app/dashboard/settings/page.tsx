"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Lock,
    Bell,
    Globe,
    Github,
    Save,
    Trash2,
    ChevronRight,
    Moon,
    Sun,
    Camera,
    Mail,
    Smartphone,
    ShieldCheck,
    Eye,
    EyeOff
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TABS = [
    { id: "profile", name: "General Profile", icon: User },
    { id: "security", name: "Security", icon: Lock },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "app", name: "App Preferences", icon: Globe },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { theme, setTheme } = useTheme();

    // Mock Save Function
    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Profile saved successfully!", {
                description: "Your changes are now live on your profile.",
            });
        }, 1500);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tighter mb-2">Settings</h1>
                <p className="text-foreground/60 font-medium">Control your identity, security, and application experience.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group",
                                activeTab === tab.id
                                    ? "bg-foreground text-background shadow-xl scale-[1.02]"
                                    : "hover:bg-foreground/5 text-foreground/50 hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "opacity-100" : "opacity-50 group-hover:opacity-100")} />
                                <span className="font-bold text-sm tracking-tight">{tab.name}</span>
                            </div>
                            <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === tab.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-40")} />
                        </button>
                    ))}

                    <div className="pt-8">
                        <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all font-bold text-sm">
                            <Trash2 className="w-5 h-5" />
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="glass-panel p-8 lg:p-12 border border-foreground/5 bg-white/50 dark:bg-white/5"
                        >
                            {/* Profile Section */}
                            {activeTab === "profile" && (
                                <div className="space-y-10">
                                    <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-foreground/5">
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-[2.5rem] bg-foreground flex items-center justify-center text-4xl font-black text-background shadow-2xl overflow-hidden ring-4 ring-background">
                                                X
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
                                                <Camera className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight mb-2">Your Photo</h2>
                                            <p className="text-sm text-foreground/50 font-medium mb-4">This will be displayed on your profile and project cards.</p>
                                            <div className="flex gap-3">
                                                <button className="px-4 py-2 text-xs font-bold bg-foreground/[0.05] rounded-xl hover:bg-foreground/10 transition-colors">Change Photo</button>
                                                <button className="px-4 py-2 text-xs font-bold text-red-500/60 hover:text-red-500 transition-colors">Remove</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Full Name</label>
                                            <input className="w-full h-12 px-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary/40 outline-none font-bold" defaultValue="Xurshid Bahromov" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Username</label>
                                            <input className="w-full h-12 px-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary/40 outline-none font-bold" defaultValue="xurshidbahromov" />
                                        </div>
                                        <div className="lg:col-span-2 space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Bio</label>
                                            <textarea className="w-full min-h-[120px] p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary/40 outline-none font-medium resize-none" defaultValue="Full Stack Engineer specializing in premium web experiences." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Website</label>
                                            <input className="w-full h-12 px-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary/40 outline-none font-medium" defaultValue="xurshid.dev" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                                                <input className="w-full h-12 pl-12 pr-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 outline-none font-medium opacity-50 cursor-not-allowed" disabled defaultValue="xurshid@coforge.com" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Section */}
                            {activeTab === "security" && (
                                <div className="space-y-10">
                                    <div className="pb-8 border-b border-foreground/5">
                                        <h2 className="text-2xl font-black tracking-tight mb-2">Security Settings</h2>
                                        <p className="text-sm text-foreground/50 font-medium tracking-tight">Manage your session security and credentials.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="p-6 rounded-3xl bg-foreground/[0.02] border border-foreground/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                                    <h3 className="font-bold">Password Management</h3>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Last changed 3 months ago</span>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Current Password"
                                                        className="w-full h-12 px-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary/40 outline-none"
                                                    />
                                                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-foreground/50 transition-colors">
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                <input type="password" placeholder="New Password" className="w-full h-12 px-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary/40 outline-none" />
                                                <input type="password" placeholder="Confirm New Password" className="w-full h-12 px-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary/40 outline-none" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-6 rounded-3xl bg-foreground/[0.02] border border-foreground/5">
                                            <div className="flex items-center gap-5">
                                                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                                    <Smartphone className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">Two-Factor Authentication</h4>
                                                    <p className="text-xs text-foreground/40 font-medium">Add an extra layer of security to your account.</p>
                                                </div>
                                            </div>
                                            <button className="px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-black uppercase tracking-tighter">Enable 2FA</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Section */}
                            {activeTab === "app" && (
                                <div className="space-y-10">
                                    <div className="pb-8 border-b border-foreground/5">
                                        <h2 className="text-2xl font-black tracking-tight mb-2">App Preferences</h2>
                                        <p className="text-sm text-foreground/50 font-medium tracking-tight uppercase">Visual Experience & Theme Selection</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Dark Mode */}
                                        <button
                                            onClick={() => setTheme("dark")}
                                            className={cn(
                                                "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 text-center group relative overflow-hidden",
                                                theme === "dark"
                                                    ? "border-primary bg-primary/5 shadow-xl"
                                                    : "border-foreground/5 bg-foreground/[0.02] hover:border-foreground/10 opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            <div className="p-5 bg-background rounded-2xl group-hover:scale-110 transition-transform shadow-lg relative z-10">
                                                <Moon className={cn("w-10 h-10", theme === "dark" ? "text-primary" : "text-foreground/40")} />
                                            </div>
                                            <div className="relative z-10">
                                                <h4 className="font-black text-lg">Space Obsidian</h4>
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Dark Mode</p>
                                            </div>
                                            {theme === "dark" && (
                                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                    <ShieldCheck className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </button>

                                        {/* Light Mode */}
                                        <button
                                            onClick={() => setTheme("light")}
                                            className={cn(
                                                "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 text-center group relative overflow-hidden",
                                                theme === "light"
                                                    ? "border-primary bg-primary/5 shadow-xl"
                                                    : "border-foreground/5 bg-foreground/[0.02] hover:border-foreground/10 opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            <div className="p-5 bg-background rounded-2xl group-hover:scale-110 transition-transform shadow-lg relative z-10">
                                                <Sun className={cn("w-10 h-10", theme === "light" ? "text-orange-500" : "text-foreground/40")} />
                                            </div>
                                            <div className="relative z-10">
                                                <h4 className="font-black text-lg">Pure Light</h4>
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Light Mode</p>
                                            </div>
                                            {theme === "light" && (
                                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                    <ShieldCheck className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </button>

                                        {/* System Theme */}
                                        <button
                                            onClick={() => setTheme("system")}
                                            className={cn(
                                                "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 text-center group relative overflow-hidden",
                                                theme === "system"
                                                    ? "border-primary bg-primary/5 shadow-xl"
                                                    : "border-foreground/5 bg-foreground/[0.02] hover:border-foreground/10 opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            <div className="p-5 bg-background rounded-2xl group-hover:scale-110 transition-transform shadow-lg relative z-10">
                                                <Globe className={cn("w-10 h-10", theme === "system" ? "text-primary" : "text-foreground/40")} />
                                            </div>
                                            <div className="relative z-10">
                                                <h4 className="font-black text-lg">Dynamic System</h4>
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Auto Sync</p>
                                            </div>
                                            {theme === "system" && (
                                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                    <ShieldCheck className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Footer Save */}
                            <div className="mt-12 pt-8 border-t border-foreground/5 flex items-center justify-between gap-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 max-w-xs">
                                    Your data is stored securely and is never shared with third parties.
                                </p>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={cn(
                                        "h-14 px-10 rounded-2xl flex items-center gap-3 text-sm font-black transition-all",
                                        isSaving
                                            ? "bg-foreground/20 text-foreground cursor-not-allowed"
                                            : "bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-105"
                                    )}
                                >
                                    {isSaving ? "Saving..." : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
