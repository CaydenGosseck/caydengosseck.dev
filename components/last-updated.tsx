import { getRecentUpdate } from "@/lib/dal/updates";
import { getRecentPost } from "@/lib/dal/posts";

export default async function LastUpdated() {
    const [update, post] = await Promise.all([
        getRecentUpdate(),
        getRecentPost(),
    ]);

    const dates = [
        update?.date,
        post?.created_at,
    ].filter(Boolean).map((d) => new Date(d!));

    const latest = dates.length > 0
        ? new Date(Math.max(...dates.map((d) => d.getTime())))
        : null;
    const formatted = latest
        ? latest.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "—";

    return (
        <p className="font-sans text-xs whitespace-nowrap" style={{ color: "var(--muted-text)" }}>
            <span className="font-pixel text-[9px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                last updated{" "}
            </span>
            {formatted}
        </p>
    );
}
