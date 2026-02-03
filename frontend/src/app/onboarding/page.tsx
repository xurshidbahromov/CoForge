"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import {
    CheckCircle2, ArrowRight, ChevronLeft, User, Briefcase, FileText,
    Code2, Clock, Globe, Target, Settings, Cpu, Smile
} from "lucide-react";
import { toast } from "sonner";

// --- Types ---

interface ProfileData {
    // 1. Personal
    first_name: string;
    last_name: string;
    country: string;
    city: string;
    timezone: string;
    language: string;

    // 2. Professional
    primary_role: string;
    level: string;

    // 3. Bio
    bio: string;

    // 4. Skills
    skills: Record<string, string>;

    // 5. Experience
    work_experience: string;

    // 6. Social
    social_links: Record<string, string>;

    // 7. Goals
    primary_goal: string;
    weekly_availability: string;

    // 8. Work Preference
    work_preference: {
        mode: string;
        size: string;
        style: string;
    };

    // 9. AI Preference
    ai_preference: {
        guidance: string;
        areas: string[];
    };
}

const INITIAL_DATA: ProfileData = {
    first_name: "", last_name: "", country: "", city: "", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, language: "English",
    primary_role: "Fullstack Developer", level: "Junior",
    bio: "",
    skills: {},
    work_experience: "",
    social_links: { github: "", linkedin: "", portfolio: "" },
    primary_goal: "Get a job", weekly_availability: "10-20 hours",
    work_preference: { mode: "Team", size: "3-5", style: "Async" },
    ai_preference: { guidance: "Balanced", areas: ["Code Explanation"] }
};

// ... Options ...
const ROLES = ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Mobile Developer", "DevOps/SRE", "Data/AI"];
const LEVELS = ["Beginner", "Junior", "Mid-Level", "Senior"];
const GOALS = ["Get a job", "Build portfolio", "Learn by doing", "Startup experience"];
const AVAILABILITY = ["< 5 hours", "5-10 hours", "10-20 hours", "20+ hours"];
const SKILLS_LIST = ["React", "TypeScript", "Node.js", "Python", "Go", "PostgreSQL", "TailwindCSS", "Docker", "AWS", "Next.js"];

