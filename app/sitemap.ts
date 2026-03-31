import type { MetadataRoute } from "next";
import { getAllBlogs } from "@/lib/dal/blogs";
import { getPostsByBlog } from "@/lib/dal/posts";
import { getAllProjectsRaw } from "@/lib/dal/projects";

const BASE = "https://caydengosseck.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [blogs, projects] = await Promise.all([
        getAllBlogs(),
        getAllProjectsRaw(),
    ]);

    const postEntries = (
        await Promise.all(
            blogs.map(async (blog) => {
                const posts = await getPostsByBlog(blog.title);
                return posts.map((post) => ({
                    url: `${BASE}/blog/${encodeURIComponent(blog.title)}/${post.postId}`,
                    lastModified: new Date(post.updated_at),
                }));
            })
        )
    ).flat();

    const blogEntries = blogs.map((blog) => ({
        url: `${BASE}/blog/${encodeURIComponent(blog.title)}`,
        lastModified: new Date(blog.updated_at),
    }));

    const projectEntries = projects.map((project) => ({
        url: `${BASE}/projects/${encodeURIComponent(project.name)}`,
    }));

    return [
        { url: BASE, lastModified: new Date() },
        { url: `${BASE}/blogs`, lastModified: new Date() },
        { url: `${BASE}/projects`, lastModified: new Date() },
        ...blogEntries,
        ...postEntries,
        ...projectEntries,
    ];
}
