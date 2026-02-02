"use client";

import { Bot, Send, Code, FileText, Target, Zap } from "lucide-react";

export default function MentorPage() {
    return (
        <div className="h-[calc(100vh-140px)] flex gap-6">

            {/* 1. Chat Interface (Main) */}
            <div className="flex-1 glass-panel rounded-3xl flex flex-col overflow-hidden relative border border-primary/20 shadow-2xl shadow-primary/5">
                {/* AI Header */}
                <div className="h-20 border-b border-white/5 flex items-center px-8 bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4 shadow-[0_0_20px_rgba(20,184,166,0.5)]">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-black text-xl">Nexus AI Mentor</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Online
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Bot Message */}
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white/5 border border-white/5 p-6 rounded-2xl rounded-tl-none max-w-2xl">
                            <p className="leadin-relaxed">
                                Hello John! I've analyzed your recent commits on the <strong>E-Commerce Microservices</strong> project.
                            </p>
                            <p className="mt-4 leading-relaxed">
                                Great job implementing the gRPC handlers. However, I noticed you aren't handling context cancellation in your database queries. This might cause connection leaks under high load.
                            </p>
                            <div className="mt-4 p-4 bg-black/30 rounded-xl border border-white/5 font-mono text-sm">
                                {`func (s *Server) GetUser(ctx context.Context, req *pb.UserRequest) {
    // ❌ Missing ctx in DB call
    user, err := s.db.Query("SELECT * FROM users...") 
    
    // ✅ Recommended fix
    user, err := s.db.QueryContext(ctx, "SELECT * FROM users...")
}`}
                            </div>
                            <p className="mt-4 text-sm font-bold opacity-60">Would you like me to generate a refactoring plan for this?</p>
                        </div>
                    </div>

                    {/* User Message */}
                    <div className="flex gap-4 flex-row-reverse">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center shrink-0 mt-1 text-xs font-bold">JS</div>
                        <div className="bg-primary/20 border border-primary/20 p-4 rounded-2xl rounded-tr-none max-w-lg">
                            <p>Oh, I totally missed that! Yes, please generate the plan.</p>
                        </div>
                    </div>
                </div>

                {/* Input */}
                <div className="p-6 bg-background/50 backdrop-blur-md border-t border-white/5">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-transparent px-4 py-3 focus:outline-none placeholder:text-foreground/30"
                            placeholder="Ask Nexus anything about code, career, or architecture..."
                        />
                        <button className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Quick Actions (Right Sidebar) */}
            <div className="w-80 hidden lg:flex flex-col gap-4">
                <div className="glass-panel p-6 rounded-3xl border border-white/5">
                    <h3 className="font-bold mb-4 uppercase text-xs tracking-widest opacity-50">Quick Tools</h3>
                    <div className="space-y-3">
                        <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-3 transition-all border border-transparent hover:border-primary/30 group">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Code className="w-5 h-5" /></div>
                            <div className="text-left">
                                <div className="font-bold text-sm">Code Review</div>
                                <div className="text-[10px] opacity-50">Instant feedback</div>
                            </div>
                        </button>
                        <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-3 transition-all border border-transparent hover:border-primary/30 group">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors"><Target className="w-5 h-5" /></div>
                            <div className="text-left">
                                <div className="font-bold text-sm">Task Generator</div>
                                <div className="text-[10px] opacity-50">Break down features</div>
                            </div>
                        </button>
                        <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-3 transition-all border border-transparent hover:border-primary/30 group">
                            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors"><FileText className="w-5 h-5" /></div>
                            <div className="text-left">
                                <div className="font-bold text-sm">Explain Concepts</div>
                                <div className="text-[10px] opacity-50">Learn new patterns</div>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-white/5 flex-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                    <h3 className="font-bold mb-4 uppercase text-xs tracking-widest opacity-50">Weekly Growth</h3>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl font-black text-primary">+12%</span>
                        <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <p className="text-xs opacity-60 mb-6">Your backend architecture skills are improving faster than 85% of users.</p>

                    <div className="h-32 flex items-end justify-between gap-1 px-2">
                        {[40, 60, 35, 80, 55, 90, 75].map((h, i) => (
                            <div key={i} style={{ height: `${h}%` }} className={`w-full rounded-t-sm ${i === 5 ? 'bg-primary' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
