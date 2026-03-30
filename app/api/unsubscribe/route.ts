import { redirect } from "next/navigation";
import {
    getSubscriberByUnsubscribeToken,
    deleteSubscription,
    deleteAllSubscriptions,
    softDeleteSubscriber,
} from "@/lib/dal/subscribers";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const blog = searchParams.get("blog");

    if (!token) {
        return Response.json({ error: "Missing token." }, { status: 400 });
    }

    const subscriber = await getSubscriberByUnsubscribeToken(token);
    if (!subscriber) {
        return Response.json({ error: "Invalid token." }, { status: 400 });
    }

    if (blog) {
        await deleteSubscription(subscriber.id, blog);
        redirect(`/unsubscribe?success=true&blog=${encodeURIComponent(blog)}`);
    } else {
        await deleteAllSubscriptions(subscriber.id);
        await softDeleteSubscriber(subscriber.id);
        redirect("/unsubscribe?success=true");
    }
}
