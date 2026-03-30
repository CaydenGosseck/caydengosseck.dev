import { readFileSync } from "fs";
import path from "path";

export type FeaturedRepo = {
    name: string;
    description: string | null;
    stars: number;
    url: string;
    recentCommit: string;
    languages: { name: string; percent: string }[];
} | null;

export const DEVICON_MAP: Record<string, string> = {
    TypeScript: "typescript", JavaScript: "javascript", Python: "python",
    Go: "go", Rust: "rust", CSS: "css3", HTML: "html5", Shell: "bash",
    "C++": "cplusplus", C: "c", Java: "java", Ruby: "ruby",
};

export function deviconUrl(lang: string) {
    const name = DEVICON_MAP[lang] ?? lang.toLowerCase().replace(/[^a-z0-9]/g, "");
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`;
}

export async function getRepoReadme(repoUrl: string): Promise<string | null> {
    try {
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return null;
        const [, owner, repo] = match;
        const headers: HeadersInit = {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        };
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers, next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const data = await res.json();
        return Buffer.from(data.content, "base64").toString("utf-8");
    } catch { return null; }
}

export async function getFeaturedRepo(): Promise<FeaturedRepo> {
    try {
        const configPath = path.join(process.cwd(), "config", "featured.json");
        const { repoUrl } = JSON.parse(readFileSync(configPath, "utf-8"));
        const match = (repoUrl as string).match(/github\.com\/([^/]+)\/([^/]+)/);
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
        const languages = Object.entries(langsData).map(([name, bytes]) => ({
            name, percent: total > 0 ? ((bytes / total) * 100).toFixed(1) + "%" : "0%",
        }));
        return {
            name: repoData.name,
            description: repoData.description ?? null,
            stars: repoData.stargazers_count,
            url: repoData.html_url,
            recentCommit: commitsData[0]?.commit?.message?.split("\n")[0] ?? "",
            languages,
        };
    } catch { return null; }
}
