import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectByName } from "@/lib/dal/projects";
import { getRepoReadme } from "@/lib/github";
import InlineLink from "@/components/inline-link";
import ReadmeDisplay from "@/components/readme-display";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

async function getStarHistorySvg(repoUrl: string): Promise<string | null> {
    try {
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return null;
        const [, owner, repo] = match;
        const res = await fetch(
            `https://api.star-history.com/svg?repos=${owner}/${repo}&type=Date`,
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) return null;
        const contentLength = res.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 200_000) return null;
        const svg = await res.text();
        if (svg.length > 200_000 || !svg.includes("<svg")) return null;
        return svg;
    } catch {
        return null;
    }
}

export default async function ProjectPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const decoded = decodeURIComponent(name);

    const project = await getProjectByName(decoded);
    if (!project) notFound();

    const isPublic = project.repo?.visibility === "public";

    const [readme, starHistorySvg] = await Promise.all([
        project.url ? getRepoReadme(project.url) : null,
        isPublic && project.url ? getStarHistorySvg(project.url) : null,
    ]);

    return (
        <div className="flex flex-col gap-6 py-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/" className="font-sans text-sm">home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-sans text-sm">{project.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col gap-2">
                {project.url ? (
                    <h1 className="font-sans text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                        <InlineLink href={project.url} external>{project.name}</InlineLink>
                    </h1>
                ) : (
                    <h1 className="font-sans text-2xl font-bold" style={{ color: "var(--foreground)" }}>{project.name}</h1>
                )}
                {project.description && (
                    <p className="font-sans text-base italic" style={{ color: "var(--muted-text)" }}>{project.description}</p>
                )}
                {project.repo?.description && (
                    <p className="font-sans text-base" style={{ color: "var(--muted-text)" }}>{project.repo.description}</p>
                )}
            </div>

            {starHistorySvg && (
                <div className="flex flex-col gap-3">
                    <p className="font-pixel text-xs uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>Star History</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`data:image/svg+xml;base64,${Buffer.from(starHistorySvg).toString("base64")}`}
                        alt="Star history chart"
                        className="w-full"
                        loading="lazy"
                    />
                </div>
            )}

            {readme && (
                <div className="flex flex-col gap-3">
                    <p className="font-pixel text-xs uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>README.md</p>
                    <ReadmeDisplay content={readme} />
                </div>
            )}
        </div>
    );
}
