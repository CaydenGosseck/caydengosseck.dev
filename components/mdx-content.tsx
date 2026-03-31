import { compileMDX } from "next-mdx-remote/rsc";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { MDXComponents as Components } from "mdx/types";
import { Callout } from "@/components/mdx/callout";
import { Steps, Step } from "@/components/mdx/steps";
import { CodeTitle } from "@/components/mdx/code-title";
import { LinkCard } from "@/components/mdx/link-card";
import { Badge } from "@/components/retroui/Badge";

type CodeProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

function CodeBlock({ className, children }: CodeProps) {
    const match = /language-(\w+)/.exec(className ?? "");
    const code = String(children).replace(/\n$/, "");

    if (match) {
        return (
            <SyntaxHighlighter
                style={oneDark as never}
                language={match[1]}
                PreTag="div"
                customStyle={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "0.875rem",
                    borderRadius: "0.25rem",
                    margin: 0,
                }}
                codeTagProps={{ style: { fontFamily: "var(--font-geist-mono)" } }}
            >
                {code}
            </SyntaxHighlighter>
        );
    }

    return (
        <code
            className="text-sm px-1 rounded"
            style={{ background: "var(--muted-bg)", color: "var(--foreground)", fontFamily: "var(--font-geist-mono)" }}
        >
            {children}
        </code>
    );
}

const components: Components = {
    // HTML element overrides
    h1: ({ children }) => <h2 className="font-serif text-2xl mt-6 mb-2" style={{ color: "var(--primary)" }}>{children}</h2>,
    h2: ({ children }) => <h3 className="font-serif text-xl mt-5 mb-2" style={{ color: "var(--primary)" }}>{children}</h3>,
    h3: ({ children }) => <h4 className="font-serif text-lg mt-4 mb-1" style={{ color: "var(--primary)" }}>{children}</h4>,
    p: ({ children }) => <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>{children}</p>,
    a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline" style={{ color: "var(--link)" }}>
            {children}
        </a>
    ),
    code: CodeBlock,
    pre: ({ children }) => <div>{children}</div>,
    ul: ({ children }) => <ul className="flex flex-col gap-1 pl-5 list-disc">{children}</ul>,
    ol: ({ children }) => <ol className="flex flex-col gap-1 pl-5 list-decimal">{children}</ol>,
    li: ({ children }) => <li className="font-sans text-base" style={{ color: "var(--foreground)" }}>{children}</li>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    hr: () => <hr style={{ borderColor: "var(--border-color)" }} />,
    blockquote: ({ children }) => (
        <blockquote className="pl-4 italic" style={{ borderLeft: "2px solid var(--border-color)", color: "var(--muted-text)" }}>
            {children}
        </blockquote>
    ),
    // Custom MDX components
    Callout: Callout as Components["Callout"],
    Steps: Steps as Components["Steps"],
    Step: Step as Components["Step"],
    CodeTitle: CodeTitle as Components["CodeTitle"],
    LinkCard: LinkCard as Components["LinkCard"],
    Badge: Badge as Components["Badge"],
};

export default async function MDXContent({ source }: { source: string }) {
    const { content } = await compileMDX({
        source,
        components,
        options: {
            // rehype-sanitize is omitted: MDX compiles JSX to React elements before
            // rehype runs, so custom components are safe. Standard markdown HTML is
            // already escaped by the MDX compiler itself.
        },
    });

    return (
        <div className="font-sans text-base leading-relaxed flex flex-col gap-4">
            {content}
        </div>
    );
}
