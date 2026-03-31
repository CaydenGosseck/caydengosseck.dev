import type { ReactNode } from "react";

type StepProps = {
    title?: string;
    children: ReactNode;
};

type StepsProps = {
    children: ReactNode;
};

export function Step({ title, children }: StepProps) {
    // Rendered by Steps — this is a structural marker only
    return <>{title ? <><strong>{title}</strong>{children}</> : children}</>;
}

export function Steps({ children }: StepsProps) {
    const items = Array.isArray(children) ? children : [children];

    return (
        <div className="flex flex-col">
            {items.map((child, i) => {
                const isLast = i === items.length - 1;
                // Extract title and content from child props if available
                const props = (child as React.ReactElement<StepProps>)?.props ?? {};
                const title = props.title;
                const content = props.children;

                return (
                    <div key={i} className="flex gap-4">
                        {/* Left: number + connector line */}
                        <div className="flex flex-col items-center shrink-0" style={{ width: "2rem" }}>
                            <div
                                className="flex items-center justify-center rounded-full font-pixel text-[9px] shrink-0"
                                style={{
                                    width: "1.75rem",
                                    height: "1.75rem",
                                    border: "1px solid var(--border-color)",
                                    background: "var(--muted-bg)",
                                    color: "var(--primary)",
                                }}
                            >
                                {i + 1}
                            </div>
                            {!isLast && (
                                <div
                                    className="flex-1 w-px mt-1"
                                    style={{ background: "var(--border-color)", minHeight: "1.5rem" }}
                                />
                            )}
                        </div>

                        {/* Right: content */}
                        <div className={`flex flex-col gap-1 ${isLast ? "pb-0" : "pb-5"}`} style={{ flex: 1, minWidth: 0 }}>
                            {title && (
                                <p className="font-sans text-base font-semibold" style={{ color: "var(--foreground)" }}>
                                    {title}
                                </p>
                            )}
                            <div className="font-sans text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                                {content ?? null}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
