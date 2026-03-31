import { supabase } from "@/lib/supabase";
import type { Project, GitHubRepo, ProjectRaw } from "@/types/api";

type ProjectRow = {
    name: string;
    description: string | null;
    url: string | null;
};

async function fetchGitHubRepo(repoUrl: string): Promise<GitHubRepo | null> {
    try {
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return null;
        const [, owner, repo] = match;
        const headers: HeadersInit = {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        };
        const [repoRes, langsRes, commitsRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers, next: { revalidate: 3600 } }),
            fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers, next: { revalidate: 3600 } }),
            fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers, next: { revalidate: 3600 } }),
        ]);
        if (!repoRes.ok) return null;
        const repoData = await repoRes.json();
        const langsData: Record<string, number> = langsRes.ok ? await langsRes.json() : {};
        const commitsData = commitsRes.ok ? await commitsRes.json() : [];

        const total = Object.values(langsData).reduce((a, b) => a + b, 0);
        const languages = new Map<string, string>(
            Object.entries(langsData).map(([name, bytes]) => [
                name,
                total > 0 ? ((bytes / total) * 100).toFixed(1) + "%" : "0%",
            ])
        );

        const base = {
            id: repoData.id,
            name: repoData.name,
            description: repoData.description ?? null,
            languages,
            created_at: repoData.created_at,
            updated_at: repoData.pushed_at,
        };

        if (repoData.private) {
            return { ...base, visibility: "private" as const };
        }

        return {
            ...base,
            visibility: "public" as const,
            most_recent_commit: commitsData[0]?.commit?.message?.split("\n")[0] ?? "",
            link: repoData.html_url,
            stars: repoData.stargazers_count,
        };
    } catch {
        return null;
    }
}

async function hydrateProject(row: ProjectRow): Promise<Project> {
    if (row.url) {
        const repo = await fetchGitHubRepo(row.url);
        if (repo) {
            return { name: row.name, description: row.description, url: row.url, repo };
        }
    }
    return { name: row.name, description: row.description, url: row.url, repo: null };
}

export async function getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from("projects")
        .select("name, description, url")
        .eq("deleted", false)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return Promise.all((data ?? []).map(hydrateProject));
}

export async function getAllProjectsRaw(): Promise<ProjectRaw[]> {
    const { data, error } = await supabase
        .from("projects")
        .select("name, description, url")
        .eq("deleted", false)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
}

export async function createProject(name: string, description?: string, url?: string): Promise<{ name: string }> {
    const { error } = await supabase
        .from("projects")
        .insert({ name, description: description ?? null, url: url ?? null });
    if (error) throw error;
    return { name };
}

export async function updateProject(name: string, fields: { description?: string; url?: string }): Promise<void> {
    const update: Record<string, unknown> = {};
    if (fields.description !== undefined) update.description = fields.description;
    if (fields.url !== undefined) update.url = fields.url;
    const { error } = await supabase
        .from("projects")
        .update(update)
        .eq("name", name)
        .eq("deleted", false);
    if (error) throw error;
}

export async function deleteProject(name: string): Promise<void> {
    const { error } = await supabase
        .from("projects")
        .update({ deleted: true })
        .eq("name", name);
    if (error) throw error;
}

export async function getProjectByName(name: string): Promise<Project | undefined> {
    const { data, error } = await supabase
        .from("projects")
        .select("name, description, url")
        .eq("name", name)
        .eq("deleted", false)
        .single();
    if (error) return undefined;
    return hydrateProject(data);
}
