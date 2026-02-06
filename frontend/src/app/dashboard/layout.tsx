"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import axios from "axios";
import { toast } from "sonner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                // Check if user has completed onboarding
                const { data } = await axios.get("http://localhost:8000/profile/me", { withCredentials: true });
                if (!data.is_onboarding_completed) {
                    toast.info("Please set up your profile first.");
                    router.push("/onboarding");
                }
            } catch (error) {
                // If 401, they probably aren't logged in, let middleware or individual pages handle it, 
                // or redirect to login. For now, we assume they are logged in if they access dashboard.
                // console.error("Auth check failed", error);
            } finally {
                setChecking(false);
            }
        };

        checkStatus();
    }, [router]);

    if (checking) {
        return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-primary font-bold">Loading Workspace...</div></div>;
    }

    return (
        <div className="min-h-screen text-foreground flex relative selection:bg-primary/20">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-64 min-h-screen transition-all duration-300 pt-16 md:pt-0">
                <Header />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto relative">
                    {/* Background decoration for dashboard area */}
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                    <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
