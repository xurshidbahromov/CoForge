import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CoForge - Build Real Experience",
    description: "The first ecosystem that gives junior and intermediate developers real, proven experience. Work on real projects, collaborate with teams, and showcase verified skills to employers.",
    keywords: ["junior developer", "software engineering", "mentorship", "real projects", "developer portfolio", "coding experience", "team collaboration"],
    authors: [{ name: "CoForge" }],
    openGraph: {
        title: "CoForge - Build Real Experience",
        description: "Transform your career with real engineering experience. Join thousands of developers building verified portfolios.",
        type: "website",
        locale: "en_US",
        siteName: "CoForge",
    },
    twitter: {
        card: "summary_large_image",
        title: "CoForge - Build Real Experience",
        description: "The first ecosystem that gives junior and intermediate developers real, proven experience.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AppShell>{children}</AppShell>
                </ThemeProvider>
                <Toaster position="top-right" richColors expand={false} />
            </body>
        </html>
    );
}
