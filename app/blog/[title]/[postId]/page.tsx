import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostByIdFull, readPostContent } from "@/lib/dal/posts";

export async function generateMetadata({ params }: { params: Promise<{ title: string; postId: string }> }): Promise<Metadata> {
    const { title, postId } = await params;
    const id = Number(postId);
    if (isNaN(id)) return { title: "Post Not Found" };
    const post = await getPostByIdFull(id);
    if (!post) return { title: "Post Not Found" };
    const decoded = decodeURIComponent(title);
    const description = `\u201C${post.title}\u201D \u2014 a post in the ${decoded} blog by Cayden Gosseck.`;
    return {
        title: post.title,
        description,
        openGraph: {
            type: "article",
            title: post.title,
            description,
            url: `/blog/${title}/${postId}`,
            publishedTime: post.created_at,
            modifiedTime: post.updated_at,
            authors: ["https://caydengosseck.dev"],
        },
    };
}
import DateDisplay from "@/components/date-display";
import EmptyState from "@/components/empty-state";
import SubscribeModal from "@/components/subscribe-modal";
import MDXContent from "@/components/mdx-content";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function PostPage({ params }: { params: Promise<{ title: string; postId: string }> }) {
    const { title, postId } = await params;
    const decoded = decodeURIComponent(title);
    const id = Number(postId);

    if (isNaN(id)) notFound();

    const [post, content] = await Promise.all([
        getPostByIdFull(id),
        readPostContent(id),
    ]);

    if (!post) notFound();

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
                        <BreadcrumbLink asChild>
                            <Link href={`/blog/${encodeURIComponent(decoded)}`} className="font-sans text-sm">
                                {decoded}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-sans text-sm">{post.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div>
                <h1 className="font-serif text-2xl mb-1" style={{ color: "var(--primary)" }}>
                    {post.title}
                </h1>
                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                    <DateDisplay date={post.created_at} />
                </p>
            </div>

            {content
                ? <MDXContent source={content} />
                : <EmptyState title="This post is being written." description="Check back soon." />
            }

            <SubscribeModal blogTitle={post.blogTitle} />
        </div>
    );
}
