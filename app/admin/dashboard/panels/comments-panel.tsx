"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/retroui/Card";
import type { Comment, PaginatedComments } from "@/types/api";

const PAGE_SIZE = 10;

const btnBase = "font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150";
const btnStyle = { border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" };

export default function CommentsPanel() {
    const [data, setData] = useState<PaginatedComments | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    async function load(p = page) {
        setLoading(true);
        const res = await fetch(`/api/comments?page=${p}&pageSize=${PAGE_SIZE}`);
        if (res.ok) setData(await res.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, [page]);

    async function handleVerify(id: number) {
        await fetch(`/api/comments/${id}/verify`, { method: "PATCH" });
        load();
    }

    async function handleDelete(id: number) {
        await fetch(`/api/comments/${id}`, { method: "DELETE" });
        setConfirmDelete(null);
        load();
    }

    const comments: Comment[] = data?.comments ?? [];
    const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="font-pixel text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                    {data ? `${data.total} comment${data.total !== 1 ? "s" : ""}` : "loading…"}
                </span>
            </div>

            {loading && (
                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>Loading…</p>
            )}

            {!loading && comments.length === 0 && (
                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>No comments yet.</p>
            )}

            {comments.map((comment) => (
                <Card key={comment.id}>
                    <Card.Content>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <span className="font-pixel text-[10px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                                        {comment.name}
                                    </span>
                                    <span className="font-sans text-xs" style={{ color: "var(--muted-text)" }}>
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                    {!comment.verified && (
                                        <span className="font-pixel text-[9px] uppercase tracking-widest px-1.5 py-0.5" style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}>
                                            unverified
                                        </span>
                                    )}
                                </div>
                                <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                                    {comment.message}
                                </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                {!comment.verified && (
                                    <button
                                        onClick={() => handleVerify(comment.id)}
                                        className={btnBase + " hover:bg-[var(--muted-bg)]"}
                                        style={btnStyle}
                                    >
                                        verify
                                    </button>
                                )}
                                <button
                                    onClick={() => setConfirmDelete(confirmDelete === comment.id ? null : comment.id)}
                                    className={btnBase}
                                    style={{
                                        ...btnStyle,
                                        background: confirmDelete === comment.id ? "var(--accent)" : "transparent",
                                    }}
                                >
                                    {confirmDelete === comment.id ? "confirm?" : "delete"}
                                </button>
                            </div>
                        </div>
                        {confirmDelete === comment.id && (
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className={btnBase}
                                    style={{ ...btnStyle, background: "var(--accent)" }}
                                >
                                    yes, delete
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className={btnBase + " hover:bg-[var(--muted-bg)]"}
                                    style={btnStyle}
                                >
                                    cancel
                                </button>
                            </div>
                        )}
                    </Card.Content>
                </Card>
            ))}

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page <= 1}
                        className={btnBase + " hover:bg-[var(--muted-bg)] disabled:opacity-30"}
                        style={btnStyle}
                    >
                        ← prev
                    </button>
                    <span className="font-pixel text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= totalPages}
                        className={btnBase + " hover:bg-[var(--muted-bg)] disabled:opacity-30"}
                        style={btnStyle}
                    >
                        next →
                    </button>
                </div>
            )}
        </div>
    );
}
