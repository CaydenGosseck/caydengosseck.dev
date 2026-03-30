"use client";

import stats from "@/config/stats.json";

function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
    return (
        <>
            <span className="font-pixel text-xs">{label}</span>
            <span className="font-sans text-base" style={{ color: "var(--foreground)" }}>{value || "—"}</span>
        </>
    );
}

function ListRow({ label, items }: { label: string; items: string[] }) {
    return (
        <>
            <span className="font-pixel text-xs self-start pt-1">{label}</span>
            <span className="font-sans text-base" style={{ color: "var(--foreground)" }}>
                {items.length === 0 ? "—" : items.join(", ")}
            </span>
        </>
    );
}

function Subtitle({ label }: { label: string }) {
    return (
        <span
            className="col-span-2 font-pixel text-xs uppercase tracking-widest pt-4"
        >
            {label}
        </span>
    );
}

export default function StatSheet() {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="font-pixel text-sm uppercase tracking-widest">
                Stat Sheet
            </h2>

            <div className="grid gap-x-8 gap-y-2" style={{ gridTemplateColumns: "max-content 1fr" }}>
                <Subtitle label="Information" />
                <Row label="name" value={stats.name} />
                <Row label="age" value={stats.age} />
                <Row label="height" value={stats.height} />
                <Row label="weight" value={stats.weight} />
                <Row label="job" value={stats.currentJob} />
                <Row label="degree" value={stats.currentDegree} />

                <Subtitle label="Strength" />
                <Row label="bench" value={stats.strength.bench} />
                <Row label="squat" value={stats.strength.squat} />
                <Row label="deadlift" value={stats.strength.deadlift} />

                <Subtitle label="Other" />
                <ListRow label="languages" items={stats.languages} />
                <ListRow label="tech stack" items={stats.techStack} />
                <ListRow label="hobbies" items={stats.hobbies} />
                <ListRow label="goals" items={stats.currentGoals} />
                <ListRow label="achievements" items={stats.achievements} />
            </div>
        </div>
    );
}
