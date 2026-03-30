import { authenticate } from "@/lib/auth";
import { getPostById, deletePost } from "@/lib/dal/posts";

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
