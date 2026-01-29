"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const Marquee = ({ children, reverse = false }: { children: React.ReactNode, reverse?: boolean }) => {
    return (
        <div className="flex overflow-hidden select-none gap-4 py-4 w-full">
            <motion.div
                initial={{ x: reverse ? "-100%" : 0 }}
                animate={{ x: reverse ? 0 : "-100%" }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="flex flex-none gap-4 min-w-full"
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
};

export const VisionTerminal = () => {
    const [text, setText] = useState("");
    const fullText = "$ coforge --vision\n> Initializing decentralized engineering engine...\n> Connecting mentor nodes...\n> Status: READY.\n> Goal: Bridge the Experience Gap for 1,000,000 developers.";
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < fullText.length) {
            const timeout = setTimeout(() => {
                setText((prev) => prev + fullText[index]);
                setIndex((prev) => prev + 1);
            }, 30);
            return () => clearTimeout(timeout);
        }
    }, [index]);

    return (
        <div className="w-full max-w-2xl mx-auto font-mono text-left bg-[#0A0A0B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="ml-2 text-[10px] uppercase font-bold text-white/20 tracking-widest">CoForge v1.0.4 - bash</div>
            </div>
            <div className="p-6 min-h-[160px] whitespace-pre-wrap leading-relaxed text-sm">
                <span className="text-primary">{text}</span>
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
                />
            </div>
        </div>
    );
};

export const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    return (
        <motion.div
            className={className}
            onMouseMove={onMouseMove}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
            style={{
                perspective: 1000,
                rotateX,
                rotateY,
            }}
        >
            <motion.div
                style={{
                    transform: "translateZ(75px)",
                    transformStyle: "preserve-3d",
                }}
                className="relative w-full h-full transition-all duration-200 ease-linear"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};
