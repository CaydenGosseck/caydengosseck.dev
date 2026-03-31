import type { ReactNode } from "react";

type CalloutType = "info" | "tip" | "warning" | "danger";

type CalloutProps = {
    type?: CalloutType;
    children: ReactNode;
};

const config: Record<CalloutType, { icon: string; border: string; bg: string; labelColor: string; label: string }> = {
    info: {
        icon: "ℹ",
        border: "var(--primary)",
        bg: "rgba(133, 157, 219, 0.08)",
        labelColor: "var(--primary)",
        label: "info",
    },
    tip: {
        icon: "✦",
        border: "#4a9e6a",
        bg: "rgba(74, 158, 106, 0.08)",
        labelColor: "#4a9e6a",
        label: "tip",
    },
    warning: {
        icon: "⚠",
        border: "#c4923a",
        bg: "rgba(196, 146, 58, 0.08)",
        labelColor: "#c4923a",
        label: "warning",
    },
    danger: {
        icon: "✕",
        border: "var(--accent)",
        bg: "rgba(139, 28, 48, 0.12)",
        labelColor: "var(--accent)",
        label: "danger",
    },
};

export function Callout({ type = "info", children }: CalloutProps) {
    const c = config[type];
    return (
        <div
            className="flex flex-col gap-1 px-4 py-3 rounded-sm"
            style={{
                borderLeft: `3px solid ${c.border}`,
                background: c.bg,
            }}
        >
            <span
                className="font-pixel text-[9px] uppercase tracking-widest"
                style={{ color: c.labelColor }}
            >
                {c.icon} {c.label}
            </span>
            <div className="font-sans text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                {children}
            </div>
        </div>
    );
}
