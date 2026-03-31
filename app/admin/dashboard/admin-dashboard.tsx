"use client";

import { useState } from "react";
import type { Blog, ProjectRaw } from "@/types/api";
import BlogsPanel from "./panels/blogs-panel";
import PostsPanel from "./panels/posts-panel";
import ProjectsPanel from "./panels/projects-panel";
import CommentsPanel from "./panels/comments-panel";
import MiniBlogPanel from "./panels/mini-blog-panel";
import UpdatesPanel from "./panels/updates-panel";

type Tab = "blogs" | "posts" | "projects" | "comments" | "mini-blog" | "updates";

type Props = {
    initialBlogs: Blog[];
    initialProjects: ProjectRaw[];
};

export default function AdminDashboard({ initialBlogs, initialProjects }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("blogs");
    const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);

    const tabs: Tab[] = ["blogs", "posts", "projects", "comments", "mini-blog", "updates"];

    return (
        <div className="flex flex-col gap-6 py-6 max-w-3xl">
            <h1 className="font-serif text-2xl" style={{ color: "var(--primary)" }}>admin</h1>

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 transition-colors duration-150"
                        style={{
                            border: "1px solid var(--border-color)",
                            background: activeTab === tab ? "var(--accent)" : "transparent",
                            color: "var(--foreground)",
                            cursor: "pointer",
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "blogs" && <BlogsPanel blogs={blogs} setBlogs={setBlogs} />}
            {activeTab === "posts" && <PostsPanel blogs={blogs} />}
            {activeTab === "projects" && <ProjectsPanel initialProjects={initialProjects} />}
            {activeTab === "comments" && <CommentsPanel />}
            {activeTab === "mini-blog" && <MiniBlogPanel />}
            {activeTab === "updates" && <UpdatesPanel />}
        </div>
    );
}
