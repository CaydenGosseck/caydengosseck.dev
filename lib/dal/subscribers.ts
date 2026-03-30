import { supabase } from "@/lib/supabase";
import type { Subscriber } from "@/types/api";

const CONFIRM_TOKEN_TTL_MS = 48 * 60 * 60 * 1000; // 48 hours

function mapRow(row: Record<string, unknown>): Subscriber {
    return {
        id: row.id as number,
        email: row.email as string,
        confirmed: row.confirmed as boolean,
        unsubscribeToken: row.unsubscribe_token as string,
        created_at: row.created_at as string,
    };
}

function confirmTokenExpiry(): string {
    return new Date(Date.now() + CONFIRM_TOKEN_TTL_MS).toISOString();
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const { data, error } = await supabase
        .from("subscribers")
        .select("id, email, confirmed, unsubscribe_token, created_at, deleted")
        .eq("email", email)
        .single();
    if (error) return undefined;
    if (data.deleted) return undefined;
    return mapRow(data);
}

export async function getSubscriberByEmailIncludeDeleted(
    email: string,
): Promise<(Subscriber & { deleted: boolean }) | undefined> {
    const { data, error } = await supabase
        .from("subscribers")
        .select("id, email, confirmed, unsubscribe_token, created_at, deleted")
        .eq("email", email)
        .single();
    if (error) return undefined;
    return { ...mapRow(data), deleted: data.deleted as boolean };
}

export async function getSubscriberByConfirmToken(token: string): Promise<Subscriber | undefined> {
    const { data, error } = await supabase
        .from("subscribers")
        .select("id, email, confirmed, unsubscribe_token, created_at")
        .eq("confirm_token", token)
        .eq("deleted", false)
        .gt("confirm_token_expires_at", new Date().toISOString())
        .single();
    if (error) return undefined;
    return mapRow(data);
}

export async function getSubscriberByUnsubscribeToken(token: string): Promise<Subscriber | undefined> {
    const { data, error } = await supabase
        .from("subscribers")
        .select("id, email, confirmed, unsubscribe_token, created_at")
        .eq("unsubscribe_token", token)
        .eq("deleted", false)
        .single();
    if (error) return undefined;
    return mapRow(data);
}

export async function createSubscriber(
    email: string,
    confirmToken: string,
    unsubscribeToken: string,
): Promise<Subscriber> {
    const { data, error } = await supabase
        .from("subscribers")
        .insert({
            email,
            confirm_token: confirmToken,
            confirm_token_expires_at: confirmTokenExpiry(),
            unsubscribe_token: unsubscribeToken,
        })
        .select("id, email, confirmed, unsubscribe_token, created_at")
        .single();
    if (error) throw error;
    return mapRow(data);
}

export async function reactivateSubscriber(
    id: number,
    confirmToken: string,
    unsubscribeToken: string,
): Promise<void> {
    const { error } = await supabase
        .from("subscribers")
        .update({
            deleted: false,
            deleted_at: null,
            confirmed: false,
            confirm_token: confirmToken,
            confirm_token_expires_at: confirmTokenExpiry(),
            unsubscribe_token: unsubscribeToken,
        })
        .eq("id", id);
    if (error) throw error;
}

export async function refreshConfirmToken(id: number, confirmToken: string): Promise<void> {
    const { error } = await supabase
        .from("subscribers")
        .update({ confirm_token: confirmToken, confirm_token_expires_at: confirmTokenExpiry() })
        .eq("id", id);
    if (error) throw error;
}

export async function confirmSubscriber(id: number): Promise<void> {
    // Null out the confirm token after use — it's a one-time secret
    const { error } = await supabase
        .from("subscribers")
        .update({ confirmed: true, confirm_token: null, confirm_token_expires_at: null })
        .eq("id", id);
    if (error) throw error;
}

export async function softDeleteSubscriber(id: number): Promise<void> {
    const { error } = await supabase
        .from("subscribers")
        .update({ deleted: true, deleted_at: new Date().toISOString() })
        .eq("id", id);
    if (error) throw error;
}

export async function createSubscription(subscriberId: number, blogTitle: string | null): Promise<void> {
    const { error } = await supabase
        .from("subscriptions")
        .insert({ subscriber_id: subscriberId, blog_title: blogTitle });
    if (error && error.code !== "23505") throw error;
}

export async function deleteSubscription(subscriberId: number, blogTitle: string | null): Promise<void> {
    let query = supabase
        .from("subscriptions")
        .delete()
        .eq("subscriber_id", subscriberId);
    query = blogTitle === null
        ? query.is("blog_title", null)
        : query.eq("blog_title", blogTitle);
    const { error } = await query;
    if (error) throw error;
}

export async function deleteAllSubscriptions(subscriberId: number): Promise<void> {
    const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("subscriber_id", subscriberId);
    if (error) throw error;
}

export async function getSubscribersForBlog(blogTitle: string): Promise<Subscriber[]> {
    // Use two separate queries instead of .or() with string interpolation to avoid injection
    const [{ data: generalData, error: e1 }, { data: blogData, error: e2 }] = await Promise.all([
        supabase
            .from("subscriptions")
            .select("subscriber_id, subscribers!inner(id, email, confirmed, deleted, unsubscribe_token, created_at)")
            .is("blog_title", null),
        supabase
            .from("subscriptions")
            .select("subscriber_id, subscribers!inner(id, email, confirmed, deleted, unsubscribe_token, created_at)")
            .eq("blog_title", blogTitle),
    ]);
    if (e1) throw e1;
    if (e2) throw e2;

    const seen = new Set<number>();
    const result: Subscriber[] = [];
    for (const row of [...(generalData ?? []), ...(blogData ?? [])]) {
        const sub = row.subscribers as Record<string, unknown>;
        const sub = row.subscribers as unknown as Record<string, unknown>;
        if (!sub.confirmed || sub.deleted) continue;
        const id = sub.id as number;
        if (seen.has(id)) continue;
        seen.add(id);
        result.push(mapRow(sub));
    }
    return result;
}

export async function purgeDeletedSubscribers(): Promise<number> {
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
        .from("subscribers")
        .delete()
        .eq("deleted", true)
        .lt("deleted_at", cutoff)
        .select("id");
    if (error) throw error;
    return data?.length ?? 0;
}

export async function getSubscriberCount(): Promise<number> {
    const { count, error } = await supabase
        .from("subscribers")
        .select("id", { count: "exact", head: true })
        .eq("confirmed", true)
        .eq("deleted", false);
    if (error) throw error;
    return count ?? 0;
}
