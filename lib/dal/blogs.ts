import { supabase } from "@/lib/supabase";
import type { Blog } from "@/types/api";

export async function getAllBlogs(): Promise<Blog[]> {
    const { data, error } = await supabase
        .from("blogs")
        .select("blog_title, created_at, updated_at")
        .eq("deleted", false)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({ title: row.blog_title, created_at: row.created_at, updated_at: row.updated_at }));
}

export async function getBlogByTitle(title: string): Promise<Blog | undefined> {
    const { data, error } = await supabase
        .from("blogs")
        .select("blog_title, created_at, updated_at")
        .eq("blog_title", title)
        .eq("deleted", false)
        .single();
    if (error) return undefined;
    return { title: data.blog_title, created_at: data.created_at, updated_at: data.updated_at };
}

export async function createBlog(title: string): Promise<{ title: string }> {
    const { error } = await supabase.from("blogs").insert({ blog_title: title });
    if (error) throw error;
    return { title };
}

export async function deleteBlog(title: string): Promise<void> {
    const { error: postsError } = await supabase
        .from("posts")
        .update({ deleted: true })
        .eq("blog_title", title);
    if (postsError) throw postsError;

    const { error: blogError } = await supabase
        .from("blogs")
        .update({ deleted: true })
        .eq("blog_title", title);
    if (blogError) throw blogError;
}
