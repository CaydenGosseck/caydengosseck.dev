import { authenticate } from "@/lib/auth";
import { getAllProjectsRaw, createProject } from "@/lib/dal/projects";

export async function GET() {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }
    const projects = await getAllProjectsRaw();
    return Response.json(projects);
}

export async function POST(request: Request) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    let body: { name?: string; description?: string; url?: string };
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { name, description, url } = body;
    if (!name || typeof name !== "string" || name.trim() === "") {
        return Response.json({ error: "name is required" }, { status: 400 });
    }

    try {
        const project = await createProject(name.trim(), description, url);
        return Response.json(project, { status: 201 });
    } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "code" in err && (err as { code: string }).code === "23505") {
            return Response.json({ error: "A project with that name already exists" }, { status: 409 });
        }
        throw err;
    }
}
