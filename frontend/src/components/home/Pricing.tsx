"use client";

import { Check, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function Pricing() {
    const { t } = useLanguage();

    const plans = [
        {
            name: t("pricing.free.name"),
            price: "$0",
            period: "forever",
            description: t("pricing.free.description"),
            features: [
                { text: t("pricing.features.activeProject"), included: true },
                { text: t("pricing.features.basicReview"), included: true },
                { text: t("pricing.features.community"), included: true },
                { text: t("pricing.features.github"), included: true },
                { text: t("pricing.features.mentorship"), included: false },
                { text: t("pricing.features.collab"), included: false },
                { text: t("pricing.features.analytics"), included: false },
            ],
            cta: t("pricing.free.cta"),
            popular: false,
        },
        {
            name: t("pricing.pro.name"),
            price: "$29",
            period: "/month",
            description: t("pricing.pro.description"),
            features: [
                { text: t("pricing.features.unlimited"), included: true },
                { text: t("pricing.features.aiReview"), included: true },
                { text: t("pricing.features.priority"), included: true },
                { text: t("pricing.features.gitlab"), included: true },
                { text: t("pricing.features.mentorship"), included: true },
                { text: t("pricing.features.collab"), included: true },
                { text: t("pricing.features.analytics"), included: true },
            ],
            cta: t("pricing.pro.cta"),
            popular: true,
        },
        {
            name: t("pricing.team.name"),
            price: "$99",
            period: "/month",
            description: t("pricing.team.description"),
            features: [
                { text: t("pricing.features.allPro"), included: true },
                { text: t("pricing.features.unlimitedTeam"), included: true },
                { text: t("pricing.features.dedicated"), included: true },
                { text: t("pricing.features.sprint"), included: true },
                { text: t("pricing.features.teamDashboard"), included: true },
                { text: t("pricing.features.matching"), included: true },
                { text: t("pricing.features.whiteLabel"), included: true },
            ],
            cta: t("pricing.team.cta"),
            popular: false,
        },
    ];

    return (
        <section id="pricing" className="w-full py-32 px-6 relative overflow-hidden">
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
                            {t("pricing.tag")}
                        </div>
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
                        {t("pricing.title")}
                    </h2>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
                        {t("pricing.subtitle")}
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
                                    {t("pricing.mostPopular")}
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
                                        className={`block w-full py-4 rounded-xl font-bold text-center transition-all mb-8 overflow-hidden relative group ${plan.popular
                                            ? "bg-primary text-background hover:scale-105 shadow-lg shadow-primary/30"
                                            : "bg-foreground/5 hover:bg-foreground/10"
                                            }`}
                                    >
                                        <div className={`absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out ${plan.popular ? "bg-white/20" : "bg-foreground/10"
                                            }`} />
                                        <span className="relative z-10">{plan.cta}</span>
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
                        {t("pricing.trial")}
                    </p>
                </div>
            </div>
        </section>
    );
}
