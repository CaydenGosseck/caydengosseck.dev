import { redirect } from "next/navigation";
import { getAllBlogs } from "@/lib/dal/blogs";

export default async function BlogsPage() {
    const blogs = await getAllBlogs();

    if (blogs.length === 0) {
        return (
            <div className="py-6">
                <h1 className="sr-only">Blogs</h1>
                <p className="font-sans text-base italic" style={{ color: "var(--muted-text)" }}>No blogs yet.</p>
            </div>
        );
    }

    const random = blogs[Math.floor(Math.random() * blogs.length)];
    redirect(`/blog/${encodeURIComponent(random.title)}`);
}
