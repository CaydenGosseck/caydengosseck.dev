"use client";

import { useState } from "react";
import SubscribeForm from "@/components/subscribe-form";

type SubscribeModalProps = {
    blogTitle?: string;
};

export default function SubscribeModal({ blogTitle }: SubscribeModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 transition-colors duration-150 hover:bg-[var(--muted-bg)] active:bg-[var(--accent)] w-fit"
                style={{
                    border: "1px solid var(--border-color)",
                    background: "transparent",
                    color: "var(--foreground)",
                }}
            >
                subscribe
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Subscribe"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                    onClick={() => setOpen(false)}
                >
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
                        <SubscribeForm blogTitle={blogTitle} />
                    </div>
                </div>
            )}
        </>
    );
}
