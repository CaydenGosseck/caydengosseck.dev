import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllProjects } from "@/lib/dal/projects";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function ProjectsPage() {
    const projects = await getAllProjects();

    const breadcrumb = (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/" className="font-pixel text-xs">home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage className="font-pixel text-xs">projects</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );

    if (projects.length === 0) {
        return (
            <div className="flex flex-col gap-6 py-6">
                {breadcrumb}
                <h1 className="sr-only">Projects</h1>
                <p className="font-sans text-base italic" style={{ color: "var(--muted-text)" }}>No projects yet.</p>
            </div>
        );
    }

    const random = projects[Math.floor(Math.random() * projects.length)];
    redirect(`/projects/${encodeURIComponent(random.name)}`);
}
