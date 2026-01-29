"use client";

import { Github, Zap, ArrowRight, Code2, Users, Trophy, GitPullRequest, Search, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, title: "AI-Powered Projects", description: "Get personalized project ideas based on your stack and experience level." },
  { icon: Users, title: "Team Collaboration", description: "Work with other developers in sprints. Build real teamwork skills." },
  { icon: Trophy, title: "Proof of Experience", description: "Your profile becomes a verified portfolio. Show employers exactly what you've built." },
  { icon: GitPullRequest, title: "GitHub Integration", description: "Seamless PR integration. Your contributions are automatically tracked and verified." },
  { icon: Search, title: "AI Code Review", description: "Get instant feedback on your code. Learn best practices from an AI mentor." },
  { icon: BookOpen, title: "Structured Learning", description: "Skill recommendations tailored to your growth. Never feel lost about what to learn next." },
];

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen w-full overflow-x-hidden bg-background">

      {/* 1. HERO SECTION */}
      <section className="w-full flex flex-col items-center justify-center pt-32 pb-20 px-6 bg-background text-foreground">
        <div className="max-w-4xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-foreground/5 border border-foreground/10 text-foreground/60 mx-auto">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest">The Future of Engineering</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
            Experience <br />
            <span className="text-foreground/20 italic">Verified.</span>
          </h1>

          <p className="text-xl text-foreground/60 max-w-xl mx-auto mb-12 font-medium">
            CoForge provides developers with real engineering history.
            Stop building in silos. Start building in production-grade teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login" className="bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2">
              <Github className="w-5 h-5" />
              Start Building
            </Link>
            <Link href="#engine" className="px-8 py-4 border border-foreground/10 rounded-xl font-bold hover:bg-foreground/5 transition-colors">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="w-full border-y border-foreground/10 bg-foreground/[0.02]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-foreground/10">
          {[
            { label: "Developers", value: "10K+" },
            { label: "Projects", value: "5K+" },
            { label: "Teams", value: "500+" },
            { label: "Success", value: "95%" }
          ].map((stat) => (
            <div key={stat.label} className="py-10 flex flex-col items-center text-center">
              <div className="text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-50">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PARADOX SECTION */}
      <section className="w-full py-32 px-6 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-5xl font-black leading-none tracking-tight">
              The <br /><span className="text-primary opacity-30">Paradox.</span>
            </h2>
            <p className="text-xl font-bold">Employers demand experience.</p>
            <p className="text-lg opacity-60">Junior developers can't get it without that first hire. We bridge that gap.</p>
          </div>
          <div className="p-8 md:p-12 bg-foreground/[0.02] border border-foreground/5 rounded-3xl">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-8">Reality Check</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-black">
                <span className="font-bold">Struggle for role</span>
                <span className="text-2xl font-black">73%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-black">
                <span className="font-bold">Avg Time to Hire</span>
                <span className="text-2xl font-black">8mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENGINE SECTION (BLACK) */}
      <section className="w-full py-40 bg-foreground text-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">The Engine</h2>
            <p className="text-lg opacity-60 max-w-xl">Every tool defined to transform your career.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <feature.icon className="w-8 h-8 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. JOURNEY SECTION (WHITE) */}
      <section className="w-full py-32 px-6 bg-background text-foreground">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-24 tracking-tighter">Your Journey</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Identity", desc: "Define your stack. AI builds your persona." },
              { step: "02", title: "Execution", desc: "Ship real code in high-performance teams." },
              { step: "03", title: "Evidence", desc: "Your verification history becomes your portfolio." }
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="text-8xl font-black opacity-5 mb-6 group-hover:opacity-10 transition-opacity">{item.step}</div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-60 max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="w-full py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto bg-foreground text-background p-16 md:p-24 rounded-[3rem] text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">
              Join the <br /><span className="text-primary italic">Elite.</span>
            </h2>
            <p className="text-lg opacity-60 mb-12 max-w-md">Stop building in silos. Start your engineering career today.</p>
            <Link href="/login" className="bg-background text-foreground px-10 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3">
              <Github className="w-5 h-5" />
              Apply Now
            </Link>
          </div>
          {/* Decorative Background Fade */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </div>
      </section>

    </main>
  );
}
