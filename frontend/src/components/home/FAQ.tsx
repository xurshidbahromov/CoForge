"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

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

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { t } = useLanguage();

    const faqs = [
        {
            question: t("faq.q1.q"),
            answer: t("faq.q1.a"),
        },
        {
            question: t("faq.q2.q"),
            answer: t("faq.q2.a"),
        },
        {
            question: t("faq.q3.q"),
            answer: t("faq.q3.a"),
        },
        {
            question: t("faq.q4.q"),
            answer: t("faq.q4.a"),
        },
        {
            question: t("faq.q5.q"),
            answer: t("faq.q5.a"),
        },
        {
            question: t("faq.q6.q"),
            answer: t("faq.q6.a"),
        },
    ];

    return (
        <section id="faq" className="w-full py-32 px-6 relative">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
                        {t("faq.title")}
                    </h2>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
                        {t("faq.subtitle")}
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
