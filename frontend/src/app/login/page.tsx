"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Mail, Lock, User, Loader2, ArrowRight, Code2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading: globalLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel rounded-[2.5rem] p-10 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-foreground text-background mb-6 shadow-xl">
              <Code2 className="w-8 h-8" />
            </Link>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-foreground/60 font-medium">
              {mode === "login"
                ? "Sign in to continue your journey."
                : "Join the elite engineering community."}
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Login */}
          <button
            onClick={handleGitHubLogin}
            disabled={isAnyLoading}
            className="w-full h-14 bg-foreground text-background rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isAnyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
            <span>Continue with GitHub</span>
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-foreground/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="px-4 bg-transparent text-foreground/30">
                or use email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary outline-none transition-all font-medium"
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary outline-none transition-all font-medium"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5 focus:border-primary outline-none transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isAnyLoading}
              className="w-full h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isAnyLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-[10px] uppercase tracking-widest font-bold text-foreground/20 mt-10">
          Professional Engineering Platform
        </p>
      </motion.div>
    </div>
  );
}
