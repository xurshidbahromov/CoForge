"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast.success("Successfully subscribed! Check your inbox.", {
                description: "You'll get early access to new features and updates.",
            });
            setEmail("");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="glass-card p-8 rounded-3xl border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Stay in the Loop</h3>
                    <p className="text-sm text-foreground/60">Get updates, tips, and early access</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 focus:border-primary/50 focus:outline-none transition-colors"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary text-background rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        "..."
                    ) : (
                        <>
                            <span className="hidden sm:inline">Subscribe</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-xs text-foreground/50 mt-3">
                We respect your privacy. Unsubscribe anytime.
            </p>
        </div>
    );
}
