type LinkCardProps = {
    href: string;
    title: string;
    description?: string;
};

export function LinkCard({ href, title, description }: LinkCardProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1 px-4 py-3 rounded-sm no-underline transition-colors duration-150 hover:bg-[var(--muted-bg)]"
            style={{
                border: "1px solid var(--border-color)",
                background: "var(--card-bg)",
            }}
        >
            <span className="font-sans text-base font-semibold" style={{ color: "var(--primary)" }}>
                {title}
            </span>
            {description && (
                <span className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                    {description}
                </span>
            )}
            <span className="font-pixel text-[9px] uppercase tracking-widest mt-1" style={{ color: "var(--muted-text)" }}>
                {href}
            </span>
        </a>
    );
}
