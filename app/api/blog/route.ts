import { authenticate } from "@/lib/auth";
import { getAllBlogs, createBlog } from "@/lib/dal/blogs";

export async function GET() {
    const blogs = await getAllBlogs();
    return Response.json(blogs);
}

export async function POST(request: Request) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { title } = await request.json();
    if (!title) {
        return Response.json({ error: "title is required" }, { status: 400 });
    }

    try {
        const blog = await createBlog(title);
        return Response.json(blog, { status: 201 });
    } catch (err: unknown) {
        if (err instanceof Error && err.message.includes("duplicate key")) {
            return Response.json({ error: "Blog already exists" }, { status: 409 });
        }
        throw err;
    }
}
