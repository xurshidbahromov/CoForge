"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen text-foreground flex overflow-hidden">
            {/* Sidebar - Fixed Left (Desktop) / Mobile Drawer */}
            <Sidebar
                collapsed={isSidebarCollapsed}
                setCollapsed={setIsSidebarCollapsed}
                mobileOpen={isMobileMenuOpen}
                setMobileOpen={setIsMobileMenuOpen}
            />

            {/* Backdrop for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out relative",
                isSidebarCollapsed ? "md:ml-20" : "md:ml-64",
                "w-full"
            )}>
                <Header
                    collapsed={isSidebarCollapsed}
                    mobileOpen={isMobileMenuOpen}
                    setMobileOpen={setIsMobileMenuOpen}
                />
                <div className="flex-1 p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
