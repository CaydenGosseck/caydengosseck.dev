import { deviconUrl } from "@/lib/github";
import LanguageIcon from "./language-icon";
import { Badge } from "@/components/retroui/Badge";
import type { Language, LanguageGridProps } from "@/types/components";

const COLUMN_SIZE = 4;

export default function LanguageGrid({ languages }: LanguageGridProps) {
    if (languages.length === 0) return null;

    const columns: Language[][] = [];
    for (let i = 0; i < languages.length; i += COLUMN_SIZE) {
        columns.push(languages.slice(i, i + COLUMN_SIZE));
    }

    return (
        <div style={{ display: "flex", flexDirection: "row", gap: "24px" }}>
            {columns.map((col, ci) => (
                <div key={ci} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {col.map((lang) => (
                        <div key={lang.name} className="flex items-center gap-2">
                            <LanguageIcon src={deviconUrl(lang.name)} name={lang.name} />
                            <Badge variant="default" size="sm" className="font-sans">
                                {lang.name} {lang.percent}
                            </Badge>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
