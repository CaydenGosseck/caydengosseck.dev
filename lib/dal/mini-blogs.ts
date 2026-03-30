import { supabase } from "@/lib/supabase";
import type { MiniBlog } from "@/types/api";

export async function getAllMiniBlogs(): Promise<MiniBlog[]> {
    const { data, error } = await supabase
        .from("mini_blogs")
        .select("id, title, created_at, updated_at")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function getRandomMiniBlog(): Promise<MiniBlog | undefined> {
    // Postgres doesn't have a direct ORDER BY random() in supabase-js, use rpc or raw
    const { data, error } = await supabase
        .from("mini_blogs")
        .select("id, title, created_at, updated_at");
    if (error || !data?.length) return undefined;
    return data[Math.floor(Math.random() * data.length)];
}

export async function getRecentMiniBlog(): Promise<MiniBlog | undefined> {
    const { data, error } = await supabase
        .from("mini_blogs")
        .select("id, title, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
    if (error) return undefined;
    return data;
}

export async function createMiniBlog(title: string, content?: string): Promise<{ id: number; title: string }> {
    const { data, error } = await supabase
        .from("mini_blogs")
        .insert({ title, content: content ?? null })
        .select("id")
        .single();
    if (error) throw error;
    return { id: data.id, title };
}
