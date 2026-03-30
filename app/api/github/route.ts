import { authenticate } from "@/lib/auth";
import { GitHubRepo, GithubRawRepo } from "@/types/api";

const GITHUB_API = "https://api.github.com";

function authHeaders(): HeadersInit {
    return {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
    };
}

async function getLanguagePercents(owner: string, repo: string): Promise<Map<string, string>> {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, {
        headers: authHeaders(),
    });
    if (!res.ok) return new Map();

    const raw: Record<string, number> = await res.json();
    const total = Object.values(raw).reduce((sum, n) => sum + n, 0);
    const map = new Map<string, string>();
    for (const [lang, bytes] of Object.entries(raw)) {
        map.set(lang, total > 0 ? ((bytes / total) * 100).toFixed(1) + "%" : "0%");
    }
    return map;
}

async function getMostRecentCommitMessage(owner: string, repo: string): Promise<string> {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=1`, {
        headers: authHeaders(),
    });
    if (!res.ok) return "";
    const commits = await res.json();
    return commits[0]?.commit?.message?.split("\n")[0] ?? "";
}

export async function GET() {
    if (!await authenticate()) {
        return new Response("Unauthorized", { status: 401 });
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }

    const reposRes = await fetch(`${GITHUB_API}/user/repos?per_page=100&sort=pushed`, {
        headers: authHeaders(),
    });

    if (!reposRes.ok) {
        return Response.json({ error: "Failed to fetch repos" }, { status: reposRes.status });
    }

    const raw: GithubRawRepo[] = await reposRes.json();
    const owner = raw[0]?.owner?.login ?? "";

    const repos: GitHubRepo[] = await Promise.all(
        raw.map(async (repo): Promise<GitHubRepo> => {
            if (repo.private) {
                return { visibility: "private" } as GitHubRepo;
            }

            const [languages, most_recent_commit] = await Promise.all([
                getLanguagePercents(owner, repo.name),
                getMostRecentCommitMessage(owner, repo.name),
            ]);

            return {
                id: repo.id,
                name: repo.name,
                description: null,
                stars: repo.stargazers_count,
                languages,
                created_at: repo.created_at,
                updated_at: repo.pushed_at,
                most_recent_commit,
                link: repo.html_url,
                visibility: "public",
            };
        })
    );

    return Response.json(repos);
}
