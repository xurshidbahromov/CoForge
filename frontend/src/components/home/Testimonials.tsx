"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Testimonials() {
    const { t } = useLanguage();

    const testimonials = [
        {
            name: "Sarah Chen",
            role: t("testimonials.sarah.role"),
            image: "SC",
            quote: t("testimonials.sarah.quote"),
            color: "from-blue-500/20 to-purple-500/20",
        },
        {
            name: "Marcus Johnson",
            role: t("testimonials.marcus.role"),
            image: "MJ",
            quote: t("testimonials.marcus.quote"),
            color: "from-green-500/20 to-emerald-500/20",
        },
        {
            name: "Priya Sharma",
            role: t("testimonials.priya.role"),
            image: "PS",
            quote: t("testimonials.priya.quote"),
            color: "from-orange-500/20 to-red-500/20",
        },
    ];

    return (
        <section className="w-full py-32 px-6 relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4"
                    >
                        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                            {t("testimonials.tag")}
                        </div>
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
                        {t("testimonials.title")}
                    </h2>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
                        {t("testimonials.subtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 rounded-3xl relative group hover:scale-[1.02] transition-transform duration-300"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-3xl`} />

                            <div className="relative z-10">
                                <Quote className="w-10 h-10 text-primary/40 mb-6" />

                                <p className="text-foreground/80 mb-8 leading-relaxed italic">
                                    "{testimonial.quote}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30">
                                        {testimonial.image}
                                    </div>
                                    <div>
                                        <div className="font-bold">{testimonial.name}</div>
                                        <div className="text-sm text-foreground/60">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
