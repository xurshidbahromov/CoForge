"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Github, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { api } from "@/lib/api";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const { login } = useAuth();

    const [mode, setMode] = useState<AuthMode>("signin");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const toggleMode = () => {
        setMode(mode === "signin" ? "signup" : "signin");
        setError(null);
        setFormData({ username: "", email: "", password: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let user;
            if (mode === "signup") {
                const res = await api.post("/auth/register", formData);
                user = res.data;
                toast.success(t("auth.welcomeBack") || "Account created successfully!");
            } else {
                const res = await api.post("/auth/login/email", {
                    email: formData.email,
                    password: formData.password
                });
                user = res.data;
                toast.success(t("auth.welcomeBack") || "Welcome back!");
            }

            login(user);

            // Redirect based on onboarding status
            if (!user.is_onboarding_completed) {
                router.push("/onboarding");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error(err);
            setError(
                err.response?.data?.detail ||
                (mode === "signin" ? "Invalid credentials" : "Registration failed")
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex">

            {/* LEFT SIDE - BRANDING / VISUALS */}
            <div className="hidden lg:flex w-1/2 bg-foreground text-background relative flex-col justify-between p-12 overflow-hidden">
                {/* Abstract Background Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none translate-x-[20%] translate-y-[-20%]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none translate-x-[-20%] translate-y-[20%]" />

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 relative z-10 group w-fit">
                    <div className="w-10 h-10 rounded-xl bg-background text-foreground flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-white/5">
                        <Code2 className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight">CoForge</span>
                </Link>

                {/* Center Visual / Quote */}
                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-black mb-6 leading-tight tracking-tight">
                            {t("hero.experience")}<br />
                            <span className="text-primary italic">{t("hero.verified")}.</span>
                        </h2>
                        <p className="text-lg text-background/60 font-medium leading-relaxed">
                            {t("auth.branding.subtitle")}
                        </p>
                    </motion.div>

                    {/* Feature List (Subtle) */}
                    <div className="mt-12 space-y-4">
                        {[
                            t("auth.features.realTeams"),
                            t("auth.features.aiMentorship"),
                            t("auth.features.verifiedHistory")
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="flex items-center gap-3 text-sm font-bold text-background/40"
                            >
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                {feature}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer area left */}
                <div className="relative z-10 text-xs font-bold text-background/20 uppercase tracking-widest">
                    {t("auth.branding.copyright")}
                </div>
            </div>


            {/* RIGHT SIDE - LOGIN FORM */}
            <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-6 relative">
                <div className="w-full max-w-[400px]">

                    {/* Mobile Header (Only visible on small screens) */}
                    <div className="lg:hidden mb-12 text-center">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center">
                                <Code2 className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold">CoForge</span>
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="mb-10">
                            <h1 className="text-3xl font-black tracking-tight mb-2">
                                {mode === "signin" ? t("auth.welcomeBack") : t("auth.createAccount")}
                            </h1>
                            <p className="text-foreground/60 font-medium">
                                {mode === "signin" ? t("auth.continue") : t("auth.start")}
                            </p>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-foreground/10 hover:bg-foreground/5 transition-all font-bold text-sm hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-foreground/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                <Github className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">GitHub</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-foreground/10 hover:bg-foreground/5 transition-all font-bold text-sm hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-foreground/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="relative z-10">Google</span>
                            </button>
                        </div>

                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-foreground/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-4 text-foreground/40 font-bold tracking-wider">
                                    {t("auth.orEmail")}
                                </span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence mode="popLayout">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-sm font-bold flex items-center gap-3"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                {mode === "signup" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <label className="text-xs font-bold uppercase text-foreground/60 ml-1">{t("auth.username")}</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-3.5 w-5 h-5 text-foreground/30 group-hover:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-foreground/20"
                                                placeholder={t("auth.placeholders.username")}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-foreground/60 ml-1">{t("auth.email")}</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-foreground/30 group-hover:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-foreground/20"
                                        placeholder={t("auth.placeholders.email")}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold uppercase text-foreground/60">{t("auth.password")}</label>
                                    {mode === "signin" && (
                                        <Link href="#" className="text-xs font-bold text-primary hover:underline">{t("auth.actions.forgotPassword")}</Link>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-foreground/30 group-hover:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:text-foreground/20"
                                        placeholder={t("auth.placeholders.password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-foreground/30 hover:text-foreground transition-colors outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-foreground text-background py-4 rounded-2xl font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 mt-4 shadow-xl shadow-foreground/20 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                ) : (
                                    <>
                                        <span className="relative z-10">{mode === "signin" ? t("auth.signIn") : t("auth.createAccount")}</span>
                                        <ArrowRight className="w-4 h-4 relative z-10" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-sm font-medium text-foreground/60">
                                {mode === "signin" ? t("auth.noAccount") : t("auth.hasAccount")}
                                {" "}
                                <button
                                    onClick={toggleMode}
                                    className="text-primary font-bold hover:underline"
                                >
                                    {mode === "signin" ? t("auth.actions.signUp") : t("auth.actions.signIn")}
                                </button>
                            </p>
                        </div>

                    </motion.div>
                </div>
            </div>

        </div>
    );
}
