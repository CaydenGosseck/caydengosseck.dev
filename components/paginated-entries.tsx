"use client";

import React, { useState } from "react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";

type PaginatedEntriesProps<T> = {
    label: string;
    items: T[];
    emptyMessage: string;
    keyExtractor: (item: T) => string;
    renderItem: (item: T) => React.ReactNode;
    asChild?: boolean | ((item: T) => boolean);
    pageSize?: number;
    placeholderText?: string;
};

export default function PaginatedEntries<T>({
    label,
    items,
    emptyMessage,
    keyExtractor,
    renderItem,
    asChild = false,
    pageSize = 6,
    placeholderText,
}: PaginatedEntriesProps<T>) {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(items.length / pageSize);
    const slice = items.slice(page * pageSize, page * pageSize + pageSize);

    return (
        <SidebarGroup>
            <SidebarGroupLabel
                className="font-pixel text-xs uppercase tracking-widest"
            >
                {label}
            </SidebarGroupLabel>
            <div className="flex flex-col" style={{ minHeight: `${pageSize * 3.5}rem` }}>
                <SidebarMenu className="flex-1">
                    {items.length === 0 ? (
                        <p className="font-sans text-sm italic px-2" style={{ color: "var(--muted-text)" }}>
                            {emptyMessage}
                        </p>
                    ) : (
                        <>
                            {slice.map((item) => {
                                const itemAsChild = typeof asChild === "function" ? asChild(item) : asChild;
                                return (
                                    <SidebarMenuItem key={keyExtractor(item)}>
                                        <SidebarMenuButton
                                            asChild={itemAsChild}
                                            className="flex flex-col items-start gap-1 h-auto py-2"
                                        >
                                            {renderItem(item)}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                            {placeholderText && slice.length < pageSize &&
                                Array.from({ length: pageSize - slice.length }, (_, i) => (
                                    <SidebarMenuItem key={`placeholder-${i}`}>
                                        <SidebarMenuButton className="flex flex-col items-start gap-1 h-auto py-2 pointer-events-none">
                                            <span className="font-sans text-sm italic" style={{ color: "var(--muted-text)" }}>
                                                {placeholderText}
                                            </span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </>
                    )}
                </SidebarMenu>
                <Pagination className="mt-auto" style={{ visibility: totalPages > 1 ? "visible" : "hidden" }}>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setPage((p) => p - 1)}
                            aria-disabled={page === 0}
                            className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="font-sans text-sm px-1" style={{ color: "var(--muted-text)" }}>
                            {page + 1}/{totalPages}
                        </span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setPage((p) => p + 1)}
                            aria-disabled={page === totalPages - 1}
                            className={page === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            </div>
        </SidebarGroup>
    );
}
