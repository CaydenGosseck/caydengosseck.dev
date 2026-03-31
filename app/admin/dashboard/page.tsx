import { authenticate } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllBlogs } from "@/lib/dal/blogs";
import { getAllProjectsRaw } from "@/lib/dal/projects";
import AdminDashboard from "./admin-dashboard";

export default async function AdminDashboardPage() {
    const isAuth = await authenticate();
    if (!isAuth) redirect("/admin");

    const [blogs, projects] = await Promise.all([
        getAllBlogs(),
        getAllProjectsRaw(),
    ]);

    return <AdminDashboard initialBlogs={blogs} initialProjects={projects} />;
}
