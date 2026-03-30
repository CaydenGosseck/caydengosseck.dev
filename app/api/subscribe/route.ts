import { getBlogByTitle } from "@/lib/dal/blogs";
import {
    getSubscriberByEmailIncludeDeleted,
    createSubscriber,
    reactivateSubscriber,
    refreshConfirmToken,
    createSubscription,
    deleteAllSubscriptions,
} from "@/lib/dal/subscribers";
import { generateToken } from "@/lib/tokens";
import { sendConfirmationEmail } from "@/lib/newsletter";

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Generic message returned for all new/unconfirmed paths to prevent email enumeration
const CONFIRM_MESSAGE = "If that address is new or unconfirmed, you'll receive a confirmation email shortly.";

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { email, blogTitle } = body as Record<string, unknown>;

    if (!email || typeof email !== "string") {
        return Response.json({ error: "Email is required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
        return Response.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (blogTitle !== undefined && (typeof blogTitle !== "string" || !blogTitle.trim())) {
        return Response.json({ error: "Invalid blog." }, { status: 400 });
    }

    if (blogTitle) {
        const blog = await getBlogByTitle(blogTitle as string);
        if (!blog) {
            return Response.json({ error: "Blog not found." }, { status: 400 });
        }
    }

    const existing = await getSubscriberByEmailIncludeDeleted(email);

    if (existing) {
        if (existing.deleted) {
            const confirmToken = generateToken();
            const unsubscribeToken = generateToken();
            await reactivateSubscriber(existing.id, confirmToken, unsubscribeToken);
            await deleteAllSubscriptions(existing.id);
            await createSubscription(existing.id, (blogTitle as string) ?? null);
            await sendConfirmationEmail(email, confirmToken);
            return Response.json({ success: true, message: CONFIRM_MESSAGE });
        } else if (!existing.confirmed) {
            const confirmToken = generateToken();
            await refreshConfirmToken(existing.id, confirmToken);
            await sendConfirmationEmail(email, confirmToken);
            return Response.json({ success: true, message: CONFIRM_MESSAGE });
        } else {
            // Already confirmed — add subscription idempotently (createSubscription ignores duplicates)
            await createSubscription(existing.id, (blogTitle as string | undefined) ?? null);
            return Response.json({ success: true, message: CONFIRM_MESSAGE });
        }
    }

    // New subscriber — handle race condition: two simultaneous requests with the same email
    try {
        const confirmToken = generateToken();
        const unsubscribeToken = generateToken();
        const subscriber = await createSubscriber(email, confirmToken, unsubscribeToken);
        await createSubscription(subscriber.id, (blogTitle as string | undefined) ?? null);
        await sendConfirmationEmail(email, confirmToken);
    } catch (err: unknown) {
        const code = (err as { code?: string }).code;
        if (code === "23505") {
            // Lost the race — a concurrent request already inserted this email.
            // Treat as existing unconfirmed: send a fresh confirmation.
            const freshToken = generateToken();
            const refetched = await getSubscriberByEmailIncludeDeleted(email);
            if (refetched && !refetched.deleted) {
                await refreshConfirmToken(refetched.id, freshToken);
                await sendConfirmationEmail(email, freshToken);
            }
        } else {
            throw err;
        }
    }

    return Response.json({ success: true, message: CONFIRM_MESSAGE });
}
