import { supabase } from "@/lib/supabase";
import type { Update } from "@/types/api";

export async function getAllUpdates(): Promise<Update[]> {
    const { data, error } = await supabase
        .from("updates")
        .select("id, text, date, created_at")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function getRecentUpdate(): Promise<Update | undefined> {
    const { data, error } = await supabase
        .from("updates")
        .select("id, text, date, created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
    if (error) return undefined;
    return data;
}

export async function createUpdate(text: string, date: string): Promise<Update> {
    const { data, error } = await supabase
        .from("updates")
        .insert({ text, date })
        .select("id, text, date, created_at")
        .single();
    if (error) throw error;
    return data;
}

export async function deleteUpdate(id: number): Promise<void> {
    const { error } = await supabase
        .from("updates")
        .delete()
        .eq("id", id);
    if (error) throw error;
}
