import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Seed mini blog
await supabase.from("mini_blogs").insert({
    title: "just figured out you can pipe curl output directly into jq. life changing.",
});

// Seed blog + post
await supabase.from("blogs").upsert({ blog_title: "dev notes" }, { onConflict: "blog_title" });
await supabase.from("posts").insert({
    blog_title: "dev notes",
    post_title: "getting started with sqlite in next.js",
});

console.log("seeded.");
