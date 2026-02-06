"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Terminal, Code2, Cpu, Zap } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function MentorPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Greetings, Developer. I am the System Architect. I can assist you with code reviews, architectural decisions, and debugging complex systems. What is your query?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            const res = await axios.post("http://localhost:8000/ai/chat", {
                message: userMsg.content
            });

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: res.data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("AI Chat failed", error);
            toast.error("Systems Offline. Unable to reach AI Core.");
        } finally {
            setIsLoading(false);
        }
    };

    const quickPrompts = [
        { title: "Review Code", icon: Code2, prompt: "Can you review this code snippet for performance and readability?" },
        { title: "Debug Error", icon: Zap, prompt: "I'm encountering a bug I can't trace. Here's what's happening..." },
        { title: "Explain Concept", icon: Terminal, prompt: "Explain the concept of Dependency Injection in a simple way." },
    ];

    return (
        <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] flex flex-col max-w-5xl mx-auto relative">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Cpu className="w-8 h-8 text-primary animate-pulse" />
                        AI Architect
                    </h1>
                    <p className="text-foreground/50">Advanced neural interface for development assistance</p>
                </div>
                <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-mono text-primary flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    ONLINE
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass-panel rounded-3xl border border-white/5 overflow-hidden flex flex-col relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.role === "assistant"
                                ? "bg-primary/20 text-primary border border-primary/20"
                                : "bg-white/10 text-foreground border border-white/10"
                                }`}>
                                {msg.role === "assistant" ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                            </div>

                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "assistant"
                                ? "bg-white/5 border border-white/5 text-foreground/90 rounded-tl-none"
                                : "bg-primary text-primary-foreground rounded-tr-none"
                                }`}>
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                                <div className={`text-[10px] mt-2 font-mono opacity-50 ${msg.role === "user" ? "text-primary-foreground" : "text-foreground"}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-bounce" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-md relative z-20">
                    {/* Quick Prompts */}
                    {messages.length < 3 && (
                        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-2">
                            {quickPrompts.map((qp, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInputValue(qp.prompt)}
                                    className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                                >
                                    <qp.icon className="w-3 h-3 text-primary" />
                                    {qp.title}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={sendMessage} className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask the System Architect..."
                            className="w-full bg-white/5 border border-white/10 focus:border-primary/50 rounded-2xl pl-4 pr-12 py-4 focus:outline-none transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
