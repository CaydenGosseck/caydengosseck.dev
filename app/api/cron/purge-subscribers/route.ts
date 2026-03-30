import { purgeDeletedSubscribers } from "@/lib/dal/subscribers";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    const purged = await purgeDeletedSubscribers();
    console.log(`Purged ${purged} soft-deleted subscriber(s).`);
    return Response.json({ purged });
}
