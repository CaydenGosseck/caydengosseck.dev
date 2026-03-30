import { authenticate } from "@/lib/auth";
import { getAllMiniBlogs, getRandomMiniBlog, createMiniBlog } from "@/lib/dal/mini-blogs";

const MAX_CONTENT_BYTES = 1_000_000; // 1MB

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    if (searchParams.get("random") === "true") {
        const miniBlog = await getRandomMiniBlog();
        if (!miniBlog) {
            return Response.json({ error: "No miniblogs found" }, { status: 404 });
        }
        return Response.json(miniBlog);
    }

    const miniBlogs = await getAllMiniBlogs();
    return Response.json(miniBlogs);
}

export async function POST(request: Request) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { title, content } = await request.json();
    if (!title) {
        return Response.json({ error: "title is required" }, { status: 400 });
    }
    if (content && Buffer.byteLength(content, "utf-8") > MAX_CONTENT_BYTES) {
        return Response.json({ error: "Content too large. Max 1MB." }, { status: 413 });
    }

    const miniBlog = await createMiniBlog(title, content);
    return Response.json(miniBlog, { status: 201 });
}
