import { authenticate } from "@/lib/auth";
import { getVerifiedComments, getAllComments, createComment } from "@/lib/dal/comments";

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_PAGE_SIZE = 10;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(searchParams.get("pageSize") ?? "10") || 10));

    const isAdmin = await authenticate();
    const result = isAdmin ? await getAllComments(page, pageSize) : await getVerifiedComments(page, pageSize);
    return Response.json(result);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { name, message } = body;

    if (!name || !message) {
        return Response.json({ error: "Name and message are required." }, { status: 400 });
    }
    if (typeof name !== "string" || typeof message !== "string") {
        return Response.json({ error: "Invalid input." }, { status: 400 });
    }
    if (name.length > MAX_NAME_LENGTH) {
        return Response.json({ error: `Name must be under ${MAX_NAME_LENGTH} characters.` }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
        return Response.json({ error: `Message must be under ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 });
    }

    const comment = await createComment(name.trim(), message.trim());
    return Response.json(comment, { status: 201 });
}
