import { supabase } from "@/lib/supabase";
import type { Post } from "@/types/api";

export async function getPostCount(blogTitle: string): Promise<number> {
    const { count, error } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("blog_title", blogTitle)
        .eq("deleted", false);
    if (error) throw error;
    return count ?? 0;
}

export async function getPostsByBlog(blogTitle: string): Promise<Post[]> {
    const { data, error } = await supabase
        .from("posts")
        .select("post_id, blog_title, post_title, created_at, updated_at")
        .eq("blog_title", blogTitle)
        .eq("deleted", false)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({
        postId: row.post_id,
        blogTitle: row.blog_title,
        title: row.post_title,
        created_at: row.created_at,
        updated_at: row.updated_at,
    }));
}

export async function getRecentPost(): Promise<{ post_id: number; post_title: string; blog_title: string; created_at: string } | undefined> {
    const { data, error } = await supabase
        .from("posts")
        .select("post_id, post_title, blog_title, created_at, blogs!inner(deleted)")
        .eq("deleted", false)
        .eq("blogs.deleted", false)
        .order("created_at", { ascending: false })
        .order("post_id", { ascending: false })
        .limit(1)
        .single();
    if (error) return undefined;
    return { post_id: data.post_id, post_title: data.post_title, blog_title: data.blog_title, created_at: data.created_at };
}

export async function readPostContent(postId: number): Promise<string | null> {
    const { data, error } = await supabase
        .from("posts")
        .select("content")
        .eq("post_id", postId)
        .eq("deleted", false)
        .single();
    if (error) return null;
    return data?.content?.trim() || null;
}

export async function getPostById(postId: number): Promise<Pick<Post, "postId"> | undefined> {
    const { data, error } = await supabase
        .from("posts")
        .select("post_id")
        .eq("post_id", postId)
        .eq("deleted", false)
        .single();
    if (error) return undefined;
    return { postId: data.post_id };
}

export async function getPostByIdFull(postId: number): Promise<Post | undefined> {
    const { data, error } = await supabase
        .from("posts")
        .select("post_id, blog_title, post_title, created_at, updated_at")
        .eq("post_id", postId)
        .eq("deleted", false)
        .single();
    if (error) return undefined;
    return {
        postId: data.post_id,
        blogTitle: data.blog_title,
        title: data.post_title,
        created_at: data.created_at,
        updated_at: data.updated_at,
    };
}

export async function createPost(blogTitle: string, title: string, content?: string): Promise<{ postId: number; title: string; blogTitle: string }> {
    const { data, error } = await supabase
        .from("posts")
        .insert({ blog_title: blogTitle, post_title: title, content: content ?? null })
        .select("post_id")
        .single();
    if (error) throw error;
    return { postId: data.post_id, title, blogTitle };
}

export async function deletePost(postId: number): Promise<void> {
    const { error } = await supabase
        .from("posts")
        .update({ deleted: true })
        .eq("post_id", postId);
    if (error) throw error;
}
