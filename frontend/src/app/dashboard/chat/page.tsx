"use client";

import { Hash, Search, MoreVertical, Send, Smile, Paperclip } from "lucide-react";

export default function GlobalChatPage() {
    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden">
            {/* 1. Channel List (Left) */}
            <div className="w-64 flex flex-col hidden md:flex glass-panel rounded-2xl p-4 overflow-hidden border border-white/5">
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                        <input
                            type="text"
                            placeholder="Find channel..."
                            className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                        />
                    </div>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto">
                    <div>
                        <div className="text-xs font-bold uppercase opacity-40 mb-2 px-2">Community</div>
                        <div className="space-y-0.5">
                            {["general", "announcements", "introductions", "wins"].map(channel => (
                                <div key={channel} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${channel === 'general' ? 'bg-primary/10 text-primary' : 'text-foreground/60 hover:bg-white/5 hover:text-foreground'}`}>
                                    <Hash className="w-4 h-4 opacity-50" />
                                    {channel}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-bold uppercase opacity-40 mb-2 px-2">Tech Stack</div>
                        <div className="space-y-0.5">
                            {["react", "python", "golang", "devops"].map(channel => (
                                <div key={channel} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/60 hover:bg-white/5 hover:text-foreground cursor-pointer">
                                    <Hash className="w-4 h-4 opacity-50" />
                                    {channel}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Chat Area (Main) */}
            <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden border border-white/5">
                {/* Header */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
                    <div className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-foreground/40" />
                        <span className="font-bold text-lg">general</span>
                        <span className="text-xs text-foreground/40 ml-2">2,405 members</span>
                    </div>
                    <div className="flex -space-x-2 mr-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] border border-white/10">U{i}</div>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Message 1 */}
                    <div className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">JS</div>
                        <div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-bold text-sm">John Smith</span>
                                <span className="text-[10px] text-foreground/30">10:42 AM</span>
                            </div>
                            <p className="text-foreground/80 text-sm leading-relaxed">
                                Just deployed my first microservice using the Go template! The CI/CD pipeline was super smooth. Anyone want to review my PR?
                            </p>
                        </div>
                    </div>

                    {/* Message 2 */}
                    <div className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold shrink-0">AL</div>
                        <div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-bold text-sm">Ada Lovelace</span>
                                <span className="text-[10px] text-foreground/30">10:45 AM</span>
                            </div>
                            <p className="text-foreground/80 text-sm leading-relaxed">
                                That's awesome John! 🔥 I'd love to take a look. Send the link over.
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-xs text-foreground/40"><span className="bg-background px-2 rounded-full border border-white/5">Today</span></div>
                    </div>

                    {/* New Messages will go here */}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white/5 border-t border-white/5">
                    <div className="bg-background/50 border border-white/10 rounded-xl p-2 flex items-end gap-2 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                        <button className="p-2 text-foreground/40 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <textarea
                            className="w-full bg-transparent resize-none border-none focus:ring-0 py-2 text-sm h-10 max-h-32"
                            placeholder="Message #general..."
                        />
                        <button className="p-2 text-foreground/40 hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
