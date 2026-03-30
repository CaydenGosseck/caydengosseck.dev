import { Resend } from "resend";
import { getSubscribersForBlog } from "@/lib/dal/subscribers";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const FROM = "newsletter@caydengosseck.dev";
const BATCH_SIZE = 100;

function getBaseUrl(): string {
    if (!BASE_URL) throw new Error("NEXT_PUBLIC_SITE_URL is not set");
    return BASE_URL;
}

export async function sendNewPostNewsletter(
    blogTitle: string,
    postTitle: string,
    postId: number,
): Promise<number> {
    const baseUrl = getBaseUrl();
    const subscribers = await getSubscribersForBlog(blogTitle);
    if (subscribers.length === 0) return 0;

    const postUrl = `${baseUrl}/blog/${encodeURIComponent(blogTitle)}/${postId}`;

    const emails = subscribers.map((s) => ({
        from: FROM,
        to: s.email,
        subject: `New post: "${postTitle}"`,
        text: [
            `A new post has been published in ${blogTitle}:`,
            ``,
            `"${postTitle}"`,
            ``,
            `Read it here: ${postUrl}`,
            ``,
            `--`,
            `Unsubscribe from ${blogTitle}: ${baseUrl}/api/unsubscribe?token=${s.unsubscribeToken}&blog=${encodeURIComponent(blogTitle)}`,
            `Unsubscribe from all: ${baseUrl}/api/unsubscribe?token=${s.unsubscribeToken}`,
            ``,
            `caydengosseck.dev · PO Box [your address] · [City, State ZIP]`,
        ].join("\n"),
    }));

    let sent = 0;
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const batch = emails.slice(i, i + BATCH_SIZE);
        const { error } = await resend.batch.send(batch);
        if (error) {
            console.error(`Newsletter batch ${i}–${i + BATCH_SIZE - 1} failed:`, error);
        } else {
            sent += batch.length;
        }
    }
    return sent;
}

export async function sendConfirmationEmail(email: string, confirmToken: string): Promise<void> {
    const baseUrl = getBaseUrl();
    const confirmUrl = `${baseUrl}/api/subscribe/confirm?token=${confirmToken}`;
    const { error } = await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Confirm your subscription — caydengosseck.dev",
        text: [
            `Thanks for subscribing!`,
            ``,
            `Please confirm your email address by clicking the link below:`,
            ``,
            confirmUrl,
            ``,
            `This link expires in 48 hours. If you didn't request this, you can safely ignore this email.`,
            ``,
            `— Cayden`,
            ``,
            `caydengosseck.dev · PO Box [your address] · [City, State ZIP]`,
        ].join("\n"),
    });
    if (error) throw new Error(`Failed to send confirmation email: ${error.message}`);
}
