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

    const inputClass = "w-full px-3 py-2 font-sans text-sm border-0 border-b outline-none transition-colors duration-150";
    const inputStyle = { background: "var(--background)", borderColor: "var(--muted-text)", color: "var(--foreground)" };

    if (state === "success") {
        return (
            <Card>
                <Card.Header>
                    <Card.Title>subscribe</Card.Title>
                </Card.Header>
                <Card.Content>
                    <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>
                        Check your email to confirm your subscription.
                    </p>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>subscribe</Card.Title>
            </Card.Header>
            <Card.Content>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="subscribe-email" className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                            {isPerBlog
                                ? `Get notified about new posts in ${blogTitle}`
                                : "Get notified about all new posts"}
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
                            placeholder="you@example.com…"
                            className={inputClass}
                            style={inputStyle}
                        />
                    </div>

                    {blogTitle && (
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setScope("blog")}
                                className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150"
                                style={{
                                    border: "1px solid var(--border-color)",
                                    background: scope === "blog" ? "var(--accent)" : "transparent",
                                    color: "var(--foreground)",
                                }}
                            >
                                this blog
                            </button>
                            <button
                                type="button"
                                onClick={() => setScope("all")}
                                className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150"
                                style={{
                                    border: "1px solid var(--border-color)",
                                    background: scope === "all" ? "var(--accent)" : "transparent",
                                    color: "var(--foreground)",
                                }}
                            >
                                all blogs
                            </button>
                        </div>
                    )}

                    {state === "error" && (
                        <p role="alert" className="font-sans text-sm" style={{ color: "var(--foreground)" }}>
                            {errorMsg}
                        </p>
                    )}

                    <div className="flex flex-col gap-2">
                        <button
                            type="submit"
                            disabled={state === "loading"}
                            className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 transition-colors duration-150 hover:bg-[var(--muted-bg)] active:bg-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed w-fit"
                            style={{
                                border: "1px solid var(--border-color)",
                                background: "transparent",
                                color: "var(--foreground)",
                            }}
                        >
                            {state === "loading" ? "Subscribing…" : "Subscribe"}
                        </button>
                        <p className="font-sans text-xs" style={{ color: "var(--muted-text)" }}>
                            Only new post notifications. Unsubscribe anytime.{" "}
                            <Link href="/privacy" className="underline">Privacy Policy</Link>.
                        </p>
                    </div>
                </form>
            </Card.Content>
        </Card>
    );
}
