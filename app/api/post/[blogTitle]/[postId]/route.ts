import { authenticate } from "@/lib/auth";
import { getPostById, getPostByIdFull, readPostContent, deletePost, updatePost } from "@/lib/dal/posts";

const MAX_CONTENT_BYTES = 1_000_000;

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;
    const id = Number(postId);

    if (!Number.isInteger(id) || id <= 0) {
        return Response.json({ error: "Invalid postId" }, { status: 400 });
    }

    const [post, content] = await Promise.all([getPostByIdFull(id), readPostContent(id)]);
    if (!post) {
        return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json({ ...post, content: content ?? null });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { postId } = await params;
    const id = Number(postId);

    if (!Number.isInteger(id) || id <= 0) {
        return Response.json({ error: "Invalid postId" }, { status: 400 });
    }

    let body: { title?: string; content?: string };
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { title, content } = body;
    if (title === undefined && content === undefined) {
        return Response.json({ error: "At least one of title or content is required" }, { status: 400 });
    }
    if (content !== undefined && Buffer.byteLength(content, "utf8") > MAX_CONTENT_BYTES) {
        return Response.json({ error: "Content too large (max 1MB)" }, { status: 413 });
    }

    const post = await getPostById(id);
    if (!post) {
        return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await updatePost(id, { title, content });
    return Response.json({ postId: id });
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { postId } = await params;
    const id = Number(postId);

    if (!Number.isInteger(id) || id <= 0) {
        return Response.json({ error: "Invalid postId" }, { status: 400 });
    }

    const post = await getPostById(id);
    if (!post) {
        return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await deletePost(id);
    return new Response(null, { status: 204 });
}
