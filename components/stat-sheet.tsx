"use client";

import stats from "@/config/stats.json";
import { Card } from "@/components/retroui/Card";

function Field({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="font-pixel text-[9px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                {label}
            </span>
            <span className="font-sans text-sm" style={{ color: "var(--foreground)" }}>
                {value}
            </span>
        </div>
    );
}

function ListField({ label, items }: { label: string; items: string[] }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="font-pixel text-[9px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                {label}
            </span>
            <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                    <span
                        key={item}
                        className="font-sans text-xs px-2 py-0.5"
                        style={{ border: "1px solid var(--border-color)", color: "var(--foreground)", background: "var(--muted-bg)" }}
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function StatSheet() {
    return (
        <Card>
            <Card.Header>
                <Card.Title>stat sheet</Card.Title>
            </Card.Header>
            <Card.Content>
                <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-6 items-start">
                    {/* Information */}
                    <div className="flex flex-col gap-3">
                        <span className="font-pixel text-[9px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                            information
                        </span>
                        <div className="flex flex-col gap-3">
                            <Field label="name" value={stats.name} />
                            <Field label="age" value={stats.age} />
                            <Field label="height" value={stats.height} />

                            <Field label="job" value={stats.currentJob} />
                            <Field label="degree" value={stats.currentDegree} />
                        </div>
                    </div>

                    {/* Other */}
                    <div className="flex flex-col gap-3">
                        <span className="font-pixel text-[9px] uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                            other
                        </span>
                        <div className="flex flex-col gap-3">
                            <ListField label="languages" items={stats.languages} />
                            <ListField label="tech stack" items={stats.techStack} />
                            <ListField label="hobbies" items={stats.hobbies} />
                            <ListField label="goals" items={stats.currentGoals} />
                            <ListField label="achievements" items={stats.achievements} />
                        </div>
                    </div>
                </div>
            </Card.Content>
        </Card>
    );
}
