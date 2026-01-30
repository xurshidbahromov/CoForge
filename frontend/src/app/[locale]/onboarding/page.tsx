
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Code2, Zap, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const steps = [
  { id: "stack", title: "Tech Stack" },
  { id: "level", title: "Experience" },
  { id: "goal", title: "Your Goal" },
];

const techOptions = [
  { id: "react", label: "React", icon: "⚛️" },
  { id: "vue", label: "Vue.js", icon: "💚" },
  { id: "angular", label: "Angular", icon: "🅰️" },
  { id: "svelte", label: "Svelte", icon: "🔥" },
  { id: "nextjs", label: "Next.js", icon: "▲" },
  { id: "nodejs", label: "Node.js", icon: "🟢" },
  { id: "python", label: "Python", icon: "🐍" },
  { id: "golang", label: "Go", icon: "🐹" },
  { id: "rust", label: "Rust", icon: "🦀" },
  { id: "java", label: "Java", icon: "☕" },
  { id: "csharp", label: "C#", icon: "🔷" },
  { id: "typescript", label: "TypeScript", icon: "📘" },
];

const levelOptions = [
  {
    id: "beginner",
    title: "Beginner",
    description: "Just started learning. I know basic HTML/CSS and maybe one framework.",
    icon: "🌱",
  },
  {
    id: "junior",
    title: "Junior Developer",
    description: "I have built some projects. Comfortable with a stack but still learning best practices.",
    icon: "🚀",
  },
  {
    id: "confident_junior",
    title: "Confident Junior",
    description: "Solid skills. I can build features independently but want to level up.",
    icon: "⭐",
  },
];

