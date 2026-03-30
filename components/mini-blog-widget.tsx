"use client";

import { useState } from "react";
import type { MiniBlog } from "@/types/api";

export default function MiniBlogWidget({ initial }: { initial: MiniBlog | null }) {
    const [entry, setEntry] = useState<MiniBlog | null>(initial);
    const [loading, setLoading] = useState(false);

    async function fetchRandom() {
        setLoading(true);
        try {
            const res = await fetch("/api/mini_blog?random=true");
            if (res.ok) setEntry(await res.json());
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={fetchRandom}
            disabled={loading}
            className="font-sans text-sm text-left disabled:opacity-50 cursor-pointer"
            style={{ color: "var(--muted-text)" }}
        >
            <span className="font-sans text-sm" style={{ color: "var(--foreground)" }}>mini blog </span>
            {entry ? entry.title : "no thoughts yet."}
        </button>
    );
}
