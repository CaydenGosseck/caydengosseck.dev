"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Card } from "@/components/retroui/Card";

export default function AdminPage() {
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [open, setOpen] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const inputClass = "w-full px-3 py-2 font-sans text-sm border-0 border-b outline-none transition-colors duration-150";
    const inputStyle = { background: "var(--background)", borderColor: "var(--muted-text)", color: "var(--foreground)" };

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError("Invalid credentials");
            setLoading(false);
            return;
        }
        router.push("/admin/dashboard");
        router.refresh();
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 transition-colors duration-150 hover:bg-[var(--muted-bg)] active:bg-[var(--accent)]"
                style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)" }}
            >
                admin login
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Admin login"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                    onClick={() => setOpen(false)}
                >
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
                        <Card>
                            <Card.Header>
                                <Card.Title>admin login</Card.Title>
                            </Card.Header>
                            <Card.Content>
                                <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="admin-email" className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                                            email
                                        </label>
                                        <input
                                            id="admin-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                            spellCheck={false}
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="admin-password" className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                                            password
                                        </label>
                                        <input
                                            id="admin-password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="current-password"
                                            className={inputClass}
                                            style={inputStyle}
                                        />
                                    </div>
                                    {error && (
                                        <p role="alert" className="font-sans text-sm" style={{ color: "var(--accent)" }}>
                                            {error}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 w-fit transition-colors duration-150 hover:bg-[var(--muted-bg)] active:bg-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)" }}
                                    >
                                        {loading ? "signing in…" : "sign in"}
                                    </button>
                                </form>
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
}
