import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogByTitle } from "@/lib/dal/blogs";
import { getPostsByBlog } from "@/lib/dal/posts";
import DateDisplay from "@/components/date-display";
import SubscribeForm from "@/components/subscribe-form";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function BlogPage({ params }: { params: Promise<{ title: string }> }) {
    const { title } = await params;
    const decoded = decodeURIComponent(title);

    const [blog, posts] = await Promise.all([
        getBlogByTitle(decoded),
        getPostsByBlog(decoded),
    ]);

    if (!blog) notFound();

    return (
        <div className="flex flex-col gap-6 py-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className="font-sans text-sm">home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-sans text-sm">{blog.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div>
                <h1 className="font-sans text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
                    {blog.title}
                </h1>
                <p className="font-sans text-base" style={{ color: "var(--muted-text)" }}>
                    Created <DateDisplay date={blog.created_at} />
                </p>
            </div>

            {posts.length === 0 ? (
                <p className="font-sans text-base italic" style={{ color: "var(--muted-text)" }}>no posts yet.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {posts.map((post) => (
                        <div key={post.postId}>
                            <Link
                                href={`/blog/${encodeURIComponent(blog.title)}/${post.postId}`}
                                className="font-sans text-base no-underline hover:underline"
                                style={{ color: "var(--foreground)" }}
                            >
                                {post.title}
                            </Link>
                            <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                                <DateDisplay date={post.created_at} />
                            </p>
                        </div>
                    ))}
                </div>
            )}
            <SubscribeForm blogTitle={blog.title} />
        </div>
    );
}
