import { authenticate } from "@/lib/auth";
import { getBlogByTitle, deleteBlog } from "@/lib/dal/blogs";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ blogTitle: string }> }
) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { blogTitle } = await params;
    const title = decodeURIComponent(blogTitle);

    const blog = await getBlogByTitle(title);
    if (!blog) {
        return Response.json({ error: "Blog not found" }, { status: 404 });
    }

    await deleteBlog(title);
    return new Response(null, { status: 204 });
}
