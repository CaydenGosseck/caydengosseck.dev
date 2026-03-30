import { redirect } from "next/navigation";
import { getAllBlogs } from "@/lib/dal/blogs";

export default async function BlogsPage() {
    const blogs = await getAllBlogs();

    if (blogs.length === 0) {
        return (
            <div className="py-6">
                <p className="font-sans text-base italic" style={{ color: "var(--muted-text)" }}>no blogs yet.</p>
            </div>
        );
    }

    const random = blogs[Math.floor(Math.random() * blogs.length)];
    redirect(`/blog/${encodeURIComponent(random.title)}`);
}