const goalOptions = [
  {
    id: "experience",
    title: "Gain Experience",
    description: "I want to build real projects and learn by doing.",
    icon: "📚",
  },
  {
    id: "portfolio",
    title: "Build Portfolio",
    description: "I need impressive projects to show employers.",
    icon: "💼",
  },
  {
    id: "job_prep",
    title: "Job Preparation",
    description: "I want to be fully ready for technical interviews.",
    icon: "🎯",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    stack: user?.stack || [],
    level: "",
    goal: "",
  });

  const canProceed = (): boolean => {
    if (currentStep === 0) return formData.stack.length > 0;
    if (currentStep === 1) return formData.level !== "";
    if (currentStep === 2) return formData.goal !== "";
    return false;
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (user) {
      try {
        const response = await api.patch('/auth/me', {
          stack: formData.stack,
          level: formData.level,
          goal: formData.goal,
        });

        const savedUser = response.data;
        if (typeof savedUser.stack === 'string') {
          savedUser.stack = savedUser.stack.split(',').filter(Boolean);
        }

        setUser(savedUser);
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to save onboarding data:", error);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleStack = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      stack: prev.stack.includes(tech)
        ? prev.stack.filter((t) => t !== tech)
        : [...prev.stack, tech],
    }));
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Experience Progress */}
        <div className="bg-foreground/[0.01] border border-foreground/[0.03] rounded-[2.5rem] p-8 mb-12 shadow-2xl shadow-black/5">
          <div className="flex items-center justify-between mb-6 px-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-4 transition-all duration-500",
                  index <= currentStep ? "opacity-100" : "opacity-20"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500",
                    index < currentStep
                      ? "bg-primary text-background shadow-lg shadow-primary/20"
                      : index === currentStep
                        ? "bg-foreground text-background shadow-xl scale-110"
                        : "bg-foreground/5 text-foreground/40"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 mb-0.5">Step 0{index + 1}</div>
                  <div className="text-xs font-black uppercase tracking-widest">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden mx-4">
            <motion.div
              className="h-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "circOut" }}
            />
          </div>
        </div>

        {/* Dynamic Canvas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-foreground/[0.01] border border-foreground/[0.03] rounded-[3.5rem] p-10 md:p-16 shadow-2xl shadow-black/5"
          >
            {/* Step 1: Tech Stack Deployment */}
            {currentStep === 0 && (
              <div className="space-y-12">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Code2 className="w-4 h-4" />
                    Infrastructure Phase
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Define your <span className="text-primary italic">Stack</span></h2>
                  <p className="text-foreground/30 font-bold uppercase tracking-[0.1em] text-[10px]">
                    Select nodes you wish to operate and specialize in
                  </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  {techOptions.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => toggleStack(tech.label)}
                      className={cn(
                        "p-6 rounded-[2rem] text-center transition-all duration-500 group relative overflow-hidden",
                        formData.stack.includes(tech.label)
                          ? "bg-foreground text-background shadow-2xl shadow-foreground/20 scale-105"
                          : "bg-foreground/[0.02] border border-foreground/[0.03] hover:bg-foreground/[0.05] hover:border-foreground/[0.08]"
                      )}
                    >
                      <div className={cn(
                        "absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700",
                        formData.stack.includes(tech.label) ? "block" : "hidden"
                      )} />
                      <div className="text-3xl mb-4 relative z-10 group-hover:scale-110 transition-transform">{tech.icon}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest relative z-10">{tech.label}</div>
                    </button>
                  ))}
                </div>

                <div className="h-8 flex flex-wrap justify-center gap-2">
                  <AnimatePresence>
                    {formData.stack.map((tech) => (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={tech}
                        className="px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-primary text-[9px] font-black uppercase tracking-widest"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Step 2: Protocol Level */}
            {currentStep === 1 && (
              <div className="space-y-12">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Zap className="w-4 h-4" />
                    Aptitude Verification
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Operational <span className="text-primary italic">Tier</span></h2>
                  <p className="text-foreground/30 font-bold uppercase tracking-[0.1em] text-[10px]">
                    How deep is your knowledge of these systems?
                  </p>
                </div>

                <div className="grid gap-6">
                  {levelOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, level: option.id }))
                      }
                      className={cn(
                        "p-8 rounded-[2.5rem] text-left transition-all duration-500 w-full group relative overflow-hidden",
                        formData.level === option.id
                          ? "bg-foreground text-background shadow-2xl shadow-foreground/20"
                          : "bg-foreground/[0.01] border border-foreground/[0.03] hover:bg-foreground/[0.03] hover:border-foreground/[0.08]"
                      )}
                    >
                      <div className={cn(
                        "absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700",
                        formData.level === option.id ? "block" : "hidden"
                      )} />
                      <div className="flex items-center gap-10 relative z-10">
                        <div className="text-5xl group-hover:scale-110 transition-transform duration-500">{option.icon}</div>
                        <div>
                          <h3 className="font-black text-2xl tracking-tighter mb-2">
                            {option.title}
                          </h3>
                          <p className="text-sm font-bold opacity-40 leading-relaxed max-w-lg">
                            {option.description}
                          </p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Mission Objective */}
            {currentStep === 2 && (
              <div className="space-y-12">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Sparkles className="w-4 h-4" />
                    Strategic Alignment
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Choose your <span className="text-primary italic">Mission</span></h2>
                  <p className="text-foreground/30 font-bold uppercase tracking-[0.1em] text-[10px]">
                    What is the primary objective of your deployment?
                  </p>
                </div>

                <div className="grid gap-6">
                  {goalOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, goal: option.id }))
                      }
                      className={cn(
                        "p-8 rounded-[2.5rem] text-left transition-all duration-500 w-full group relative overflow-hidden",
                        formData.goal === option.id
                          ? "bg-foreground text-background shadow-2xl shadow-foreground/20"
                          : "bg-foreground/[0.01] border border-foreground/[0.03] hover:bg-foreground/[0.03] hover:border-foreground/[0.08]"
                      )}
                    >
                      <div className={cn(
                        "absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700",
                        formData.goal === option.id ? "block" : "hidden"
                      )} />
                      <div className="flex items-center gap-10 relative z-10">
                        <div className="text-5xl group-hover:scale-110 transition-transform duration-500">{option.icon}</div>
                        <div>
                          <h3 className="font-black text-2xl tracking-tighter mb-2">
                            {option.title}
                          </h3>
                          <p className="text-sm font-bold opacity-40 leading-relaxed max-w-lg">
                            {option.description}
                          </p>
                        </div>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tactical Navigation */}
            <div className="flex justify-between items-center mt-12 pt-10 border-t border-foreground/[0.03]">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={cn(
                  "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  currentStep === 0 ? "opacity-10 pointer-events-none" : "text-foreground/30 hover:text-foreground hover:bg-foreground/5 flex items-center gap-2"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Segment
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={cn(
                  "h-16 px-10 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 transition-all duration-500 overflow-hidden relative group",
                  !canProceed() ? "bg-foreground/5 text-foreground/20" : "bg-foreground text-background shadow-2xl shadow-foreground/20 hover:scale-105 active:scale-95"
                )}
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10">
                  {currentStep === steps.length - 1 ? "Initiate Core System" : "Next Protocol"}
                </span>
                <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

