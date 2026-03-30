"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FULL_TEXT = "CaydenGosseck.dev";
const CHAR_DELAY = 80; // ms per character

export default function Nav() {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        if (displayed.length >= FULL_TEXT.length) return;
        const timeout = setTimeout(() => {
            setDisplayed(FULL_TEXT.slice(0, displayed.length + 1));
        }, CHAR_DELAY);
        return () => clearTimeout(timeout);
    }, [displayed]);

    return (
        <Link
            href="/"
            className="font-pixel text-lg md:text-2xl font-bold uppercase tracking-widest no-underline"
        >
            {displayed}
            {displayed.length < FULL_TEXT.length && (
                <span className="animate-pulse" aria-hidden="true">_</span>
            )}
        </Link>
    );
}
