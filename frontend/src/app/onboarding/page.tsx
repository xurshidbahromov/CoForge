"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronLeft,
    User,
    Code,
    Briefcase,
    CheckCircle,
    Terminal,
    Users,
    Zap,
    Globe,
    MapPin,
    Clock,
    Github,
    Linkedin
} from "lucide-react";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { toast } from "sonner";
import axios from "axios";

// --- Components ---

const StepIndicator = ({ current, total }: { current: number; total: number }) => {
    return (
        <div className="w-full max-w-md mx-auto mb-12">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground/60">Step {current} of {total}</span>
                <span className="text-sm font-medium text-primary">{Math.round((current / total) * 100)}%</span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(current / total) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
};

const CardOption = ({
    selected,
    onClick,
    icon: Icon,
    title,
    description
}: {
    selected: boolean;
    onClick: () => void;
    icon: any;
    title: string;
    description: string;
}) => (
    <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
      cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden
      ${selected
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-border bg-card hover:border-primary/50"
            }
    `}
    >
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{description}</p>
            </div>
        </div>
        {selected && (
            <div className="absolute top-4 right-4 text-primary">
                <CheckCircle className="w-5 h-5 fill-current" />
            </div>
        )}
    </motion.div>
);

const InputField = ({
    label,
    placeholder,
    value,
    onChange,
    icon: Icon,
    area = false
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    icon?: any;
    area?: boolean;
}) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-foreground/80 ml-1">{label}</label>
        <div className="relative group">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            {area ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl p-4 pl-12 outline-none transition-all min-h-[100px] resize-none font-medium"
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background rounded-2xl p-4 pl-12 outline-none transition-all font-medium"
                />
            )}
        </div>
    </div>
);

// --- Steps ---

const STEPS = [
    { id: 1, title: "Tell us about yourself", subtitle: "Let's build your developer profile." },
    { id: 2, title: "What is your role?", subtitle: "This helps us tailor your experience." },
    { id: 3, title: "Your Tech Stack", subtitle: "Select technologies you want to work with." },
    { id: 4, title: "Work Preferences", subtitle: "How do you like to build?" },
    { id: 5, title: "Review Profile", subtitle: "You are all set to go!" },
];

const COMMON_SKILLS = [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Node.js",
    "Python", "Django", "FastAPI", "Go", "Rust", "Java", "Spring", "Docker",
    "Kubernetes", "AWS", "Firebase", "PostgreSQL", "MongoDB", "GraphQL"
];

export default function OnboardingPage() {
    const router = useRouter();
    const { step, totalSteps, data, setStep, updateData, reset } = useOnboardingStore();
    const [skillSearch, setSkillSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize checks & Load data for editing
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: user } = await axios.get("http://localhost:8000/profile/me", { withCredentials: true });

                // If user has already completed onboarding, this is an "Edit" session.
                // We populate the form with their existing data.
                if (user.is_onboarding_completed) {
                    updateData({
                        first_name: user.first_name || "",
                        last_name: user.last_name || "",
                        city: user.city || "",
                        country: user.country || "",
                        bio: user.bio || "",
                        primary_role: user.primary_role || "",
                        level: user.level || "junior",
                        skills: user.skills || {},
                        social_links: user.social_links || {},
                        work_preference: user.work_preferences || { mode: "both" },
                        ai_preference: user.ai_preferences || {}
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile for editing", error);
            }
        };

        fetchProfile();
    }, []);

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Assuming existing backend at /api/profile/onboarding based on previous exploration
            // Using axios for better error handling
            await axios.put("http://localhost:8000/profile/onboarding", data, {
                withCredentials: true // Important since we saw Cookie auth in backend
            });

            toast.success("Profile setup complete!");
            reset(); // Clear store
            router.push("/dashboard");
        } catch (error) {
            console.error("Onboarding error:", error);
            toast.error("Failed to save profile. Please try again.");
            // For demo purposes, we might want to redirect anyway if backend fails locally
            // router.push("/dashboard"); 
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSkill = (skill: string) => {
        const newSkills = { ...data.skills };
        if (newSkills[skill]) {
            delete newSkills[skill];
        } else {
            newSkills[skill] = "intermediate"; // Default level
        }
        updateData({ skills: newSkills });
    };

    const filteredSkills = COMMON_SKILLS.filter(s =>
        s.toLowerCase().includes(skillSearch.toLowerCase()) && !data.skills[s]
    );

    const addSkill = () => {
        const skill = skillSearch.trim();
        if (skill && !data.skills[skill]) {
            const newSkills = { ...data.skills, [skill]: "intermediate" };
            updateData({ skills: newSkills });
            setSkillSearch("");
        } else if (skill && data.skills[skill]) {
            setSkillSearch(""); // Clear if already added
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="w-full max-w-2xl z-10">
                <StepIndicator current={step} total={totalSteps} />

                <div className="mb-8 text-center">
                    <motion.h1
                        key={STEPS[step - 1].title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-black mb-3 tracking-tight"
                    >
                        {STEPS[step - 1].title}
                    </motion.h1>
                    <motion.p
                        key={STEPS[step - 1].subtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg text-foreground/60"
                    >
                        {STEPS[step - 1].subtitle}
                    </motion.p>
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="glass-panel p-6 md:p-10 rounded-[2.5rem] shadow-2xl bg-card/80 backdrop-blur-xl border border-border"
                >
                    {/* STEP 1: IDENTITY */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="First Name"
                                    placeholder="Jane"
                                    value={data.first_name}
                                    onChange={(v) => updateData({ first_name: v })}
                                    icon={User}
                                />
                                <InputField
                                    label="Last Name"
                                    placeholder="Doe"
                                    value={data.last_name}
                                    onChange={(v) => updateData({ last_name: v })}
                                    icon={User}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="City"
                                    placeholder="New York"
                                    value={data.city}
                                    onChange={(v) => updateData({ city: v })}
                                    icon={MapPin}
                                />
                                <InputField
                                    label="Country"
                                    placeholder="USA"
                                    value={data.country}
                                    onChange={(v) => updateData({ country: v })}
                                    icon={Globe}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="GitHub"
                                    placeholder="github.com/username"
                                    value={data.social_links?.github || ""}
                                    onChange={(v) => updateData({ social_links: { ...data.social_links, github: v } })}
                                    icon={Github}
                                />
                                <InputField
                                    label="LinkedIn"
                                    placeholder="linkedin.com/in/username"
                                    value={data.social_links?.linkedin || ""}
                                    onChange={(v) => updateData({ social_links: { ...data.social_links, linkedin: v } })}
                                    icon={Linkedin}
                                />
                            </div>

                            <InputField
                                label="Bio"
                                placeholder="Briefly describe your journey..."
                                value={data.bio}
                                onChange={(v) => updateData({ bio: v })}
                                area
                                icon={Code}
                            />

                            <div className="bg-primary/5 p-4 rounded-xl flex items-start gap-3">
                                <div className="p-1 bg-primary/20 rounded-full mt-0.5">
                                    <Zap className="w-3 h-3 text-primary" />
                                </div>
                                <p className="text-xs text-foreground/60 leading-relaxed">
                                    <strong>AI Tip:</strong> Keep your bio concise. Mention your key strengths and what you're passionate about building.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: ROLE */}
                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-sm font-bold opacity-70 ml-1 block">Primary Role</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Mobile Developer', 'DevOps Engineer'].map(role => (
                                        <div
                                            key={role}
                                            onClick={() => updateData({ primary_role: role })}
                                            className={`
                                    p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                                    ${data.primary_role === role ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20'}
                                `}
                                        >
                                            <span className="font-bold">{role}</span>
                                            {data.primary_role === role && <CheckCircle className="w-5 h-5 text-primary" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold opacity-70 ml-1 block">Experience Level</label>
                                <div className="flex gap-4">
                                    {['Junior', 'Mid-Level', 'Senior'].map(lvl => (
                                        <button
                                            key={lvl}
                                            onClick={() => updateData({ level: lvl.toLowerCase() })}
                                            className={`
                                    flex-1 py-3 px-6 rounded-xl font-bold border-2 transition-all
                                    ${data.level === lvl.toLowerCase() ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-foreground/20'}
                                `}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: TECH STACK */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <InputField
                                        label="Search Technologies"
                                        placeholder="e.g. React, Python..."
                                        value={skillSearch}
                                        onChange={setSkillSearch}
                                        icon={Terminal}
                                    />
                                </div>
                                <button
                                    onClick={addSkill}
                                    disabled={!skillSearch.trim()}
                                    className="mb-0.5 px-6 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="min-h-[200px]">
                                {Object.keys(data.skills).length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Selected</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.keys(data.skills).map(skill => (
                                                <span key={skill} onClick={() => toggleSkill(skill)} className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold flex items-center gap-2 group hover:bg-red-500 transition-colors">
                                                    {skill}
                                                    <span className="opacity-50 text-[10px] uppercase group-hover:hidden">Int</span>
                                                    <span className="hidden group-hover:inline">×</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Suggested</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filteredSkills.map(skill => (
                                        <button
                                            key={skill}
                                            onClick={() => toggleSkill(skill)}
                                            className="px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-full text-sm font-medium transition-colors border border-transparent hover:border-foreground/10"
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-border/50">
                                    <div className="bg-primary/5 p-4 rounded-xl flex items-start gap-3">
                                        <div className="p-1 bg-primary/20 rounded-full mt-0.5">
                                            <Zap className="w-3 h-3 text-primary" />
                                        </div>
                                        <p className="text-xs text-foreground/60 leading-relaxed">
                                            <strong>AI Tip:</strong> Don't worry about missing something. You can update your stack anytime from your profile settings.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: PREFERENCES */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <CardOption
                                title="Solo Creator"
                                description="I prefer working alone on my own tasks and projects."
                                icon={User}
                                selected={data.work_preference.mode === 'solo'}
                                onClick={() => updateData({ work_preference: { ...data.work_preference, mode: 'solo' } })}
                            />
                            <CardOption
                                title="Team Player"
                                description="I thrive in collaborative environments with other devs."
                                icon={Users}
                                selected={data.work_preference.mode === 'team'}
                                onClick={() => updateData({ work_preference: { ...data.work_preference, mode: 'team' } })}
                            />
                            <CardOption
                                title="Both / Flexible"
                                description="I am comfortable with both independent work and teamwork."
                                icon={Briefcase}
                                selected={data.work_preference.mode === 'both'}
                                onClick={() => updateData({ work_preference: { ...data.work_preference, mode: 'both' } })}
                            />
                        </div>
                    )}

                    {/* STEP 5: PREVIEW */}
                    {step === 5 && (
                        <div className="space-y-6 text-center">
                            <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-primary">
                                    {data.first_name[0]}{data.last_name[0]}
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold">Ready to launch, {data.first_name}?</h2>
                            <p className="text-foreground/60 max-w-md mx-auto">
                                Your profile looks great. You are set to join the CoForge ecosystem and start building real experience.
                            </p>

                            <div className="bg-secondary/30 p-6 rounded-2xl text-left max-w-sm mx-auto space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-50">Role</span>
                                    <span className="font-bold">{data.primary_role}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-50">Level</span>
                                    <span className="font-bold capitalize">{data.level}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-50">Tech Stack</span>
                                    <span className="font-bold">{Object.keys(data.skills).length} Technologies</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-50">Mode</span>
                                    <span className="font-bold capitalize">{data.work_preference.mode}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* CONTROLS */}
                <div className="flex justify-between items-center mt-8 px-2">
                    <button
                        onClick={handleBack}
                        className={`flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-foreground transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="group relative flex items-center gap-3 bg-primary text-primary-foreground pl-8 pr-6 py-4 rounded-full font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {step === totalSteps ? (isSubmitting ? "Launching..." : "Complete Setup") : "Continue"}
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </button>
                </div>

            </div>
        </div>
    );
}