export default function OnboardingPage() {
    const { checkAuth } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<ProfileData>(INITIAL_DATA);
    const [loading, setLoading] = useState(false);

    const updateData = (field: keyof ProfileData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const updateNested = (parent: keyof ProfileData, key: string, value: any) => {
        setData(prev => ({
            ...prev,
            [parent]: { ...(prev[parent] as any), [key]: value }
        }));
    };

    const handleNext = () => {
        if (step < 10) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const submitProfile = async () => {
        setLoading(true);
        try {
            await api.put("/profile/onboarding", data);
            toast.success("Profile setup complete!");
            await checkAuth(); // Refresh user state
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, icon: User, label: "Personal" },
        { id: 2, icon: Briefcase, label: "Role" },
        { id: 3, icon: FileText, label: "Bio" },
        { id: 4, icon: Code2, label: "Skills" },
        { id: 5, icon: Clock, label: "History" },
        { id: 6, icon: Globe, label: "Social" },
        { id: 7, icon: Target, label: "Goals" },
        { id: 8, icon: Settings, label: "Work Prefs" },
        { id: 9, icon: Cpu, label: "AI Prefs" },
        { id: 10, icon: CheckCircle2, label: "Review" },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Steps Progress */}
            <div className="w-full max-w-4xl mb-12 flex items-center justify-between relative z-10 px-4">
                {steps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 relative group">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 z-10
                                ${step >= s.id ? "bg-primary border-primary text-black" : "bg-background border-white/10 text-foreground/30"}`}
                        >
                            {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                        </div>
                        {/* Tooltip for steps */}
                        <span className={`absolute -bottom-8 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 
                            ${step === s.id ? "opacity-100 text-primary translate-y-0" : "opacity-0 translate-y-[-5px]"}`}>
                            {s.label}
                        </span>
                    </div>
                ))}
                {/* Connecting Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/5 -z-0">
                    <div
                        className="h-full bg-primary/50 transition-all duration-500 ease-out"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Card */}
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2rem] relative z-10 min-h-[500px] flex flex-col"
            >
                {/* Step 1: Personal */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <User className="w-6 h-6 text-primary" /> Personal Information
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" value={data.first_name} onChange={e => updateData("first_name", e.target.value)} placeholder="First Name" className="input-field" />
                            <input type="text" value={data.last_name} onChange={e => updateData("last_name", e.target.value)} placeholder="Last Name" className="input-field" />
                            <input type="text" value={data.country} onChange={e => updateData("country", e.target.value)} placeholder="Country" className="input-field" />
                            <input type="text" value={data.city} onChange={e => updateData("city", e.target.value)} placeholder="City (Optional)" className="input-field" />
                        </div>
                    </div>
                )}

                {/* Step 2: Role */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Briefcase className="w-6 h-6 text-purple-400" /> Professional Identity
                        </h2>
                        <div>
                            <label className="label">Primary Role</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {ROLES.map(role => (
                                    <button key={role} onClick={() => updateData("primary_role", role)} className={`btn-option ${data.primary_role === role ? "active" : ""}`}>
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="label">Current Level</label>
                            <div className="flex gap-2 mt-2">
                                {LEVELS.map(lvl => (
                                    <button key={lvl} onClick={() => updateData("level", lvl)} className={`btn-option flex-1 ${data.level === lvl ? "active" : ""}`}>
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Bio */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <FileText className="w-6 h-6 text-orange-400" /> About Me
                        </h2>
                        <textarea
                            value={data.bio}
                            onChange={(e) => updateData("bio", e.target.value)}
                            className="w-full h-40 input-field resize-none leading-relaxed"
                            placeholder="Describe who you are, what you're learning, and what you want to build..."
                        />
                        <p className="text-xs text-foreground/40">300-500 characters recommended.</p>
                    </div>
                )}

                {/* Step 4: Skills */}
                {step === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Code2 className="w-6 h-6 text-cyan-400" /> Technical Skills
                        </h2>
                        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                            {SKILLS_LIST.map(skill => (
                                <div key={skill} className={`p-3 rounded-xl border flex items-center justify-between transition-all ${data.skills[skill] ? "bg-cyan-500/10 border-cyan-500/50" : "bg-black/20 border-white/5"}`}>
                                    <span className="font-medium text-sm">{skill}</span>
                                    <select
                                        className="bg-transparent text-xs font-bold outline-none text-right"
                                        value={data.skills[skill] || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const newSkills = { ...data.skills };
                                            if (val) newSkills[skill] = val; else delete newSkills[skill];
                                            updateData("skills", newSkills);
                                        }}
                                    >
                                        <option value="">None</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 5: Experience */}
                {step === 5 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Clock className="w-6 h-6 text-blue-400" /> Work Experience
                        </h2>
                        <p className="text-sm text-foreground/60">Share past projects, internships, or freelance work.</p>
                        <textarea
                            value={data.work_experience}
                            onChange={(e) => updateData("work_experience", e.target.value)}
                            className="w-full h-40 input-field resize-none"
                            placeholder="Worked on a React dashboard for X..."
                        />
                    </div>
                )}

                {/* Step 6: Social */}
                {step === 6 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Globe className="w-6 h-6 text-pink-400" /> Social Links
                        </h2>
                        <div className="space-y-3">
                            <input type="text" value={data.social_links.github} onChange={e => updateNested("social_links", "github", e.target.value)} placeholder="GitHub URL" className="input-field" />
                            <input type="text" value={data.social_links.linkedin} onChange={e => updateNested("social_links", "linkedin", e.target.value)} placeholder="LinkedIn URL" className="input-field" />
                            <input type="text" value={data.social_links.portfolio} onChange={e => updateNested("social_links", "portfolio", e.target.value)} placeholder="Portfolio URL (Optional)" className="input-field" />
                        </div>
                    </div>
                )}

                {/* Step 7: Goals */}
                {step === 7 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Target className="w-6 h-6 text-emerald-400" /> Goals & Availability
                        </h2>
                        <div>
                            <label className="label">Primary Goal</label>
                            <div className="space-y-2 mt-2">
                                {GOALS.map(goal => (
                                    <button key={goal} onClick={() => updateData("primary_goal", goal)} className={`w-full p-3 rounded-xl border text-sm font-bold text-left ${data.primary_goal === goal ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-black/20 border-white/5"}`}>
                                        {goal}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="label">Weekly Availability</label>
                            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                {AVAILABILITY.map(av => (
                                    <button key={av} onClick={() => updateData("weekly_availability", av)} className={`flex-1 p-3 rounded-xl border text-xs font-bold whitespace-nowrap ${data.weekly_availability === av ? "active-emerald" : "inactive"}`}>
                                        {av}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 8: Work Prefs */}
                {step === 8 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Settings className="w-6 h-6 text-yellow-400" /> Work Preferences
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Mode</label>
                                <select value={data.work_preference.mode} onChange={e => updateNested("work_preference", "mode", e.target.value)} className="input-field mt-1">
                                    <option>Solo</option><option>Team</option><option>Both</option>
                                </select>
                            </div>
                            <div>
                                <label className="label">Team Size</label>
                                <select value={data.work_preference.size} onChange={e => updateNested("work_preference", "size", e.target.value)} className="input-field mt-1">
                                    <option>2-3</option><option>3-5</option><option>5+</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="label">Style</label>
                                <select value={data.work_preference.style} onChange={e => updateNested("work_preference", "style", e.target.value)} className="input-field mt-1">
                                    <option>Async</option><option>Live Collaboration</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 9: AI Prefs */}
                {step === 9 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Cpu className="w-6 h-6 text-rose-400" /> AI Preferences
                        </h2>
                        <div>
                            <label className="label">Guidance Level</label>
                            <div className="flex gap-2 mt-2">
                                {["Minimal", "Balanced", "High"].map(l => (
                                    <button key={l} onClick={() => updateNested("ai_preference", "guidance", l)} className={`flex-1 p-3 rounded-xl border text-sm font-bold ${data.ai_preference.guidance === l ? "bg-rose-500/20 border-rose-500 text-rose-300" : "bg-black/20 border-white/5"}`}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 10: Review */}
                {step === 10 && (
                    <div className="space-y-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary">
                            <Smile className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black">Ready to Launch?</h2>
                        <p className="text-foreground/60">Your profile is 100% complete.</p>

                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left space-y-2 text-sm">
                            <p><strong>Name:</strong> {data.first_name} {data.last_name}</p>
                            <p><strong>Role:</strong> {data.primary_role} ({data.level})</p>
                            <p><strong>Goal:</strong> {data.primary_goal}</p>
                            <p className="opacity-50 text-xs mt-2">...and everything else you just entered!</p>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-auto pt-8 flex justify-between items-center border-t border-white/5">
                    <button onClick={handleBack} className={`text-sm font-bold opacity-50 hover:opacity-100 flex items-center gap-2 ${step === 1 ? "invisible" : ""}`}>
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    {step < 10 ? (
                        <button onClick={handleNext} className="btn-primary">
                            Next <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={submitProfile} disabled={loading} className="btn-primary">
                            {loading ? "Saving..." : "Start Journey"}
                        </button>
                    )}
                </div>
            </motion.div>

            <style jsx>{`
                .input-field {
                    @apply w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors placeholder:text-foreground/20;
                }
                .label {
                    @apply text-xs font-bold uppercase opacity-50 ml-1;
                }
                .btn-option {
                    @apply p-3 rounded-xl border text-sm font-medium transition-all bg-black/20 border-white/5 hover:bg-white/5 text-foreground/60;
                }
                .btn-option.active {
                    @apply bg-purple-500/20 border-purple-500 text-purple-300;
                }
                .active-emerald {
                     @apply bg-emerald-500/20 border-emerald-500 text-emerald-300;
                }
                .inactive {
                    @apply bg-black/20 border-white/5 hover:bg-white/5;
                }
                .btn-primary {
                    @apply bg-primary text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.2)];
                }
            `}</style>
        </div>
    );
}
