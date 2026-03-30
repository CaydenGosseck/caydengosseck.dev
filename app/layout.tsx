import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebarServer from "@/components/app-sidebar-server";
import MiniBlogSection from "@/components/mini-blog-section";
import RecentUpdates from "@/components/recent-updates";
import Nav from "@/components/nav";
import SocialIcons from "@/components/social-icons";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const pressStart = Press_Start_2P({
    variable: "--font-press-start",
    subsets: ["latin"],
    weight: "400",
});

export const metadata: Metadata = {
    title: "Cayden Gosseck",
    description: "my personal website",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} h-full bw`}>
            <body className="overflow-x-hidden">
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:text-sm font-sans"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                    Skip to content
                </a>
                <SidebarProvider>
                    <AppSidebarServer />
                    <SidebarInset className="min-w-0">
                        <header className="flex flex-col px-4 md:px-6 pt-4 md:pt-5" style={{ borderBottom: "1px solid var(--border-color)" }}>
                            {/* Row 1: nav + controls */}
                            <div className="flex items-center justify-between gap-3 pb-3">
                                <div className="flex items-center gap-3">
                                    <SidebarTrigger className="text-[var(--foreground)]" />
                                    <Nav />
                                </div>
                                <SocialIcons />
                            </div>
                            {/* Row 2: mini blog + updates under title */}
                            <div className="flex items-center gap-3 pb-3">
                                <MiniBlogSection />
                                <span style={{ color: "var(--border-color)" }} aria-hidden="true">·</span>
                                <RecentUpdates />
                            </div>
                        </header>
                        <main id="main-content" className="px-4 md:px-6 pt-4 md:pt-6 pb-8 md:pb-12 w-full max-w-3xl">
                            {children}
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </body>
        </html>
    );
}
