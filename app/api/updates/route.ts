import { authenticate } from "@/lib/auth";
import { getAllUpdates, createUpdate, deleteUpdate } from "@/lib/dal/updates";

export async function GET() {
    const updates = await getAllUpdates();
    return Response.json(updates);
}

export async function POST(request: Request) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { text, date } = await request.json();
    if (!text || typeof text !== "string" || !text.trim()) {
        return Response.json({ error: "Text is required." }, { status: 400 });
    }
    if (!date || typeof date !== "string") {
        return Response.json({ error: "Date is required." }, { status: 400 });
    }

    const update = await createUpdate(text.trim(), date);
    return Response.json(update, { status: 201 });
}

export async function DELETE(request: Request) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await request.json();
    if (typeof id !== "number" || id < 0) {
        return Response.json({ error: "Invalid id." }, { status: 400 });
    }

    await deleteUpdate(id);
    return Response.json({ success: true });
}
