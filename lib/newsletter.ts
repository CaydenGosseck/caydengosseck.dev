import { Resend } from "resend";
import { getSubscribersForBlog } from "@/lib/dal/subscribers";
import { C, emailShell, emailButton, emailDivider, escapeHtml } from "@/lib/email-template";

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
    const safeBlogTitle = escapeHtml(blogTitle);
    const safePostTitle = escapeHtml(postTitle);

    const emails = subscribers.map((s) => {
        const unsubBlogUrl = `${baseUrl}/api/unsubscribe?token=${s.unsubscribeToken}&blog=${encodeURIComponent(blogTitle)}`;
        const unsubAllUrl = `${baseUrl}/api/unsubscribe?token=${s.unsubscribeToken}`;

        const html = emailShell(`
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:6px;">
                <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${C.primary};">
                  ✦ new post
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:8px;">
                <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">
                  ${safeBlogTitle}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:24px;">
                <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:normal;color:${C.fg};line-height:1.3;">
                  ${safePostTitle}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:32px;">
                ${emailButton(postUrl, "read post →")}
              </td>
            </tr>
            ${emailDivider()}
            <tr>
              <td style="padding-top:4px;">
                <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:${C.muted};line-height:1.6;">
                  You're receiving this because you subscribed to <em>${safeBlogTitle}</em> on caydengosseck.dev.<br />
                  <a href="${unsubBlogUrl}" style="color:${C.muted};">Unsubscribe from ${safeBlogTitle}</a>
                  &nbsp;·&nbsp;
                  <a href="${unsubAllUrl}" style="color:${C.muted};">Unsubscribe from all</a>
                </p>
              </td>
            </tr>
          </table>
        `);

        const text = [
            `New post in ${blogTitle}: "${postTitle}"`,
            ``,
            `Read it here: ${postUrl}`,
            ``,
            `--`,
            `Unsubscribe from ${blogTitle}: ${unsubBlogUrl}`,
            `Unsubscribe from all: ${unsubAllUrl}`,
        ].join("\n");

        return {
            from: FROM,
            to: s.email,
            subject: `New post: "${postTitle}"`,
            html,
            text,
        };
    });

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

    const html = emailShell(`
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom:6px;">
            <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${C.primary};">
              ✦ confirm subscription
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:24px;">
            <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:normal;color:${C.fg};line-height:1.3;">
              One step left.
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:24px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:15px;color:${C.fg};line-height:1.7;opacity:0.85;">
              Thanks for subscribing to caydengosseck.dev. Click below to confirm your email address and start receiving updates.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:32px;">
            ${emailButton(confirmUrl, "confirm email →")}
          </td>
        </tr>
        ${emailDivider()}
        <tr>
          <td style="padding-top:4px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:${C.muted};line-height:1.6;">
              This link expires in 48 hours. If you didn't request this, you can safely ignore this email.
            </p>
          </td>
        </tr>
      </table>
    `);

    const text = [
        `Thanks for subscribing to caydengosseck.dev!`,
        ``,
        `Confirm your email: ${confirmUrl}`,
        ``,
        `This link expires in 48 hours. If you didn't request this, ignore this email.`,
        ``,
        `— Cayden`,
    ].join("\n");

    const { error } = await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Confirm your subscription — caydengosseck.dev",
        html,
        text,
    });
    if (error) throw new Error(`Failed to send confirmation email: ${error.message}`);
}
