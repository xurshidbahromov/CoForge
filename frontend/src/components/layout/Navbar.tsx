"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  LayoutDashboard,
  User,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Project Hub", href: "/hub", icon: Code2 },
  { name: "Profile", href: "/profile", icon: User },
];

const publicLinks = [
  { name: "Vision", href: "/#vision" },
  { name: "Engine", href: "/#engine" },
  { name: "Journey", href: "/#journey" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll direction detection
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show navbar at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navbar
        setIsVisible(false);
        setMobileMenuOpen(false); // Close mobile menu on scroll
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="relative">
          {/* Glassmorphic Background */}
          <div className="absolute inset-0 bg-background/70 backdrop-blur-xl rounded-2xl border border-foreground/10 shadow-lg" />

          <div className="relative flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-black hidden sm:inline">CoForge</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {isAuthenticated ? (
                navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors duration-200",
                        isActive
                          ? "text-foreground font-semibold"
                          : "text-foreground/60 hover:text-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })
              ) : (
                publicLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-foreground/60">
                    {user?.email}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-semibold hover:scale-105 transition-transform"
                >
                  Sign In
                </Link>
              )}

              <div className="pl-3 border-l border-foreground/10 ml-1">
                <ThemeToggle />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-foreground/5 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 overflow-hidden"
            >
              <div className="relative">
                {/* Glassmorphic Background for Mobile Menu */}
                <div className="absolute inset-0 bg-background/70 backdrop-blur-xl rounded-2xl border border-foreground/10" />

                <div className="relative p-2 space-y-1">
                  {isAuthenticated ? (
                    navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-foreground/5 text-foreground"
                              : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })
                  ) : (
                    publicLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors"
                      >
                        <span>{link.name}</span>
                      </a>
                    ))
                  )}

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
