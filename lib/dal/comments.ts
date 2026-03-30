import { supabase } from "@/lib/supabase";
import type { Comment, PaginatedComments } from "@/types/api";

const DEFAULT_PAGE_SIZE = 10;

export async function getVerifiedComments(page: number, pageSize: number = DEFAULT_PAGE_SIZE): Promise<PaginatedComments> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await supabase
        .from("comments")
        .select("id, name, message, verified, created_at", { count: "exact" })
        .eq("verified", true)
        .order("created_at", { ascending: false })
        .range(from, to);
    if (error) throw error;
    return { comments: data ?? [], total: count ?? 0, page, pageSize };
}

export async function getAllComments(page: number, pageSize: number = DEFAULT_PAGE_SIZE): Promise<PaginatedComments> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await supabase
        .from("comments")
        .select("id, name, message, verified, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
    if (error) throw error;
    return { comments: data ?? [], total: count ?? 0, page, pageSize };
}

export async function createComment(name: string, message: string): Promise<Comment> {
    const { data, error } = await supabase
        .from("comments")
        .insert({ name, message })
        .select("id, name, message, verified, created_at")
        .single();
    if (error) throw error;
    return data;
}

export async function verifyComment(id: number): Promise<void> {
    const { error } = await supabase
        .from("comments")
        .update({ verified: true })
        .eq("id", id);
    if (error) throw error;
}
