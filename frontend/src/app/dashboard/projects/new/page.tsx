"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Hammer,
    Code2,
    Users,
    User,
    Sparkles,
    Layers,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

export default function NewProjectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        stack: "",
        type: "solo" // solo | team
    });

    useEffect(() => {
        const title = searchParams.get("title");
        const description = searchParams.get("description");
        const stack = searchParams.get("stack");

        if (title || description || stack) {
            setFormData(prev => ({
                ...prev,
                title: title || prev.title,
                description: description || prev.description,
                stack: stack || prev.stack
            }));
        }
    }, [searchParams]);

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else router.back();
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Format stack string if needed, currently API takes string
            await axios.post("http://localhost:8000/projects", formData, { withCredentials: true });
            toast.success("Project created successfully!");
            router.push("/dashboard/projects"); // Will redirect to Project Hub
        } catch (error) {
            console.error(error);
            toast.error("Failed to create project");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStepValid = () => {
        if (step === 1) return formData.title.length > 3 && formData.description.length > 10;
        if (step === 2) return formData.stack.length > 2;
        return true;
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Panel - Guidance */}
            <div className="w-full md:w-1/3 bg-background border-r border-white/5 p-8 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Hammer className="w-64 h-64 text-primary -rotate-12 translate-x-12 -translate-y-12" />
                </div>

                <div className="relative z-10">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity mb-8">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>

                    <h1 className="text-4xl font-black tracking-tight mb-4">Start New Project</h1>
                    <p className="text-foreground/60 leading-relaxed mb-8">
                        Bring your ideas to life. Whether it's a solo experiment or a team ambition, it starts here.
                    </p>

                    <div className="space-y-4">
                        {[
                            { n: 1, title: "The Basics", desc: "Name & Goal" },
                            { n: 2, title: "Tech Stack", desc: "Tools & Languages" },
                            { n: 3, title: "Team Structure", desc: "Solo or Squad" },
                            { n: 4, title: "Review", desc: "Ready to launch" }
                        ].map((s) => (
                            <div key={s.n} className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${step === s.n ? 'bg-white/5 border border-white/5' : 'opacity-40'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.n ? 'bg-primary text-primary-foreground' : 'bg-white/10'}`}>
                                    {step > s.n ? <CheckCircle2 className="w-5 h-5" /> : s.n}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{s.title}</div>
                                    <div className="text-xs opacity-60">{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-white/5 mt-8">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                        <Sparkles className="w-3 h-3" />
                        Pro Tip
                    </div>
                    <p className="text-xs opacity-70 leading-relaxed">
                        Great project descriptions attract great teams. Be specific about what you're building and why.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 p-8 md:p-16 flex flex-col justify-center max-w-3xl">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold mb-6">What are you code-forging?</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Project Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg font-bold focus:outline-none focus:border-primary/50 transition-colors placeholder:text-foreground/20"
                                        placeholder="e.g. AI-Powered Task Manager"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[150px] focus:outline-none focus:border-primary/50 transition-colors placeholder:text-foreground/20 resize-none"
                                        placeholder="Describe your project's goal, core features, and the problem it solves..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold mb-6">Define your Arsenal</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Tech Stack</label>
                                    <div className="relative">
                                        <Layers className="absolute left-4 top-4 w-5 h-5 opacity-40" />
                                        <input
                                            type="text"
                                            value={formData.stack}
                                            onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
                                            className="w-full pl-12 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-foreground/20"
                                            placeholder="e.g. React, Node.js, PostgreSQL, Tailwind"
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-xs opacity-50 mt-2 px-1">
                                        Separate technologies with commas. This helps match you with the right developers.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                                    <Code2 className="w-5 h-5 text-blue-400 shrink-0" />
                                    <div>
                                        <div className="text-sm font-bold text-blue-300 mb-1">Stack Recommendations</div>
                                        <div className="flex flex-wrap gap-2">
                                            {["Next.js", "TypeScript", "Python", "Supabase"].map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setFormData(prev => ({ ...prev, stack: prev.stack ? `${prev.stack}, ${t}` : t }))}
                                                    className="px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-xs font-mono text-blue-300 transition-colors"
                                                >
                                                    + {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold mb-6">How do you want to build?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setFormData({ ...formData, type: "solo" })}
                                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${formData.type === 'solo' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                >
                                    <User className={`w-8 h-8 mb-4 ${formData.type === 'solo' ? 'text-primary' : 'opacity-40'}`} />
                                    <div className="font-bold text-lg mb-2">Solo Forger</div>
                                    <p className="text-sm opacity-60 leading-relaxed">
                                        Build it yourself. Perfect for learning new skills or small experiments.
                                    </p>
                                </div>

                                <div
                                    onClick={() => setFormData({ ...formData, type: "team" })}
                                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${formData.type === 'team' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                >
                                    <Users className={`w-8 h-8 mb-4 ${formData.type === 'team' ? 'text-primary' : 'opacity-40'}`} />
                                    <div className="font-bold text-lg mb-2">Squad Mode</div>
                                    <p className="text-sm opacity-60 leading-relaxed">
                                        Recruit others. Great for ambitious projects and learning real collaboration.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold mb-6">Ready to launch?</h2>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider opacity-40 mb-1">Project</div>
                                    <div className="text-xl font-bold">{formData.title}</div>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider opacity-40 mb-1">Description</div>
                                    <div className="opacity-80 leading-relaxed">{formData.description}</div>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider opacity-40 mb-1">Stack</div>
                                        <div className="font-mono text-sm text-primary">{formData.stack}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider opacity-40 mb-1">Type</div>
                                        <div className="capitalize font-bold">{formData.type} Project</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/5">
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 rounded-xl hover:bg-white/5 font-bold transition-colors opacity-60 hover:opacity-100"
                    >
                        Back
                    </button>

                    {step < totalSteps ? (
                        <button
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Step <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg shadow-green-500/20"
                        >
                            {isSubmitting ? (
                                <>Launching...</>
                            ) : (
                                <>Launch Project <Sparkles className="w-4 h-4" /></>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
