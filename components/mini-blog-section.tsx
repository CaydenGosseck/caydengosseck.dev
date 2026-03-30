import { getRecentMiniBlog } from "@/lib/dal/mini-blogs";
import MiniBlogWidget from "./mini-blog-widget";

export default async function MiniBlogSection() {
    const miniBlog = await getRecentMiniBlog();
    return <MiniBlogWidget initial={miniBlog ?? null} />;
}
