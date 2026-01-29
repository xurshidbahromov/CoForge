"use client";

import { usePathname } from "next/navigation";
import { Navbar, Footer } from "@/components/layout";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");
    const isLogin = pathname?.startsWith("/login");

    // Hide global Navbar/Footer on dashboard and login pages
    const showNav = !isDashboard && !isLogin;

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
