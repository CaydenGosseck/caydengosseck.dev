import { redirect } from "next/navigation";
import { getSubscriberByConfirmToken, confirmSubscriber } from "@/lib/dal/subscribers";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
        return Response.json({ error: "Missing token." }, { status: 400 });
    }

    const subscriber = await getSubscriberByConfirmToken(token);
    if (!subscriber) {
        return Response.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    await confirmSubscriber(subscriber.id);
    redirect("/?subscribed=true");
}
