import { getAllBlogs } from "@/lib/dal/blogs";
import { getPostCount } from "@/lib/dal/posts";
import { getAllProjects } from "@/lib/dal/projects";
import type { BlogWithCount } from "@/types/components";
import AppSidebar from "@/components/app-sidebar";

export default async function AppSidebarServer() {
    const [blogs, projects] = await Promise.all([
        getAllBlogs(),
        getAllProjects(),
    ]);

    const blogsWithCount: BlogWithCount[] = await Promise.all(
        blogs.map(async (b) => ({ ...b, postCount: await getPostCount(b.title) }))
    );

    return <AppSidebar blogs={blogsWithCount} projects={projects} />;
}
