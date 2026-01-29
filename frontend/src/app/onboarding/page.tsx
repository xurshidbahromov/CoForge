
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Code2 } from "lucide-react";
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

        // Update local state with the returned user from backend
        // We might need to split the stack string back into an array if the backend joined it
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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Progress Bar */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-2",
                  index <= currentStep ? "text-primary" : "text-foreground/40"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    index < currentStep
                      ? "bg-primary text-white"
                      : index === currentStep
                        ? "bg-primary/20 ring-2 ring-primary"
                        : "bg-white/10"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="hidden sm:block font-medium">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-3xl p-8"
          >
            {/* Step 1: Tech Stack */}
            {currentStep === 0 && (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-4">
                    <Code2 className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">What technologies do you use?</h2>
                  <p className="text-foreground/70">
                    Select all technologies you are comfortable working with
                  </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                  {techOptions.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => toggleStack(tech.label)}
                      className={cn(
                        "glass p-4 rounded-xl text-center transition-all",
                        formData.stack.includes(tech.label)
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "hover:bg-white/10"
                      )}
                    >
                      <div className="text-2xl mb-2">{tech.icon}</div>
                      <div className="text-sm font-medium">{tech.label}</div>
                    </button>
                  ))}
                </div>

                {formData.stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {formData.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Experience Level */}
            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">What is your experience level?</h2>
                  <p className="text-foreground/70">
                    This helps us tailor projects to your skill level
                  </p>
                </div>

                <div className="space-y-4">
                  {levelOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, level: option.id }))
                      }
                      className={cn(
                        "glass p-6 rounded-xl text-left transition-all w-full",
                        formData.level === option.id
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{option.icon}</div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {option.title}
                          </h3>
                          <p className="text-foreground/70 text-sm">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Goal */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">What is your main goal?</h2>
                  <p className="text-foreground/70">
                    Tell us what you want to achieve with CoForge
                  </p>
                </div>

                <div className="space-y-4">
                  {goalOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, goal: option.id }))
                      }
                      className={cn(
                        "glass p-6 rounded-xl text-left transition-all w-full",
                        formData.goal === option.id
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{option.icon}</div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {option.title}
                          </h3>
                          <p className="text-foreground/70 text-sm">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={cn(
                  "glass-button flex items-center gap-2",
                  currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={cn(
                  "glass-button bg-gradient-to-r from-primary to-secondary text-white flex items-center gap-2",
                  !canProceed() ? "opacity-50 cursor-not-allowed" : ""
                )}
              >
                {currentStep === steps.length - 1 ? "Complete" : "Continue"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

