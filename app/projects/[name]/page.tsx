import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectByName } from "@/lib/dal/projects";

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
    const { name } = await params;
    const decoded = decodeURIComponent(name);
    const project = await getProjectByName(decoded);
    if (!project) return { title: "Project Not Found" };
    const description = project.description
        ? `${project.name} — ${project.description}`
        : `${project.name} — a project by Cayden Gosseck.`;
    return {
        title: project.name,
        description,
        openGraph: {
            title: project.name,
            description,
            url: `/projects/${name}`,
        },
    };
}
import { getRepoReadme } from "@/lib/github";
import { DEVICON_MAP, deviconUrl } from "@/lib/github";
import ReadmeDisplay from "@/components/readme-display";
import { Card } from "@/components/retroui/Card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function ProjectPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const decoded = decodeURIComponent(name);

    const project = await getProjectByName(decoded);
    if (!project) notFound();

    // Private repos are not shown on the projects page
    if (project.repo?.visibility === "private") notFound();

    const readme = project.url ? await getRepoReadme(project.url) : null;

    const repo = project.repo?.visibility === "public" ? project.repo : null;
    const languages = repo?.languages
        ? Array.from(repo.languages.entries()).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
        : [];

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

            <div className="flex flex-col gap-6 md:grid md:grid-cols-[500px_1fr] md:items-start">
                {/* Left column — metadata */}
                <Card>
                    <Card.Content>
                        <div className="flex flex-col gap-5">
                            {/* Name */}
                            <div className="flex flex-col gap-1">
                                <h1 className="font-serif text-xl" style={{ color: "var(--primary)" }}>
                                    {project.name}
                                </h1>
                                {project.description && (
                                    <p className="font-sans text-sm italic" style={{ color: "var(--muted-text)" }}>
                                        {project.description}
                                    </p>
                                )}
                                {repo?.description && repo.description !== project.description && (
                                    <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                                        {repo.description}
                                    </p>
                                )}
                            </div>

                            {/* Stats */}
                            {repo && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-pixel text-[9px] uppercase tracking-widest w-16 shrink-0" style={{ color: "var(--muted-text)" }}>stars</span>
                                        <span className="font-sans text-sm" style={{ color: "var(--foreground)" }}>{repo.stars === 0 ? "---" : repo.stars}</span>
                                    </div>
                                    {repo.most_recent_commit && (
                                        <div className="flex items-start gap-2">
                                            <span className="font-pixel text-[9px] uppercase tracking-widest w-16 shrink-0 pt-0.5" style={{ color: "var(--muted-text)" }}>commit</span>
                                            <span className="font-sans italic text-sm leading-snug" style={{ color: "var(--foreground)" }}>{repo.most_recent_commit}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Languages */}
                            {languages.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <p className="font-pixel text-[9px] uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>languages</p>
                                    <div className="flex flex-col gap-1.5">
                                        {languages.map(([lang, percent]) => (
                                            <div key={lang} className="flex items-center gap-2">
                                                {DEVICON_MAP[lang] && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={deviconUrl(lang)}
                                                        alt={lang}
                                                        width={14}
                                                        height={14}
                                                        loading="lazy"
                                                        className="shrink-0"
                                                        style={{ filter: "brightness(0) invert(0.7)" }}
                                                    />
                                                )}
                                                <span className="font-sans text-sm" style={{ color: "var(--foreground)" }}>{lang}</span>
                                                <span className="font-sans text-xs ml-auto" style={{ color: "var(--muted-text)" }}>{percent}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* GitHub link */}
                            {repo?.link && (
                                <a
                                    href={repo.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-pixel text-[10px] uppercase tracking-widest px-3 py-2 w-fit transition-colors duration-150 motion-reduce:transition-none hover:bg-[var(--muted-bg)]"
                                    style={{ border: "1px solid var(--border-color)", color: "var(--foreground)" }}
                                >
                                    view on github
                                </a>
                            )}
                        </div>
                    </Card.Content>
                </Card>

                {/* Right column — README */}
                {readme ? (
                    <Card>
                        <Card.Header>
                            <Card.Title>readme</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <ReadmeDisplay content={readme} />
                        </Card.Content>
                    </Card>
                ) : (
                    <Card>
                        <Card.Content>
                            <p className="font-sans text-sm italic" style={{ color: "var(--muted-text)" }}>No README available.</p>
                        </Card.Content>
                    </Card>
                )}
            </div>
        </div>
    );
}
