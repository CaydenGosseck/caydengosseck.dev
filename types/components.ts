import type { Blog } from "./api";

export type PaginationProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
};

export type DateDisplayProps = {
    date: string | Date;
    className?: string;
    style?: React.CSSProperties;
};

export type Language = {
    name: string;
    percent: string;
};

export type LanguageGridProps = {
    languages: Language[];
};

export type LanguageIconProps = {
    src: string;
    name: string;
};

export type BlogWithCount = Blog & { postCount: number };

export type BlogPageParams = { title: string };
export type PostPageParams = { title: string; postId: string };
