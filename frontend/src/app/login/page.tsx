"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Github, Code2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuth();
  const [error, setError] = useState("");

  const handleGitHubLogin = () => {
    setLoading(true);
    setError("");
    // Redirect to the backend auth endpoint
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    window.location.href = `${apiBaseUrl}/auth/login`;
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
              <Code2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Welcome to CoForge</h1>
            <p className="text-foreground/70 mt-2">
              Sign in to start building real experience
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* GitHub Login Button */}
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="w-full glass-button bg-[#24292e] hover:bg-[#2f363d] text-white flex items-center justify-center gap-3 py-4 text-lg"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Github className="w-5 h-5" />
            )}
            <span>{isLoading ? "Signing in..." : "Continue with GitHub"}</span>
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-foreground/50">
                or
              </span>
            </div>
          </div>

          {/* Demo Login */}
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="w-full glass hover:bg-white/10 flex items-center justify-center gap-2 py-3 text-sm"
          >
            <span className="text-foreground/70">
              Continue with Demo Account
            </span>
          </button>

          {/* Terms */}
          <p className="text-center text-sm text-foreground/50 mt-6">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="glass rounded-xl p-4">
            <div className="text-2xl font-bold gradient-text">Free</div>
            <div className="text-xs text-foreground/60">No credit card</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-2xl font-bold gradient-text">Fast</div>
            <div className="text-xs text-foreground/60">Start in minutes</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-2xl font-bold gradient-text">Real</div>
            <div className="text-xs text-foreground/60">Verified experience</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

