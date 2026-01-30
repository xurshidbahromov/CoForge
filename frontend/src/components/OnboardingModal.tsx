"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Code2, Server, Layers, Sparkles, Briefcase, Rocket, Check, Smartphone, Cloud, Brain, Shield, Gamepad2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
    onComplete: () => void;
}

const stackOptions = [
    { id: "frontend", label: "Frontend", icon: Code2, description: "React, Vue, Angular, Next.js" },
    { id: "backend", label: "Backend", icon: Server, description: "Node, Python, Go, Java" },
    { id: "fullstack", label: "Fullstack", icon: Layers, description: "Frontend + Backend" },
    { id: "mobile", label: "Mobile", icon: Smartphone, description: "React Native, Flutter, Swift" },
    { id: "devops", label: "DevOps", icon: Cloud, description: "Docker, K8s, CI/CD, AWS" },
    { id: "data_science", label: "Data Science", icon: Brain, description: "Python, ML, AI, Analytics" },
    { id: "cybersecurity", label: "Cybersecurity", icon: Shield, description: "Security, Pentesting" },
    { id: "game_dev", label: "Game Dev", icon: Gamepad2, description: "Unity, Unreal, Godot" },
];


const levelOptions = [
    { id: "beginner", label: "Beginner", icon: Sparkles, description: "Just starting my journey" },
    { id: "intern", label: "Intern", icon: Briefcase, description: "Looking for first experience" },
    { id: "junior", label: "Junior", icon: Code2, description: "1-2 years experience" },
    { id: "mid", label: "Mid-Level", icon: Layers, description: "3-5 years experience" },
    { id: "senior", label: "Senior", icon: Rocket, description: "5+ years experience" },
];

const goalOptions = [
    { id: "experience", label: "Experience", icon: Sparkles, description: "Build real projects" },
    { id: "portfolio", label: "Portfolio", icon: Briefcase, description: "Showcase my work" },
    { id: "job_prep", label: "Job Ready", icon: Rocket, description: "Land my dream job" },
    { id: "freelance", label: "Freelance", icon: Code2, description: "Start freelancing" },
    { id: "startup", label: "Startup", icon: Layers, description: "Build my own product" },
    { id: "teaching", label: "Teaching", icon: Brain, description: "Help others learn" },
];


export function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [stack, setStack] = useState("");
    const [level, setLevel] = useState("");
    const [goal, setGoal] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { checkAuth } = useAuth();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await api.patch("/auth/me", { stack, level, goal });
            await checkAuth();
            onComplete();
        } catch (error) {
            console.error("Failed to save preferences:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = () => {
        if (step === 1) return !!stack;
        if (step === 2) return !!level;
        if (step === 3) return !!goal;
        return false;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full max-w-2xl bg-background border border-foreground/10 rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-foreground/5">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "33%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4"
                        >
                            Step {step} of 3
                        </motion.div>
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-2xl md:text-3xl font-black tracking-tighter"
                            >
                                {step === 1 && "What's your focus?"}
                                {step === 2 && "Your experience level?"}
                                {step === 3 && "What's your goal?"}
                            </motion.h2>
                        </AnimatePresence>
                    </div>

                    {/* Options */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 gap-3"

                        >
                            {step === 1 && stackOptions.map((option) => (

                                <button
                                    key={option.id}
                                    onClick={() => setStack(option.id)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 group",
                                        stack === option.id
                                            ? "border-primary bg-primary/5"
                                            : "border-foreground/5 hover:border-foreground/10 hover:bg-foreground/[0.02]"
                                    )}
                                >
                                    <div className={cn(
                                        "p-3 rounded-xl transition-colors",
                                        stack === option.id ? "bg-primary text-white" : "bg-foreground/5"
                                    )}>
                                        <option.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-bold">{option.label}</div>
                                        <div className="text-xs text-foreground/40">{option.description}</div>
                                    </div>
                                    {stack === option.id && (
                                        <Check className="w-5 h-5 text-primary" />
                                    )}
                                </button>
                            ))}

                            {step === 2 && levelOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setLevel(option.id)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4",
                                        level === option.id
                                            ? "border-primary bg-primary/5"
                                            : "border-foreground/5 hover:border-foreground/10 hover:bg-foreground/[0.02]"
                                    )}
                                >
                                    <div className={cn(
                                        "p-3 rounded-xl transition-colors",
                                        level === option.id ? "bg-primary text-white" : "bg-foreground/5"
                                    )}>
                                        <option.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-bold">{option.label}</div>
                                        <div className="text-xs text-foreground/40">{option.description}</div>
                                    </div>
                                    {level === option.id && (
                                        <Check className="w-5 h-5 text-primary" />
                                    )}
                                </button>
                            ))}


                            {step === 3 && goalOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setGoal(option.id)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4",
                                        goal === option.id
                                            ? "border-primary bg-primary/5"
                                            : "border-foreground/5 hover:border-foreground/10 hover:bg-foreground/[0.02]"
                                    )}
                                >
                                    <div className={cn(
                                        "p-3 rounded-xl transition-colors",
                                        goal === option.id ? "bg-primary text-white" : "bg-foreground/5"
                                    )}>
                                        <option.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-bold">{option.label}</div>
                                        <div className="text-xs text-foreground/40">{option.description}</div>
                                    </div>
                                    {goal === option.id && (
                                        <Check className="w-5 h-5 text-primary" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-foreground/5">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-foreground/40 hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                        ) : (
                            <div />
                        )}

                        <button
                            onClick={() => {
                                if (step < 3) {
                                    setStep(step + 1);
                                } else {
                                    handleSubmit();
                                }
                            }}
                            disabled={!canProceed() || isSubmitting}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300",
                                canProceed()
                                    ? "bg-primary text-white hover:scale-105 active:scale-95"
                                    : "bg-foreground/5 text-foreground/20 cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {step === 3 ? "Get Started" : "Continue"}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
