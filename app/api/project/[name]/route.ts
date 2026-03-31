import { authenticate } from "@/lib/auth";
import { getProjectByName, updateProject, deleteProject } from "@/lib/dal/projects";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ name: string }> }
) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { name } = await params;
    const decoded = decodeURIComponent(name);

    let body: { description?: string; url?: string };
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { description, url } = body;
    if (description === undefined && url === undefined) {
        return Response.json({ error: "At least one of description or url is required" }, { status: 400 });
    }

    const project = await getProjectByName(decoded);
    if (!project) {
        return Response.json({ error: "Project not found" }, { status: 404 });
    }

    await updateProject(decoded, { description, url });
    return Response.json({ name: decoded });
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ name: string }> }
) {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { name } = await params;
    const decoded = decodeURIComponent(name);

    const project = await getProjectByName(decoded);
    if (!project) {
        return Response.json({ error: "Project not found" }, { status: 404 });
    }

    await deleteProject(decoded);
    return new Response(null, { status: 204 });
}
