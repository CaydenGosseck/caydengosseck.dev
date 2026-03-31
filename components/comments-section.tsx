"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/retroui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaginatedComments } from "@/types/api";

type FormState = "idle" | "loading" | "success" | "error";

const PAGE_SIZE = 10;

export default function CommentsSection({ className }: { className?: string }) {
    // --- list state ---
    const [data, setData] = useState<PaginatedComments | null>(null);
    const [listLoading, setListLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // --- form state ---
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [formState, setFormState] = useState<FormState>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        setPage(1);
    }, [refreshTrigger]);

    useEffect(() => {
        setListLoading(true);
        fetch(`/api/comments?page=${page}&pageSize=${PAGE_SIZE}`)
            .then((res) => res.json())
            .then((result) => setData(result))
            .catch(() => setData(null))
            .finally(() => setListLoading(false));
    }, [page, refreshTrigger]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormState("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, message }),
            });
            const json = await res.json();
            if (!res.ok) {
                setErrorMsg(json.error ?? "Something went wrong.");
                setFormState("error");
                return;
            }
            setFormState("success");
            setRefreshTrigger((n) => n + 1);
        } catch {
            setErrorMsg("Network error. Please try again.");
            setFormState("error");
        }
    }

    const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;
    const comments = data?.comments ?? [];

    const inputClass = "w-full px-3 py-2 font-sans text-sm border-0 border-b outline-none transition-colors duration-150";
    const inputStyle = { background: "transparent", borderColor: "var(--border-color)", color: "var(--foreground)" };
    const labelClass = "font-pixel text-[9px] uppercase tracking-widest";
    const btnClass = "font-pixel text-[9px] uppercase tracking-widest px-3 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)] active:bg-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed";
    const btnStyle = { border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)" };

    return (
        <Card className={className}>
            <Card.Header>
                <Card.Title>comments</Card.Title>
            </Card.Header>
            <Card.Content>
                <div className="flex flex-col gap-6">
                    {/* comment list */}
                    <div>
                        {listLoading ? (
                            <ul className="flex flex-col">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <li
                                        key={i}
                                        className="flex flex-col gap-2 py-3"
                                        style={i < 4 ? { borderBottom: "1px solid var(--border-color)" } : undefined}
                                    >
                                        <div className="flex items-baseline gap-3">
                                            <Skeleton className="h-3 w-20" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </li>
                                ))}
                            </ul>
                        ) : comments.length === 0 ? (
                            <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                                No comments yet.
                            </p>
                        ) : (
                            <>
                                <ul className="flex flex-col">
                                    {comments.map((comment, i) => (
                                        <li
                                            key={comment.id}
                                            className="flex flex-col gap-1 py-3"
                                            style={i < comments.length - 1 ? { borderBottom: "1px solid var(--border-color)" } : undefined}
                                        >
                                            <div className="flex items-baseline gap-3">
                                                <span className="font-pixel text-[10px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                                                    {comment.name}
                                                </span>
                                                <span className="font-sans text-xs" style={{ color: "var(--muted-text)" }}>
                                                    {new Date(comment.created_at).toLocaleDateString(undefined, {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                            <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                                                {comment.message}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
                                        <button
                                            onClick={() => setPage((p) => p - 1)}
                                            disabled={page <= 1}
                                            className={btnClass}
                                            style={btnStyle}
                                            aria-label="Previous page"
                                        >
                                            &larr; prev
                                        </button>
                                        <span className="font-pixel text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                                            {page} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage((p) => p + 1)}
                                            disabled={page >= totalPages}
                                            className={btnClass}
                                            style={btnStyle}
                                            aria-label="Next page"
                                        >
                                            next &rarr;
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* divider */}
                    <div style={{ borderTop: "1px solid var(--border-color)" }} />

                    {/* comment form */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-pixel text-xs uppercase tracking-widest" style={{ color: "var(--primary)" }}>leave a comment</span>
                            <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
                        </div>

                        {formState === "success" ? (
                            <div className="flex flex-col gap-1">
                                <span className="font-pixel text-xs uppercase tracking-widest" style={{ color: "var(--primary)" }}>✦ submitted</span>
                                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                                    Your comment will appear after review.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="comment-name" className={labelClass} style={{ color: "var(--muted-text)" }}>
                                            Name <span aria-hidden="true">*</span>
                                        </label>
                                        <input
                                            id="comment-name"
                                            name="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            autoComplete="name"
                                            placeholder="Your name"
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="comment-message" className={labelClass} style={{ color: "var(--muted-text)" }}>
                                        Message <span aria-hidden="true">*</span>
                                    </label>
                                    <textarea
                                        id="comment-message"
                                        name="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        rows={4}
                                        placeholder="Share your thoughts…"
                                        className={inputClass}
                                        style={{ ...inputStyle, resize: "none" }}
                                    />
                                </div>

                                {formState === "error" && (
                                    <p role="alert" className="font-sans text-xs" style={{ color: "var(--accent)" }}>
                                        {errorMsg}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={formState === "loading"}
                                    className={btnClass + " py-2 w-fit"}
                                    style={btnStyle}
                                >
                                    {formState === "loading" ? "submitting…" : "post comment"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </Card.Content>
        </Card>
    );
}
