"use client";

import { useState } from "react";
import type { LanguageIconProps } from "@/types/components";

export default function LanguageIcon({ src, name }: LanguageIconProps) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <span style={{ width: 12, height: 12, fontSize: "0.5rem", lineHeight: "12px", color: "var(--muted-text)", flexShrink: 0, textAlign: "center", display: "inline-block" }}>
                {name[0]}
            </span>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} width={12} height={12} onError={() => setFailed(true)} />
    );
}
