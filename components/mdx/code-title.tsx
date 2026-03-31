type CodeTitleProps = {
    title: string;
    lang?: string;
};

export function CodeTitle({ title, lang }: CodeTitleProps) {
    return (
        <div
            className="flex items-center justify-between px-3 py-1.5 -mb-1 rounded-t-sm"
            style={{
                background: "var(--muted-bg)",
                border: "1px solid var(--border-color)",
                borderBottom: "none",
            }}
        >
            <span className="font-mono text-xs" style={{ color: "var(--muted-text)" }}>
                {title}
            </span>
            {lang && (
                <span
                    className="font-pixel text-[9px] uppercase tracking-widest"
                    style={{ color: "var(--primary)" }}
                >
                    {lang}
                </span>
            )}
        </div>
    );
}
