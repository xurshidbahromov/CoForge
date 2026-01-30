"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Mail, Lock, User, Loader2, ArrowRight, Code2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading: globalLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  // Safety: Reset global loading on mount if it was stuck
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const handleGitHubLogin = () => {
    setIsSubmitting(true);
    setError("");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    window.location.href = `${apiBaseUrl}/auth/login`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (mode === "login") {
        const response = await api.post("/auth/login/email", {
          email: formData.email,
          password: formData.password
        });
        login(response.data);
        router.push("/dashboard");
      } else {
        const response = await api.post("/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        login(response.data);
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.response?.data?.detail || "Connection failed. Please check if the server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnyLoading = isSubmitting || globalLoading;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Main Card */}
        <div className="glass-panel rounded-[2.5rem] border border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="p-10 md:p-12">
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
              <Link href="/" className="group mb-8">
                <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  <Code2 className="w-8 h-8" />
                </div>
              </Link>
              <h1 className="text-3xl md:text-4xl font-black text-center tracking-tighter mb-3">
                {mode === "login" ? t("auth.welcomeBack") : t("auth.join")}
              </h1>
              <p className="text-foreground/40 text-center font-medium leading-relaxed max-w-[280px]">
                {mode === "login"
                  ? t("auth.continue")
                  : t("auth.start")}
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="mb-6"
                >
                  <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-bold flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Login */}
            <button
              onClick={handleGitHubLogin}
              disabled={isAnyLoading}
              className="w-full h-14 bg-foreground text-background rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-xl shadow-foreground/5 mb-8 overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isAnyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
                <span className="tracking-tight text-sm">{t("auth.github")}</span>
              </div>
            </button>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-foreground/[0.05]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
                <span className="px-4 bg-transparent text-foreground/20">
                  {t("auth.orEmail")}
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder={t("auth.username")}
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.05] focus:border-primary/50 outline-none transition-all font-bold text-sm tracking-tight placeholder:text-foreground/20"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder={t("auth.email")}
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.05] focus:border-primary/50 outline-none transition-all font-bold text-sm tracking-tight placeholder:text-foreground/20"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder={t("auth.password")}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.05] focus:border-primary/50 outline-none transition-all font-bold text-sm tracking-tight placeholder:text-foreground/20"
                />
              </div>

              <button
                type="submit"
                disabled={isAnyLoading}
                className="w-full h-14 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-xl shadow-primary/20 mt-6 overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                {isAnyLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="tracking-tight text-sm">
                      {mode === "login" ? t("auth.signIn") : t("auth.createAccount")}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Area */}
          <div className="p-8 md:p-10 bg-foreground/[0.02] border-t border-foreground/[0.05] text-center">
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 hover:text-primary transition-colors"
            >
              {mode === "login"
                ? t("auth.noAccount")
                : t("auth.hasAccount")}
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="flex flex-col items-center gap-2 mt-10">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-foreground/10">
            {t("auth.verifiedHistory")}
          </p>
          <div className="flex items-center gap-4 text-[8px] font-black text-foreground/5 uppercase tracking-[0.2em]">
            <span>{t("auth.secure")}</span>
            <div className="w-1 h-1 rounded-full bg-foreground/5" />
            <span>{t("auth.ai")}</span>
            <div className="w-1 h-1 rounded-full bg-foreground/5" />
            <span>{t("auth.ledger")}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
