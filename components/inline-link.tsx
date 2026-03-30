import Link from "next/link";

type InlineLinkProps = {
    href: string;
    children: React.ReactNode;
    external?: boolean;
};

const linkClass = "underline hover:opacity-75 transition-opacity duration-150";

export default function InlineLink({ href, children, external }: InlineLinkProps) {
    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                style={{ color: "var(--link)" }}
            >
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={linkClass} style={{ color: "var(--link)" }}>
            {children}
        </Link>
    );
}
