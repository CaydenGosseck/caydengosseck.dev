"use client";

import Link from "next/link";
import type { BlogWithCount } from "@/types/components";
import type { Project } from "@/types/api";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar";
import DateDisplay from "@/components/date-display";
import TurkeyButton from "@/components/turkey-button";
import PaginatedEntries from "@/components/paginated-entries";

type AppSidebarProps = {
    blogs: BlogWithCount[];
    projects: Project[];
};

export default function AppSidebar({ blogs, projects }: AppSidebarProps) {
    return (
        <Sidebar>
            <SidebarContent>
                {/* ── Blogs ── */}
                <PaginatedEntries
                    label="Blogs"
                    items={blogs}
                    emptyMessage="no blogs yet."
                    keyExtractor={(b) => b.title}
                    asChild
                    placeholderText="..."
                    renderItem={(b) => (
                        <Link href={`/blog/${encodeURIComponent(b.title)}`} style={{ textDecoration: "none" }}>
                            <span className="font-sans text-sm leading-tight" style={{ color: "var(--foreground)", textDecoration: "underline" }}>{b.title}</span>
                            <span className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                                {b.postCount} posts · <DateDisplay date={b.created_at} />
                            </span>
                        </Link>
                    )}
                />

                {/* ── Projects ── */}
                <PaginatedEntries
                    label="Projects"
                    items={projects}
                    emptyMessage="no projects yet."
                    keyExtractor={(p) => p.name}
                    asChild
                    placeholderText="..."
                    renderItem={(p) => (
                        <Link href={`/projects/${encodeURIComponent(p.name)}`} className="flex flex-col gap-1" style={{ textDecoration: "none" }}>
                            <span className="font-sans text-sm leading-tight" style={{ color: "var(--foreground)" }}>{p.name}</span>
                            {p.description && (
                                <span className="font-sans text-sm italic" style={{ color: "var(--muted-text)" }}>{p.description}</span>
                            )}
                        </Link>
                    )}
                />
            </SidebarContent>

            <SidebarFooter className="flex items-end p-3">
                <TurkeyButton />
            </SidebarFooter>
        </Sidebar>
    );
}
