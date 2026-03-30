"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import type { ExtraProps } from "react-markdown";

type CodeProps = React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & ExtraProps;

function CodeBlock({ className, children }: CodeProps) {
    const match = /language-(\w+)/.exec(className ?? "");
    const code = String(children).replace(/\n$/, "");

    if (match) {
        return (
            <SyntaxHighlighter
                style={oneDark}
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
            className="text-sm px-1"
            style={{ background: "var(--card-bg)", color: "var(--foreground)", fontFamily: "var(--font-geist-mono)" }}
        >
            {children}
        </code>
    );
}

const components: Components = {
    h1: ({ children }) => <h2 className="font-sans text-xl font-bold mt-4" style={{ color: "var(--foreground)" }}>{children}</h2>,
    h2: ({ children }) => <h3 className="font-sans text-lg font-semibold mt-4" style={{ color: "var(--foreground)" }}>{children}</h3>,
    h3: ({ children }) => <h4 className="font-sans text-base font-bold mt-2" style={{ color: "var(--foreground)" }}>{children}</h4>,
    p: ({ children }) => <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>{children}</p>,
    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--link)" }}>{children}</a>,
    code: CodeBlock,
    pre: ({ children }) => <div>{children}</div>,
    ul: ({ children }) => <ul className="flex flex-col gap-1 pl-4 list-disc">{children}</ul>,
    ol: ({ children }) => <ol className="flex flex-col gap-1 pl-4 list-decimal">{children}</ol>,
    li: ({ children }) => <li className="font-sans text-base" style={{ color: "var(--foreground)" }}>{children}</li>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    hr: () => <hr style={{ borderColor: "var(--border-color)" }} />,
};

export default function ReadmeDisplay({ content }: { content: string }) {
    return (
        <div
            className="font-sans text-base leading-relaxed flex flex-col gap-3"
            style={{ color: "var(--foreground)" }}
        >
            <ReactMarkdown components={components} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
