import { authenticate } from "@/lib/auth";
import { verifyComment } from "@/lib/dal/comments";

export async function PATCH(
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

    await verifyComment(commentId);
    return Response.json({ success: true });
}
