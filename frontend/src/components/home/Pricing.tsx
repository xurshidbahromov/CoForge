"use client";

import { Check, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for getting started",
        features: [
            { text: "1 active project", included: true },
            { text: "Basic code reviews", included: true },
            { text: "Community support", included: true },
            { text: "GitHub integration", included: true },
            { text: "Priority mentorship", included: false },
            { text: "Team collaboration", included: false },
            { text: "Advanced analytics", included: false },
        ],
        cta: "Start Free",
        popular: false,
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "For serious developers",
        features: [
            { text: "Unlimited projects", included: true },
            { text: "AI-powered code reviews", included: true },
            { text: "Priority support", included: true },
            { text: "GitHub + GitLab integration", included: true },
            { text: "1-on-1 mentorship (2hrs/month)", included: true },
            { text: "Team collaboration (up to 5)", included: true },
            { text: "Advanced analytics", included: true },
        ],
        cta: "Go Pro",
        popular: true,
    },
    {
        name: "Team",
        price: "$99",
        period: "/month",
        description: "For engineering teams",
        features: [
            { text: "Everything in Pro", included: true },
            { text: "Unlimited team members", included: true },
            { text: "Dedicated mentor", included: true },
            { text: "Custom sprint planning", included: true },
            { text: "Team analytics dashboard", included: true },
            { text: "Priority project matching", included: true },
            { text: "White-label option", included: true },
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="w-full py-32 px-6 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4"
                    >
                        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Simple Pricing
                        </div>
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
                        Choose Your Plan
                    </h2>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
                        Start free, scale as you grow. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative group ${plan.popular ? "md:-mt-8" : ""
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-background text-xs font-bold rounded-full z-20">
                                    MOST POPULAR
                                </div>
                            )}

                            <div
                                className={`glass-card p-8 rounded-3xl h-full flex flex-col relative overflow-hidden ${plan.popular
                                        ? "border-2 border-primary/50 shadow-2xl shadow-primary/20"
                                        : "border border-foreground/10"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                                )}

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-foreground/60 text-sm mb-6">{plan.description}</p>

                                    <div className="mb-8">
                                        <span className="text-5xl font-black">{plan.price}</span>
                                        <span className="text-foreground/60 ml-2">{plan.period}</span>
                                    </div>

                                    <Link
                                        href="/login"
                                        className={`block w-full py-4 rounded-xl font-bold text-center transition-all mb-8 ${plan.popular
                                                ? "bg-primary text-background hover:scale-105 shadow-lg shadow-primary/30"
                                                : "bg-foreground/5 hover:bg-foreground/10"
                                            }`}
                                    >
                                        {plan.cta}
                                    </Link>

                                    <div className="space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                {feature.included ? (
                                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                ) : (
                                                    <X className="w-5 h-5 text-foreground/30 flex-shrink-0 mt-0.5" />
                                                )}
                                                <span
                                                    className={`text-sm ${feature.included ? "text-foreground" : "text-foreground/40"
                                                        }`}
                                                >
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-foreground/60">
                        All plans include a 14-day free trial. No credit card required.
                    </p>
                </div>
            </div>
        </section>
    );
}
