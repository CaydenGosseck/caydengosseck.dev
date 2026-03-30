import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostByIdFull } from "@/lib/dal/posts";
import DateDisplay from "@/components/date-display";
import EmptyState from "@/components/empty-state";
import SubscribeForm from "@/components/subscribe-form";
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

    const post = await getPostByIdFull(id);

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
                <h1 className="font-sans text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
                    {post.title}
                </h1>
                <p className="font-sans text-base" style={{ color: "var(--muted-text)" }}>
                    <DateDisplay date={post.created_at} />
                </p>
            </div>

            <EmptyState
                title="This post is being written."
                description="Check back soon."
            />

            <SubscribeForm blogTitle={post.blogTitle} />
        </div>
    );
}
