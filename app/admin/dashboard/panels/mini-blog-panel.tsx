"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/retroui/Card";
import type { MiniBlog } from "@/types/api";

const btnBase = "font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150";
const btnStyle = { border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" };
const inputClass = "w-full px-3 py-2 font-sans text-sm border-0 border-b outline-none transition-colors duration-150";
const inputStyle = { background: "var(--background)", borderColor: "var(--muted-text)", color: "var(--foreground)" };

export default function MiniBlogPanel() {
    const [entries, setEntries] = useState<MiniBlog[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/mini_blog");
        if (res.ok) setEntries(await res.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        setCreateError("");
        const res = await fetch("/api/mini_blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle.trim() }),
        });
        if (!res.ok) {
            const data = await res.json();
            setCreateError(data.error ?? "Failed to create.");
            setCreating(false);
            return;
        }
        setNewTitle("");
        setShowCreate(false);
        setCreating(false);
        await load();
    }

    async function handleDelete(id: number) {
        await fetch(`/api/mini_blog/${id}`, { method: "DELETE" });
        setConfirmDelete(null);
        await load();
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="font-pixel text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                    {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
                </span>
                <button
                    onClick={() => { setShowCreate(!showCreate); setCreateError(""); }}
                    className={btnBase + " px-3 py-2 hover:bg-[var(--muted-bg)]"}
                    style={btnStyle}
                >
                    {showCreate ? "cancel" : "new entry"}
                </button>
            </div>

            {showCreate && (
                <Card>
                    <Card.Content>
                        <form onSubmit={handleCreate} className="flex flex-col gap-3">
                            <input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="What's on your mind…"
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
                                className={btnBase + " px-3 py-2 w-fit hover:bg-[var(--muted-bg)] disabled:opacity-50"}
                                style={btnStyle}
                            >
                                {creating ? "creating…" : "create"}
                            </button>
                        </form>
                    </Card.Content>
                </Card>
            )}

            {loading && (
                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>Loading…</p>
            )}

            {!loading && entries.length === 0 && (
                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>No entries yet.</p>
            )}

            {entries.map((entry) => (
                <Card key={entry.id}>
                    <Card.Content>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-1 min-w-0">
                                <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>{entry.title}</p>
                                <p className="font-sans text-xs" style={{ color: "var(--muted-text)" }}>
                                    {new Date(entry.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setConfirmDelete(confirmDelete === entry.id ? null : entry.id)}
                                className={btnBase}
                                style={{ ...btnStyle, background: confirmDelete === entry.id ? "var(--accent)" : "transparent" }}
                            >
                                {confirmDelete === entry.id ? "confirm?" : "delete"}
                            </button>
                        </div>
                        {confirmDelete === entry.id && (
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleDelete(entry.id)}
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
        </div>
    );
}
