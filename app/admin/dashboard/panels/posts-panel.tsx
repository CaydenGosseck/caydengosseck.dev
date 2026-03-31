"use client";

import { useState } from "react";
import { Card } from "@/components/retroui/Card";
import { ForwardRefEditor } from "@/components/mdx-editor/forward-ref-editor";
import ComponentReference from "@/components/mdx-editor/component-reference";
import type { Blog, Post } from "@/types/api";

type Props = {
    blogs: Blog[];
};

type EditState = {
    postId: number;
    title: string;
    content: string;
    saving: boolean;
    error: string;
};

const MAX_CONTENT_BYTES = 1_000_000;

// Shared two-column layout: editor on left, component reference on right
function EditorLayout({
    left,
    byteCount,
    byteMax,
    error,
    actions,
}: {
    left: React.ReactNode;
    byteCount: number;
    byteMax: number;
    error?: string;
    actions: React.ReactNode;
}) {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(500px,1fr)_75rem] gap-4 items-start">
            {/* Left: editor + controls */}
            <div className="flex flex-col gap-3">
                {left}
                <p className="font-sans text-xs" style={{ color: byteCount > byteMax ? "var(--accent)" : "var(--muted-text)" }}>
                    {(byteCount / 1024).toFixed(1)} KB / 1000 KB
                </p>
                {error && <p className="font-sans text-sm" style={{ color: "var(--accent)" }}>{error}</p>}
                {actions}
            </div>
            {/* Right: component reference (sticky) */}
            <div className="sticky top-4">
                <ComponentReference />
            </div>
        </div>
    );
}

