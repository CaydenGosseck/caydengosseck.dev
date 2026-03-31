"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Card } from "@/components/retroui/Card";
import { Callout } from "@/components/mdx/callout";
import { Steps, Step } from "@/components/mdx/steps";
import { CodeTitle } from "@/components/mdx/code-title";
import { LinkCard } from "@/components/mdx/link-card";
import { Badge } from "@/components/retroui/Badge";

type ComponentEntry = {
    name: string;
    snippet: string;
    preview: ReactNode;
};

const ENTRIES: ComponentEntry[] = [
    {
        name: "Callout",
        snippet: "<Callout>Default info callout.</Callout>",
        preview: <Callout>Info callout.</Callout>,
    },
    {
        name: "Callout tip",
        snippet: '<Callout type="tip">Your message here.</Callout>',
        preview: <Callout type="tip">Tip callout.</Callout>,
    },
    {
        name: "Callout warning",
        snippet: '<Callout type="warning">Be careful with this.</Callout>',
        preview: <Callout type="warning">Warning.</Callout>,
    },
    {
        name: "Callout danger",
        snippet: '<Callout type="danger">This will delete data.</Callout>',
        preview: <Callout type="danger">Danger!</Callout>,
    },
    {
        name: "Steps",
        snippet: `<Steps>\n  <Step title="First">Do this first.</Step>\n  <Step title="Second">Then this.</Step>\n</Steps>`,
        preview: (
            <Steps>
                <Step title="First">Do this.</Step>
                <Step title="Second">Then this.</Step>
            </Steps>
        ),
    },
    {
        name: "CodeTitle",
        snippet: '<CodeTitle title="lib/utils.ts" lang="ts" />',
        preview: <CodeTitle title="lib/utils.ts" lang="ts" />,
    },
    {
        name: "LinkCard",
        snippet: '<LinkCard href="https://nextjs.org" title="Next.js" description="The React framework." />',
        preview: <LinkCard href="https://nextjs.org" title="Next.js" description="The React framework." />,
    },
    {
        name: "Badge",
        snippet: '<Badge variant="outline">TypeScript</Badge>',
        preview: <Badge variant="outline">TypeScript</Badge>,
    },
];

const SCALE = 0.55;

function PreviewPane({ children }: { children: ReactNode }) {
    return (
        <div className="relative overflow-hidden" style={{ height: "7rem", width: "16rem" }}>
                {children}
        </div>
    );
}

function EntryCard({ entry }: { entry: ComponentEntry }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        await navigator.clipboard.writeText(entry.snippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <div
            onClick={handleCopy}
            title={entry.snippet}
            className="flex flex-col gap-1 p-2 cursor-pointer transition-colors duration-150 hover:bg-[var(--muted-bg)] overflow-hidden"
            style={{ border: "1px solid var(--border-color)", background: copied ? "var(--accent)" : "var(--card-bg)" }}
        >
            <PreviewPane>{entry.preview}</PreviewPane>
            <p className="font-mono text-[9px] leading-tight line-clamp-2 shrink-0" style={{ color: "var(--muted-text)" }}>
                {entry.snippet}
            </p>
            <span
                className="font-pixel text-[8px] uppercase tracking-widest truncate shrink-0 mt-auto"
                style={{ color: copied ? "var(--foreground)" : "var(--primary)" }}
            >
                {copied ? "✓ copied" : entry.name}
            </span>
        </div>
    );
}

export default function ComponentReference() {
    return (
        <Card>
            <Card.Header>
                <Card.Title>components</Card.Title>
            </Card.Header>
            <Card.Content>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ENTRIES.map((entry) => (
                        <EntryCard key={entry.name} entry={entry} />
                    ))}
                </div>
            </Card.Content>
        </Card>
    );
}
