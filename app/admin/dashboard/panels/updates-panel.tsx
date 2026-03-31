"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/retroui/Card";
import type { Update } from "@/types/api";

const btnBase = "font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150";
const btnStyle = { border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" };
const inputClass = "w-full px-3 py-2 font-sans text-sm border-0 border-b outline-none transition-colors duration-150";
const inputStyle = { background: "var(--background)", borderColor: "var(--muted-text)", color: "var(--foreground)" };

function todayISO(): string {
    return new Date().toISOString().slice(0, 10);
}

export default function UpdatesPanel() {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newText, setNewText] = useState("");
    const [newDate, setNewDate] = useState(todayISO);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null); // stores id

    async function load() {
        setLoading(true);
        const res = await fetch("/api/updates");
        if (res.ok) setUpdates(await res.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        setCreateError("");
        const res = await fetch("/api/updates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: newText.trim(), date: newDate }),
        });
        if (!res.ok) {
            const data = await res.json();
            setCreateError(data.error ?? "Failed to create.");
            setCreating(false);
            return;
        }
        setNewText("");
        setNewDate(todayISO());
        setShowCreate(false);
        setCreating(false);
        await load();
    }

    async function handleDelete(id: number) {
        await fetch("/api/updates", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        setConfirmDelete(null);
        await load();
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="font-pixel text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                    {updates.length} update{updates.length !== 1 ? "s" : ""}
                </span>
                <button
                    onClick={() => { setShowCreate(!showCreate); setCreateError(""); }}
                    className={btnBase + " px-3 py-2 hover:bg-[var(--muted-bg)]"}
                    style={btnStyle}
                >
                    {showCreate ? "cancel" : "new update"}
                </button>
            </div>

            {showCreate && (
                <Card>
                    <Card.Content>
                        <form onSubmit={handleCreate} className="flex flex-col gap-3">
                            <input
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                placeholder="Update text…"
                                required
                                className={inputClass}
                                style={inputStyle}
                            />
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
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

            {!loading && updates.length === 0 && (
                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>No updates yet.</p>
            )}

            {updates.map((update) => (
                <Card key={update.id}>
                    <Card.Content>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-1 min-w-0">
                                <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>{update.text}</p>
                                <p className="font-sans text-xs" style={{ color: "var(--muted-text)" }}>{update.date}</p>
                            </div>
                            <button
                                onClick={() => setConfirmDelete(confirmDelete === update.id ? null : update.id)}
                                className={btnBase}
                                style={{ ...btnStyle, background: confirmDelete === update.id ? "var(--accent)" : "transparent" }}
                            >
                                {confirmDelete === update.id ? "confirm?" : "delete"}
                            </button>
                        </div>
                        {confirmDelete === update.id && (
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleDelete(update.id)}
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