export default function PostsPanel({ blogs }: Props) {
    const [selectedBlog, setSelectedBlog] = useState<string>(blogs[0]?.title ?? "");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [editState, setEditState] = useState<EditState | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const inputClass = "w-full px-3 py-2 font-sans text-sm border-0 border-b outline-none transition-colors duration-150";
    const inputStyle = { background: "var(--background)", borderColor: "var(--muted-text)", color: "var(--foreground)" };

    async function loadPosts(blogTitle: string) {
        if (!blogTitle) return;
        setLoadingPosts(true);
        const res = await fetch(`/api/post/${encodeURIComponent(blogTitle)}`);
        if (res.ok) setPosts(await res.json());
        setLoadingPosts(false);
    }

    function handleBlogChange(title: string) {
        setSelectedBlog(title);
        setPosts([]);
        setShowCreate(false);
        setEditState(null);
        setConfirmDelete(null);
        loadPosts(title);
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        setCreateError("");
        const res = await fetch(`/api/post/${encodeURIComponent(selectedBlog)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle.trim(), content: newContent || undefined }),
        });
        if (!res.ok) {
            const data = await res.json();
            setCreateError(data.error ?? "Failed to create post");
            setCreating(false);
            return;
        }
        setNewTitle("");
        setNewContent("");
        setShowCreate(false);
        setCreating(false);
        await loadPosts(selectedBlog);
    }

    async function handleEditOpen(post: Post) {
        const res = await fetch(`/api/post/${encodeURIComponent(post.blogTitle)}/${post.postId}`);
        const data = res.ok ? await res.json() : post;
        setEditState({ postId: post.postId, title: data.title, content: data.content ?? "", saving: false, error: "" });
    }

    async function handleEditSave() {
        if (!editState) return;
        setEditState({ ...editState, saving: true, error: "" });
        const res = await fetch(`/api/post/${encodeURIComponent(selectedBlog)}/${editState.postId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: editState.title, content: editState.content }),
        });
        if (!res.ok) {
            const data = await res.json();
            setEditState({ ...editState, saving: false, error: data.error ?? "Failed to save" });
            return;
        }
        setEditState(null);
        await loadPosts(selectedBlog);
    }

    async function handleDelete(postId: number) {
        const post = posts.find((p) => p.postId === postId);
        if (!post) return;
        const res = await fetch(`/api/post/${encodeURIComponent(post.blogTitle)}/${postId}`, { method: "DELETE" });
        if (res.ok) {
            setConfirmDelete(null);
            await loadPosts(selectedBlog);
        }
    }

    const contentByteLen = editState ? new TextEncoder().encode(editState.content).length : 0;
    const newContentByteLen = new TextEncoder().encode(newContent).length;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 flex-wrap">
                <select
                    value={selectedBlog}
                    onChange={(e) => handleBlogChange(e.target.value)}
                    className="font-sans text-sm px-3 py-2 border-0 border-b outline-none"
                    style={{ background: "var(--background)", borderColor: "var(--muted-text)", color: "var(--foreground)", cursor: "pointer" }}
                >
                    {blogs.length === 0 && <option value="">No blogs</option>}
                    {blogs.map((b) => (
                        <option key={b.title} value={b.title}>{b.title}</option>
                    ))}
                </select>

                {selectedBlog && (
                    <button
                        onClick={() => { setShowCreate(!showCreate); setCreateError(""); }}
                        className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                        style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                    >
                        {showCreate ? "cancel" : "new post"}
                    </button>
                )}
            </div>

            {showCreate && (
                <form onSubmit={handleCreate}>
                    <EditorLayout
                        byteCount={newContentByteLen}
                        byteMax={MAX_CONTENT_BYTES}
                        error={createError}
                        actions={
                            <button
                                type="submit"
                                disabled={creating || newContentByteLen > MAX_CONTENT_BYTES}
                                className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 w-fit transition-colors duration-150 hover:bg-[var(--muted-bg)] disabled:opacity-50"
                                style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                            >
                                {creating ? "creating…" : "create"}
                            </button>
                        }
                        left={
                            <Card>
                                <Card.Content>
                                    <div className="flex flex-col gap-3">
                                        <input
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Post title…"
                                            required
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                        <ForwardRefEditor
                                            markdown={newContent}
                                            onChange={setNewContent}
                                        />
                                    </div>
                                </Card.Content>
                            </Card>
                        }
                    />
                </form>
            )}

            {loadingPosts && (
                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>Loading…</p>
            )}

            {!loadingPosts && selectedBlog && posts.length === 0 && (
                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>No posts yet.</p>
            )}

            {posts.map((post) => (
                <Card key={post.postId}>
                    <Card.Content>
                        {editState?.postId === post.postId ? (
                            <EditorLayout
                                byteCount={contentByteLen}
                                byteMax={MAX_CONTENT_BYTES}
                                error={editState.error}
                                actions={
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleEditSave}
                                            disabled={editState.saving || contentByteLen > MAX_CONTENT_BYTES}
                                            className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)] disabled:opacity-50"
                                            style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                                        >
                                            {editState.saving ? "saving…" : "save"}
                                        </button>
                                        <button
                                            onClick={() => setEditState(null)}
                                            className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                                            style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                                        >
                                            cancel
                                        </button>
                                    </div>
                                }
                                left={
                                    <div className="flex flex-col gap-3">
                                        <input
                                            value={editState.title}
                                            onChange={(e) => setEditState({ ...editState, title: e.target.value })}
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                        <ForwardRefEditor
                                            markdown={editState.content}
                                            onChange={(md) => setEditState({ ...editState, content: md })}
                                        />
                                    </div>
                                }
                            />
                        ) : (
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>{post.title}</p>
                                    <p className="font-sans text-xs" style={{ color: "var(--muted-text)" }}>
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => handleEditOpen(post)}
                                        className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                                        style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                                    >
                                        edit
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(confirmDelete === post.postId ? null : post.postId)}
                                        className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                                        style={{
                                            border: "1px solid var(--border-color)",
                                            background: confirmDelete === post.postId ? "var(--accent)" : "transparent",
                                            color: "var(--foreground)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {confirmDelete === post.postId ? "confirm?" : "delete"}
                                    </button>
                                </div>
                            </div>
                        )}
                        {confirmDelete === post.postId && editState?.postId !== post.postId && (
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleDelete(post.postId)}
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
