import { authenticate } from "@/lib/auth";
import { deleteComment } from "@/lib/dal/comments";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const commentId = Number(id);
    if (Number.isNaN(commentId)) {
        return Response.json({ error: "Invalid comment ID." }, { status: 400 });
    }

    await deleteComment(commentId);
    return Response.json({ success: true });
}
