"use client";

import Link from "next/link";
import { Code2, Github, Twitter, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Newsletter } from "@/components/home/Newsletter";

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/5 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-primary/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Top Section: Tagline + Links */}
      <div className="relative border-b border-foreground/5">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Tagline */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 border-2 border-background flex items-center justify-center text-white font-bold text-sm">
                    SC
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-background flex items-center justify-center text-white font-bold text-sm">
                    MJ
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-background flex items-center justify-center text-white font-bold text-sm">
                    PS
                  </div>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                Experience that{" "}
                <span className="text-primary italic">actually counts.</span>
              </h2>
              <p className="text-lg text-foreground/60 max-w-md">
                Real projects. Real teams. Real career growth. Built for developers who are serious about their future.
              </p>
            </div>

            {/* Right: Link Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-12">
              {/* Column 1 */}
              <div>
                <Link
                  href="/#vision"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-4"
                >
                  <span>Vision</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/#pricing"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-4"
                >
                  <span>Pricing</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              {/* Column 2 */}
              <div>
                <Link
                  href="/about"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-4"
                >
                  <span>About</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/careers"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-4"
                >
                  <span>Careers</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/blog"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
                >
                  <span>Blog</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              {/* Column 3 */}
              <div>
                <Link
                  href="/docs"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-4"
                >
                  <span>Docs</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/help"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-4"
                >
                  <span>Help</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  href="/community"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
                >
                  <span>Community</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-foreground/5">
        <div className="max-w-[1400px] mx-auto px-6 py-16">
          <Newsletter />
        </div>
      </div>

      {/* Bottom Section: Large Branding */}
      <div className="relative">
        <div className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
            {/* Large Logo */}
            <div className="flex-1">
              <Link href="/" className="group inline-block">
                <h1 className="text-[8rem] sm:text-[10rem] lg:text-[12rem] font-black tracking-tighter leading-none hover:text-primary transition-colors duration-500">
                  CoForge
                </h1>
              </Link>
            </div>

            {/* Right: Social + Copyright */}
            <div className="flex flex-col items-start lg:items-end gap-6">
              {/* Social Icons */}
              <div className="flex gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-foreground/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-foreground/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full border border-foreground/20 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>

              {/* Copyright & Legal */}
              <div className="text-right">
                <p className="text-xs text-foreground/40 mb-2 uppercase tracking-wider font-semibold">
                  All rights reserved.
                </p>
                <p className="text-xs text-foreground/50 mb-3">
                  © 2026 RAILWAY HEALTH INC DBA COFORGE.
                </p>
                <div className="flex flex-wrap gap-4 text-xs">
                  <Link href="/terms" className="text-foreground/50 hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-foreground/50 hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/cookies" className="text-foreground/50 hover:text-primary transition-colors">
                    Cookies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

