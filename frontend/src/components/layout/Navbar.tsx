"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Code2,
  LayoutDashboard,
  User,
  LogOut,
  Github,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Project Hub", href: "/hub", icon: Code2 },
  { name: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] p-4">
      <div className="max-w-7xl mx-auto bg-background/80 backdrop-blur-xl rounded-2xl border border-foreground/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <Code2 className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold tracking-tighter">
                CoForge
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {isAuthenticated && navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-sm font-semibold transition-all duration-300",
                      isActive
                        ? "text-foreground"
                        : "text-foreground/40 hover:text-foreground"
                    )}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-6 pl-4 border-l border-foreground/5">
                  <div className="flex items-center gap-3">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-8 h-8 rounded-full border border-foreground/10 grayscale-[0.5] hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-[10px] font-bold">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-xs font-bold tracking-tight hidden lg:block uppercase opacity-70">
                      {user?.username || "User"}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="glass-button flex items-center gap-2 text-primary"
                >
                  <Github className="w-5 h-5" />
                  <span>Sign in with GitHub</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated && navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      isActive
                        ? "bg-white/20 text-primary"
                        : "hover:bg-white/10"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="glass-button flex items-center justify-center gap-2 text-primary w-full"
                >
                  <Github className="w-5 h-5" />
                  <span>Sign in with GitHub</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

