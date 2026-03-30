import { authenticate } from "@/lib/auth";
import { getPostsByBlog, createPost } from "@/lib/dal/posts";
import { getBlogByTitle } from "@/lib/dal/blogs";

const MAX_CONTENT_BYTES = 1_000_000; // 1MB

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ blogTitle: string }> }
) {
    const { blogTitle } = await params;
    const title = decodeURIComponent(blogTitle);
    const posts = await getPostsByBlog(title);
    return Response.json(posts);
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ blogTitle: string }> }
) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { blogTitle } = await params;
    const blogTitleDecoded = decodeURIComponent(blogTitle);

    const { title, content } = await request.json();
    if (!title) {
        return Response.json({ error: "title is required" }, { status: 400 });
    }
    if (content && Buffer.byteLength(content, "utf-8") > MAX_CONTENT_BYTES) {
        return Response.json({ error: "Content too large. Max 1MB." }, { status: 413 });
    }

    const blog = await getBlogByTitle(blogTitleDecoded);
    if (!blog) {
        return Response.json({ error: "Blog not found" }, { status: 404 });
    }

    const post = await createPost(blogTitleDecoded, title, content);
    return Response.json(post, { status: 201 });
}
