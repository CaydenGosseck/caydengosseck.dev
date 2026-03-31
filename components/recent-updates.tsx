import { getRecentUpdate } from "@/lib/dal/updates";

export default async function RecentUpdates() {
    const latest = await getRecentUpdate();
    return (
        <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
            <span className="font-sans text-sm" style={{ color: "var(--foreground)" }}>recent updates </span>
            {latest ? latest.text : "no updates."}
        </p>
    );
}
