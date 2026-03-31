"use client";

import { useState } from "react";
import { Card } from "@/components/retroui/Card";

export default function SubscribedBanner() {
    const [open, setOpen] = useState(true);
    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Subscription confirmed"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setOpen(false)}
        >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
                <Card>
                    <Card.Header>
                        <Card.Title>subscribed</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="flex flex-col gap-4">
                            <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                                You're confirmed. You'll receive an email when new posts go live.
                            </p>
                            <button
                                onClick={() => setOpen(false)}
                                className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 w-fit transition-colors duration-150 hover:bg-[var(--muted-bg)] active:bg-[var(--accent)]"
                                style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)" }}
                            >
                                close
                            </button>
                        </div>
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
}
