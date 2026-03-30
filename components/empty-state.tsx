type EmptyStateProps = {
    icon?: React.ReactNode;
    title: string;
    description?: string;
};

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <div
            className="flex flex-col items-center justify-center gap-3 py-10 px-6 w-full border-2 border-dashed"
            style={{ borderColor: "var(--border-color)" }}
        >
            {icon && (
                <div style={{ color: "var(--muted-text)" }}>{icon}</div>
            )}
            <p className="font-sans text-base text-center" style={{ color: "var(--foreground)" }}>
                {title}
            </p>
            {description && (
                <p className="font-sans text-sm text-center" style={{ color: "var(--muted-text)" }}>
                    {description}
                </p>
            )}
        </div>
    );
}
