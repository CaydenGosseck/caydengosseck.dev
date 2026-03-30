import type { DateDisplayProps } from "@/types/components";

export default function DateDisplay({ date, className, style }: DateDisplayProps) {
    const formatted = new Date(date).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
    return (
        <span className={className} style={style}>
            {formatted}
        </span>
    );
}
