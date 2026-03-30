import { readFileSync } from "fs";
import path from "path";
import type { Update } from "@/types/api";

function getUpdates(): Update[] {
    try {
        const p = path.join(process.cwd(), "config", "updates.json");
        return JSON.parse(readFileSync(p, "utf-8"));
    } catch { return []; }
}

export default function RecentUpdates() {
    const updates = getUpdates();
    const latest = updates[0] ?? null;
    return (
        <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
            <span className="font-sans text-sm" style={{ color: "var(--foreground)" }}>recent updates </span>
            {latest ? latest.text : "no updates."}
        </p>
    );
}
