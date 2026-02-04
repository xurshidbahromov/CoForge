"use client";

import { usePathname } from "next/navigation";
import { Navbar, Footer } from "@/components/layout";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");
    const isLogin = pathname?.startsWith("/login");

    const isOnboarding = pathname?.startsWith("/onboarding");

    // Hide global Navbar/Footer on dashboard, login, and onboarding pages
    const showNav = !isDashboard && !isLogin && !isOnboarding;

    return (
        <>
            {showNav && <Navbar />}
            <main className={showNav ? "min-h-screen" : ""}>
                {children}
            </main>
            {showNav && <Footer />}
        </>
    );
}
