"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/retroui/Card";

type FormState = "idle" | "loading" | "success" | "error";

type SubscribeFormProps = {
    blogTitle?: string;
};

export default function SubscribeForm({ blogTitle }: SubscribeFormProps) {
    const [email, setEmail] = useState("");
    const [scope, setScope] = useState<"blog" | "all">(blogTitle ? "blog" : "all");
    const [state, setState] = useState<FormState>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const isPerBlog = blogTitle && scope === "blog";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, blogTitle: isPerBlog ? blogTitle : undefined }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrorMsg(data.error ?? "Something went wrong.");
                setState("error");
                return;
            }
            setState("success");
        } catch {
            setErrorMsg("Network error. Please try again.");
            setState("error");
        }
    }

    if (state === "success") {
        return (
            <Card>
                <Card.Content>
                    <div className="flex flex-col gap-2 py-2">
                        <span className="font-pixel text-xs uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                            ✦ subscribed
                        </span>
                        <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>
                            Check your email to confirm your subscription.
                        </p>
                    </div>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card>
            <Card.Content>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-5">

                        {/* Header */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="font-pixel text-xs uppercase tracking-widest" style={{ color: "var(--primary)" }}>newsletter</span>
                                <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
                            </div>
                            <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                                {isPerBlog
                                    ? `New posts in ${blogTitle} — straight to your inbox.`
                                    : "New posts, straight to your inbox. No spam."}
                            </p>
                        </div>

                        {/* Scope toggle */}
                        {blogTitle && (
                            <div
                                className="flex w-fit"
                                style={{ border: "1px solid var(--border-color)" }}
                            >
                                {(["blog", "all"] as const).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setScope(s)}
                                        className="font-pixel text-[9px] uppercase tracking-widest px-3 py-1.5 transition-colors duration-150"
                                        style={{
                                            background: scope === s ? "var(--accent)" : "transparent",
                                            color: "var(--foreground)",
                                            borderRight: s === "blog" ? "1px solid var(--border-color)" : undefined,
                                        }}
                                    >
                                        {s === "blog" ? "this blog" : "all blogs"}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Email row */}
                        <div className="flex gap-2 items-end">
                            <div className="flex flex-col gap-1 flex-1">
                                <label htmlFor="subscribe-email" className="font-pixel text-[9px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                                    email
                                </label>
                                <input
                                    id="subscribe-email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    spellCheck={false}
                                    placeholder="you@example.com"
                                    className="w-full px-3 py-2 font-sans text-sm border-0 border-b outline-none transition-colors duration-150"
                                    style={{ background: "transparent", borderColor: "var(--border-color)", color: "var(--foreground)" }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={state === "loading"}
                                className="font-pixel text-[9px] uppercase tracking-widest px-4 py-2 transition-colors duration-150 hover:bg-[var(--muted-bg)] active:bg-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                                style={{
                                    border: "1px solid var(--border-color)",
                                    background: "transparent",
                                    color: "var(--foreground)",
                                }}
                            >
                                {state === "loading" ? "…" : "subscribe"}
                            </button>
                        </div>

                        {state === "error" && (
                            <p role="alert" className="font-sans text-xs" style={{ color: "var(--accent)" }}>
                                {errorMsg}
                            </p>
                        )}

                        <p className="font-sans text-xs" style={{ color: "var(--muted-text)" }}>
                            Unsubscribe anytime.{" "}
                            <Link href="/privacy" className="underline hover:opacity-80 transition-opacity">
                                Privacy Policy
                            </Link>
                        </p>

                    </div>
                </form>
            </Card.Content>
        </Card>
    );
}
