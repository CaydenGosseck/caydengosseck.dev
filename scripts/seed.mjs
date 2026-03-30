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

// Seed comments (verified and unverified)
await supabase.from("comments").insert([
    { name: "alex", message: "really enjoying the retro aesthetic here. the starfield is a nice touch.", verified: true },
    { name: "morgan", message: "the /stats page is a cool idea, haven't seen that on many personal sites.", verified: true },
    { name: "jordan", message: "what's your stack for the blog? curious if you're using mdx or something else.", verified: true },
    { name: "sam", message: "found a typo on the projects page but can't remember which one. great site though!", verified: true },
    { name: "riley", message: "nova slim is such a good font choice for the headings.", verified: true },
    { name: "charlie", message: "do you plan on writing about the tech behind this site?", verified: false },
    { name: "taylor", message: "love the neobrutalist card style.", verified: false },
]);

console.log("seeded.");
