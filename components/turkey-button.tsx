"use client";

import React from "react";

function turkeyify(text: string): string {
    let out = "";
    let i = 0;
    for (const ch of text) {
        out += ch.trim() === "" ? ch : (i++ % 2 === 0 ? "🦃" : "🪱");
    }
    return out;
}

let _turkeyActive = false;
const _saved: [Text, string][] = [];
let _observer: MutationObserver | null = null;

function turkeyifyNode(t: Text) {
    const txt = t.nodeValue ?? "";
    if (txt.trim()) {
        _saved.push([t, txt]);
        t.nodeValue = turkeyify(txt);
    }
}

function walkAndTurkeyify(root: Node) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const tag = node.parentElement?.tagName;
            return (tag === "SCRIPT" || tag === "STYLE") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
    });
    let node: Node | null;
    while ((node = walker.nextNode())) {
        turkeyifyNode(node as Text);
    }
}

function toggleTurkey(e: React.MouseEvent) {
    e.preventDefault();
    if (!_turkeyActive) {
        _saved.length = 0;
        walkAndTurkeyify(document.body);
        _observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "characterData") {
                    const t = mutation.target as Text;
                    const txt = t.nodeValue ?? "";
                    if (txt.trim() && !txt.includes("🦃") && !txt.includes("🪱")) {
                        const existing = _saved.find(([n]) => n === t);
                        if (existing) existing[1] = txt;
                        else _saved.push([t, txt]);
                        t.nodeValue = turkeyify(txt);
                    }
                } else {
                    for (const added of mutation.addedNodes) {
                        if (added.nodeType === Node.TEXT_NODE) {
                            turkeyifyNode(added as Text);
                        } else if (added.nodeType === Node.ELEMENT_NODE) {
                            walkAndTurkeyify(added);
                        }
                    }
                }
            }
        });
        _observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    } else {
        _observer?.disconnect();
        _observer = null;
        for (const [node, orig] of _saved) {
            node.nodeValue = orig;
        }
        _saved.length = 0;
    }
    _turkeyActive = !_turkeyActive;
}

import { Button } from "@/components/retroui/Button";

export default function TurkeyButton() {
    return (
        <Button
            onClick={toggleTurkey}
            title="turkey worm"
            variant="outline"
            size="sm"
            className="font-pixel text-xs border-[var(--border-color)] text-[var(--foreground)]"
        >
            🦃🪱
        </Button>
    );
}
