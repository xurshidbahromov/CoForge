"use client";

import { Github, Zap, Users, Trophy, GitPullRequest, Search, BookOpen, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { VisionTerminal, Marquee } from "@/components/home/InteractiveElements";
import { FAQ } from "@/components/home/FAQ";
import { Testimonials } from "@/components/home/Testimonials";
import { Pricing } from "@/components/home/Pricing";
import { useLanguage } from "@/context/LanguageContext";

const features = [
    { icon: Zap, title: "AI-Powered Projects", description: "Get personalized project ideas based on your stack and experience level.", span: "col-span-1 md:col-span-2" },
    { icon: Users, title: "Team Collaboration", description: "Work with other developers in sprints. Build real teamwork skills.", span: "col-span-1" },
    { icon: Trophy, title: "Proof of Experience", description: "Your profile becomes a verified portfolio. Show employers exactly what you've built.", span: "col-span-1" },
    { icon: GitPullRequest, title: "GitHub Integration", description: "Seamless PR integration. Your contributions are automatically tracked and verified.", span: "col-span-1 md:col-span-2" },
    { icon: Search, title: "AI Code Review", description: "Get instant feedback on your code. Learn best practices from an AI mentor.", span: "col-span-1 md:col-span-2" },
    { icon: BookOpen, title: "Structured Learning", description: "Skill recommendations tailored to your growth. Never feel lost about what to learn next.", span: "col-span-1" },
];

export default function Home() {
    const { t } = useLanguage();

    return (
        <main className="flex flex-col min-h-screen w-full overflow-x-hidden">

            {/* 1. HERO SECTION */}
            <section id="vision" className="w-full flex flex-col items-center justify-center pt-40 pb-32 px-6 text-foreground relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-[1200px] w-full text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 bg-foreground/[0.03] border border-foreground/10 text-foreground/60 mx-auto backdrop-blur-sm"
                    >
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">The Future of Junior Engineering</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mb-8"
                    >
                        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                            {t("hero.experience")} <br />
                            <span className="text-gradient italic relative">{t("hero.verified")}.</span>
                        </h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-12"
                        >
                            <VisionTerminal />
                        </motion.div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="text-xl md:text-2xl text-foreground/60 max-w-xl mx-auto mb-12 font-medium leading-relaxed mt-12"
                    >
                        {t("hero.description")}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/login" className="bg-foreground text-background px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-foreground/20 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            <Github className="w-5 h-5" />
                            {t("hero.startJourney")}
                        </Link>
                        <Link href="#engine" className="px-8 py-4 border border-foreground/10 rounded-2xl font-bold hover:bg-foreground/5 transition-colors backdrop-blur-sm overflow-hidden relative group">
                            <div className="absolute inset-0 bg-foreground/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            {t("hero.seeHowItWorks")}
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 2. STATS BAR */}
            <section className="w-full border-y border-foreground/5">
                <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-foreground/5">
                    {[
                        { label: t("stats.developers"), value: "10K+" },
                        { label: t("stats.projects"), value: "5K+" },
                        { label: t("stats.teams"), value: "500+" },
                        { label: t("stats.success"), value: "95%" }
                    ].map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label}
                            className="py-12 flex flex-col items-center text-center hover:bg-foreground/[0.02] transition-colors"
                        >
                            <div className="text-3xl md:text-4xl font-black mb-2 tracking-tight">{stat.value}</div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-40">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. PARADOX SECTION - FANCY VERSION & TRANSLATED */}
            <section className="w-full py-32 px-6 relative">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-8"
                    >
                        <h2 className="text-5xl md:text-6xl font-black leading-none tracking-tight">
                            <br /><span className="text-primary opacity-40">{t("paradox.title")}</span>
                        </h2>
                        <div className="space-y-6">
                            <p className="text-2xl font-bold text-foreground leading-tight">{t("paradox.subtitle")}</p>
                            <p className="text-xl opacity-60 leading-relaxed">
                                {t("paradox.description")}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-12 glass-panel rounded-[2rem]"
                    >
                        <h3 className="text-xs font-black uppercase tracking-[0.25em] opacity-40 mb-8">{t("paradox.realityCheck")}</h3>
                        <div className="space-y-6">
                            {/* Card 1: Struggle for role */}
                            <div className="group p-5 bg-background/50 rounded-2xl border border-foreground/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors duration-500" />
                                <div className="relative z-10 flex justify-between items-end mb-2">
                                    <div>
                                        <div className="font-bold text-lg">{t("paradox.struggleForRole")}</div>
                                        <div className="text-[10px] uppercase font-bold opacity-40 mt-1">{t("paradox.firstJob")}</div>
                                    </div>
                                    <span className="text-4xl font-black text-red-500">73%</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-4 w-full bg-foreground/5 rounded-full overflow-hidden relative">
                                    <div className="absolute inset-y-0 left-0 w-[73%] bg-red-500 rounded-full animate-horizontal-wave" />
                                </div>
                            </div>

                            {/* Card 2: Avg Time to Hire */}
                            <div className="group p-5 bg-background/50 rounded-2xl border border-foreground/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors duration-500" />
                                <div className="relative z-10 flex justify-between items-end mb-2">
                                    <div>
                                        <div className="font-bold text-lg">{t("paradox.avgTimeToHire")}</div>
                                        <div className="text-[10px] uppercase font-bold opacity-40 mt-1">{t("paradox.juniorDevs")}</div>
                                    </div>
                                    <span className="text-4xl font-black text-orange-500">8mo</span>
                                </div>
                                {/* Segmented Bar */}
                                <div className="flex gap-1 h-4 w-full">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="h-full flex-1 bg-orange-500 rounded-sm animate-slide-right" style={{ animationDelay: `${i * 0.1}s` }} />
                                    ))}
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i + 8} className="h-full flex-1 bg-foreground/5 rounded-sm" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 4. ENGINE SECTION (Bento Grid) - Keeping static for now or generic trans */}
            <section id="engine" className="w-full py-40 text-foreground relative overflow-hidden">
                {/* ... (Kept similar to minimize changes, can be translated later) ... */}
                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                    <div className="mb-24 text-center md:text-left">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 relative inline-block">
                            {t("nav.engine")}
                            <span className="absolute top-13 -right-6 text-primary animate-pulse rounded-full w-2 h-2 bg-primary"></span>
                        </h2>
                        <p className="text-xl text-foreground/60 max-w-xl font-medium">
                            Every tool defined to transform your career. Proven methodologies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`p-8 rounded-[2rem] glass-card border border-foreground/10 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden ${feature.span || 'col-span-1'}`}
                            >
                                <div className="relative z-10 h-full flex flex-col items-start text-left">
                                    <div className="mb-6 p-3 rounded-xl bg-primary/10 text-primary">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-sm text-foreground/60 leading-relaxed font-medium">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ... Continuing with simplified sections ... */}
            {/* 5. JOURNEY SECTION */}
            <section id="journey" className="w-full py-40 px-6 text-foreground relative">
                <div className="max-w-[1200px] mx-auto">
                    <h2 className="text-5xl md:text-7xl font-black text-center mb-32 tracking-tighter">{t("nav.journey")}</h2>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) - Adjusted for medium circles */}
                        <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-[1px] bg-foreground/5" />

                        {[
                            { step: "1", title: "Identity", desc: "Define your stack. AI builds your persona." },
                            { step: "2", title: "Execution", desc: "Ship real code in high-performance teams." },
                            { step: "3", title: "Evidence", desc: "Your verification history becomes your portfolio." }
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center group relative z-10"
                            >
                                <div className={`w-32 h-32 mx-auto bg-background/50 backdrop-blur-sm border border-foreground/10 rounded-full flex items-center justify-center mb-10 group-hover:scale-105 transition-all duration-500 shadow-sm`}>
                                    <span className={`text-7xl font-black text-foreground/25 transition-colors uppercase tracking-tighter leading-none select-none`}>
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-foreground/40 max-w-[240px] mx-auto text-lg leading-relaxed font-medium group-hover:text-foreground/60 transition-colors">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5.5 PROOF MARQUEE */}
            <section className="w-full pb-32">
                <div className="max-w-[1200px] mx-auto px-6 ">
                    <div className="flex items-center gap-4 mb-12 justify-center">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 text-green-500">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">System Active</span>
                        </div>
                        <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Dev Nodes: 1,429 Online</div>
                    </div>

                    <Marquee>
                        {[
                            "User_42 verified as Lead Frontend @ MetaFlow",
                            "Sprint #128 completed for Nebula API",
                            "340 XP awarded to @dev_xurshid",
                            "New Project: AI Image Search (8/10 slots filled)",
                            "Protocol: Engineering History Immutable",
                        ].map((text, i) => (
                            <div key={i} className="px-8 py-4 glass-panel border border-foreground/5 rounded-2xl text-sm font-bold flex items-center gap-4 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">
                                <Activity className="w-4 h-4 text-primary" />
                                {text}
                            </div>
                        ))}
                    </Marquee>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <Testimonials />

            {/* PRICING SECTION */}
            <Pricing />

            {/* FAQ SECTION */}
            <FAQ />

            {/* 6. CTA SECTION */}
            <section className="w-full py-24 px-6 mb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-[1200px] mx-auto bg-foreground text-background p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden shadow-2xl"
                >
                    {/* Animated Background */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                    <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">
                            Join the <br /><span className="text-primary italic">Elite.</span>
                        </h2>
                        <p className="text-xl text-background/60 mb-12 max-w-md font-medium">Stop building in silos. Join thousands of high-growth developers today.</p>
                        <Link href="/login" className="bg-background text-foreground px-12 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3 overflow-hidden relative group border border-foreground/10">
                            <div className="absolute inset-0 bg-foreground/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            <Github className="w-5 h-5" />
                            Apply Now
                        </Link>
                    </div>
                </motion.div>
            </section>

        </main>
    );
}
