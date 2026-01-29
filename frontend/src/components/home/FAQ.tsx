"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
    return (
        <div className="glass-card border border-foreground/10 rounded-2xl overflow-hidden">
            <button
                onClick={onClick}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-foreground/5 transition-colors"
            >
                <h3 className="text-lg font-bold pr-4">{question}</h3>
                <ChevronDown
                    className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-5 pt-2 text-foreground/70 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const faqs = [
    {
        question: "What is CoForge?",
        answer:
            "CoForge is a decentralized platform that gives junior and intermediate developers real, proven experience by working on actual projects with teams. It's not just learning—it's verified engineering experience.",
    },
    {
        question: "How does the mentorship work?",
        answer:
            "Our AI-powered system connects you with experienced mentors based on your skills and goals. You'll receive code reviews, guidance, and career advice from developers who've been where you are.",
    },
    {
        question: "Is CoForge free?",
        answer:
            "We offer a free tier for individual developers to get started. Premium plans unlock advanced features like unlimited projects, priority mentorship, and team collaboration tools.",
    },
    {
        question: "How is experience verified?",
        answer:
            "Every project contribution is tracked via GitHub integration. Your PRs, code reviews, and completed tasks are automatically verified and added to your immutable profile—proof employers can trust.",
    },
    {
        question: "Can I work with a team?",
        answer:
            "Absolutely! CoForge is built for team collaboration. Join existing teams or create your own. Work in real sprint cycles, manage tasks on Kanban boards, and build together.",
    },
    {
        question: "What technologies can I learn?",
        answer:
            "Our projects span the full stack: React, Next.js, Node.js, Python, Django, PostgreSQL, MongoDB, AWS, Docker, and more. Pick projects that match your learning goals.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="w-full py-32 px-6 bg-background relative">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
                        Everything you need to know about building real experience on CoForge
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
