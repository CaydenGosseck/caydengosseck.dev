import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function authenticate(): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user !== null;
}
