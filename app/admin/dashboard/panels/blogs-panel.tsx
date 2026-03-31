"use client";

import { useState } from "react";
import { Card } from "@/components/retroui/Card";
import type { Blog } from "@/types/api";

type Props = {
    blogs: Blog[];
    setBlogs: (blogs: Blog[]) => void;
};

export default function BlogsPanel({ blogs, setBlogs }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const inputClass = "w-full px-3 py-2 font-sans text-sm border-0 border-b outline-none transition-colors duration-150";
    const inputStyle = { background: "var(--background)", borderColor: "var(--muted-text)", color: "var(--foreground)" };

    async function refreshBlogs() {
        const res = await fetch("/api/blog");
        if (res.ok) setBlogs(await res.json());
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        setCreateError("");
        const res = await fetch("/api/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle.trim() }),
        });
        if (!res.ok) {
            const data = await res.json();
            setCreateError(data.error ?? "Failed to create blog");
            setCreating(false);
            return;
        }
        setNewTitle("");
        setShowCreate(false);
        setCreating(false);
        await refreshBlogs();
    }

    async function handleDelete(title: string) {
        const res = await fetch(`/api/blog/${encodeURIComponent(title)}`, { method: "DELETE" });
        if (res.ok) {
            setConfirmDelete(null);
            await refreshBlogs();
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="font-pixel text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                    {blogs.length} blog{blogs.length !== 1 ? "s" : ""}
                </span>
                <button
                    onClick={() => { setShowCreate(!showCreate); setCreateError(""); }}
                    className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                    style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                >
                    {showCreate ? "cancel" : "new blog"}
                </button>
            </div>

            {showCreate && (
                <Card>
                    <Card.Content>
                        <form onSubmit={handleCreate} className="flex flex-col gap-3">
                            <input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Blog title…"
                                required
                                className={inputClass}
                                style={inputStyle}
                            />
                            {createError && (
                                <p className="font-sans text-sm" style={{ color: "var(--accent)" }}>{createError}</p>
                            )}
                            <button
                                type="submit"
                                disabled={creating}
                                className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 w-fit transition-colors duration-150 hover:bg-[var(--muted-bg)] disabled:opacity-50"
                                style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                            >
                                {creating ? "creating…" : "create"}
                            </button>
                        </form>
                    </Card.Content>
                </Card>
            )}

            {blogs.length === 0 && (
                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>No blogs yet.</p>
            )}

            {blogs.map((blog) => (
                <Card key={blog.title}>
                    <Card.Content>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>{blog.title}</p>
                                <p className="font-sans text-xs" style={{ color: "var(--muted-text)" }}>
                                    {new Date(blog.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setConfirmDelete(confirmDelete === blog.title ? null : blog.title)}
                                className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 shrink-0 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                                style={{
                                    border: "1px solid var(--border-color)",
                                    background: confirmDelete === blog.title ? "var(--accent)" : "transparent",
                                    color: "var(--foreground)",
                                    cursor: "pointer",
                                }}
                            >
                                {confirmDelete === blog.title ? "confirm?" : "delete"}
                            </button>
                        </div>
                        {confirmDelete === blog.title && (
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleDelete(blog.title)}
                                    className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150"
                                    style={{ border: "1px solid var(--border-color)", background: "var(--accent)", color: "var(--foreground)", cursor: "pointer" }}
                                >
                                    yes, delete
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                                    style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                                >
                                    cancel
                                </button>
                            </div>
                        )}
                    </Card.Content>
                </Card>
            ))}
        </div>
    );
}
