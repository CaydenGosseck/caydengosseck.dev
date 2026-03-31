"use client";

import { useState } from "react";
import { Card } from "@/components/retroui/Card";
import type { ProjectRaw } from "@/types/api";

type Props = {
    initialProjects: ProjectRaw[];
};

type EditState = {
    name: string;
    description: string;
    url: string;
    saving: boolean;
    error: string;
};

export default function ProjectsPanel({ initialProjects }: Props) {
    const [projects, setProjects] = useState<ProjectRaw[]>(initialProjects);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");
    const [editState, setEditState] = useState<EditState | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const inputClass = "w-full px-3 py-2 font-sans text-sm border-0 border-b outline-none transition-colors duration-150";
    const inputStyle = { background: "var(--background)", borderColor: "var(--muted-text)", color: "var(--foreground)" };

    async function refreshProjects() {
        const res = await fetch("/api/project");
        if (res.ok) setProjects(await res.json());
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        setCreateError("");
        const res = await fetch("/api/project", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newName.trim(),
                description: newDescription.trim() || undefined,
                url: newUrl.trim() || undefined,
            }),
        });
        if (!res.ok) {
            const data = await res.json();
            setCreateError(data.error ?? "Failed to create project");
            setCreating(false);
            return;
        }
        setNewName("");
        setNewDescription("");
        setNewUrl("");
        setShowCreate(false);
        setCreating(false);
        await refreshProjects();
    }

    async function handleEditSave() {
        if (!editState) return;
        setEditState({ ...editState, saving: true, error: "" });
        const res = await fetch(`/api/project/${encodeURIComponent(editState.name)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: editState.description || undefined,
                url: editState.url || undefined,
            }),
        });
        if (!res.ok) {
            const data = await res.json();
            setEditState({ ...editState, saving: false, error: data.error ?? "Failed to save" });
            return;
        }
        setEditState(null);
        await refreshProjects();
    }

    async function handleDelete(name: string) {
        const res = await fetch(`/api/project/${encodeURIComponent(name)}`, { method: "DELETE" });
        if (res.ok) {
            setConfirmDelete(null);
            await refreshProjects();
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <span className="font-pixel text-[10px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
                    {projects.length} project{projects.length !== 1 ? "s" : ""}
                </span>
                <button
                    onClick={() => { setShowCreate(!showCreate); setCreateError(""); }}
                    className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                    style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                >
                    {showCreate ? "cancel" : "new project"}
                </button>
            </div>

            {showCreate && (
                <Card>
                    <Card.Content>
                        <form onSubmit={handleCreate} className="flex flex-col gap-3">
                            <input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Name…"
                                required
                                className={inputClass}
                                style={inputStyle}
                            />
                            <input
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Description (optional)…"
                                className={inputClass}
                                style={inputStyle}
                            />
                            <input
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="GitHub URL (optional)…"
                                type="url"
                                className={inputClass}
                                style={inputStyle}
                            />
                            {createError && (
                                <p className="font-sans text-sm" style={{ color: "var(--accent)" }}>{createError}</p>
                            )}
                            <button
                                type="submit"
                                disabled={creating}
                                className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 w-fit transition-colors duration-150 hover:bg-[var(--muted-bg)] disabled:opacity-50"
                                style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                            >
                                {creating ? "creating…" : "create"}
                            </button>
                        </form>
                    </Card.Content>
                </Card>
            )}

            {projects.length === 0 && (
                <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>No projects yet.</p>
            )}

            {projects.map((project) => (
                <Card key={project.name}>
                    <Card.Content>
                        {editState?.name === project.name ? (
                            <div className="flex flex-col gap-3">
                                <p className="font-sans text-base font-medium" style={{ color: "var(--foreground)" }}>{project.name}</p>
                                <input
                                    value={editState.description}
                                    onChange={(e) => setEditState({ ...editState, description: e.target.value })}
                                    placeholder="Description…"
                                    className={inputClass}
                                    style={inputStyle}
                                />
                                <input
                                    value={editState.url}
                                    onChange={(e) => setEditState({ ...editState, url: e.target.value })}
                                    placeholder="GitHub URL…"
                                    type="url"
                                    className={inputClass}
                                    style={inputStyle}
                                />
                                {editState.error && (
                                    <p className="font-sans text-sm" style={{ color: "var(--accent)" }}>{editState.error}</p>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleEditSave}
                                        disabled={editState.saving}
                                        className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)] disabled:opacity-50"
                                        style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                                    >
                                        {editState.saving ? "saving…" : "save"}
                                    </button>
                                    <button
                                        onClick={() => setEditState(null)}
                                        className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                                        style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                                    >
                                        cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>{project.name}</p>
                                    {project.description && (
                                        <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>{project.description}</p>
                                    )}
                                    {project.url && (
                                        <p className="font-sans text-xs" style={{ color: "var(--muted-text)" }}>{project.url}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setEditState({ name: project.name, description: project.description ?? "", url: project.url ?? "", saving: false, error: "" })}
                                        className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                                        style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                                    >
                                        edit
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(confirmDelete === project.name ? null : project.name)}
                                        className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                                        style={{
                                            border: "1px solid var(--border-color)",
                                            background: confirmDelete === project.name ? "var(--accent)" : "transparent",
                                            color: "var(--foreground)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {confirmDelete === project.name ? "confirm?" : "delete"}
                                    </button>
                                </div>
                            </div>
                        )}
                        {confirmDelete === project.name && editState?.name !== project.name && (
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleDelete(project.name)}
                                    className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150"
                                    style={{ border: "1px solid var(--border-color)", background: "var(--accent)", color: "var(--foreground)", cursor: "pointer" }}
                                >
                                    yes, delete
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="font-pixel text-[10px] uppercase tracking-widest px-2 py-1 transition-colors duration-150 hover:bg-[var(--muted-bg)]"
                                    style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}
                                >
                                    cancel
                                </button>
                            </div>
                        )}
                    </Card.Content>
                </Card>
            ))}
        </div>
    );
}
