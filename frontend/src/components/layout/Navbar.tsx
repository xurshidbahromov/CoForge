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
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { t } = useLanguage();

  const navItems = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("nav.hub"), href: "/hub", icon: Code2 },
    { name: t("nav.profile"), href: "/profile", icon: User },
  ];

  const publicLinks = [
    { name: t("nav.vision"), href: "/#vision" },
    { name: t("nav.engine"), href: "/#engine" },
    { name: t("nav.journey"), href: "/#journey" },
    { name: t("nav.pricing"), href: "/#pricing" },
    { name: t("nav.faq"), href: "/#faq" },
  ];

  // Scroll direction detection
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        setMobileMenuOpen(false);
      } else {
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
          <div className="absolute inset-0 bg-background/30 backdrop-blur-md rounded-2xl border border-foreground/10 shadow-lg" />

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
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />

              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-bold border border-foreground/10 rounded-xl hover:bg-foreground/5 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-xs font-bold bg-foreground text-background rounded-xl hover:scale-105 transition-transform overflow-hidden relative group"
                  >
                    <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                    <span className="relative z-10">{t("nav.signIn")}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground/80 hover:bg-foreground/5 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-4 right-4 mt-2 p-4 bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-2xl flex flex-col gap-2 md:hidden overflow-hidden"
          >
            {isAuthenticated ? (
              navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors"
                >
                  <item.icon className="w-5 h-5 opacity-60" />
                  <span className="font-bold">{item.name}</span>
                </Link>
              ))
            ) : (
              publicLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 font-bold text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all"
                >
                  {link.name}
                </Link>
              ))
            )}

            <div className="h-px bg-foreground/5 my-2" />

            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium opacity-60">Theme</span>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium opacity-60">Language</span>
              <LanguageSwitcher />
            </div>

            <div className="h-px bg-foreground/5 my-2" />

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 text-center font-bold text-red-500 bg-red-500/10 rounded-xl"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center font-bold bg-foreground text-background rounded-xl"
              >
                {t("nav.signIn")}
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
