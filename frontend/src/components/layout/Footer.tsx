"use client";

import Link from "next/link";
import { Code2, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">CoForge</span>
              </Link>
              <p className="text-foreground/70 max-w-md">
                The first ecosystem that gives junior and intermediate developers 
                real, proven experience. Build projects, work in teams, and 
                showcase your skills to employers.
              </p>
              <div className="flex gap-4 mt-6">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:hello@coforge.dev"
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="text-foreground/70 hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-foreground/70 hover:text-primary transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="text-foreground/70 hover:text-primary transition-colors">
                    Teams
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-foreground/70 hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="text-foreground/70 hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-foreground/70 hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-foreground/70 hover:text-primary transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-foreground/70 hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-foreground/60 text-sm">
              © {new Date().getFullYear()} CoForge. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-foreground/60">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

