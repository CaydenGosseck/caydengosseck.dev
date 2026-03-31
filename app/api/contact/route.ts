import { Resend } from "resend";
import { C, emailShell, emailButton, emailDivider, escapeHtml } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "contact@caydengosseck.dev";
const MAX_MESSAGE_LENGTH = 5000;

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
    const { mode, name, email, company, subject, message } = await request.json();

    if (!name || !email || !message) {
        return Response.json({ error: "Name, email, and message are required." }, { status: 400 });
    }
    if (mode === "business" && !subject) {
        return Response.json({ error: "Subject is required for business inquiries." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
        return Response.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
        return Response.json({ error: `Message must be under ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 });
    }

    const contactEmail = process.env.CONTACT_EMAIL;
    if (!contactEmail) {
        return Response.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject ?? "");
    const safeCompany = company ? escapeHtml(company) : null;
    const safeMessage = escapeHtml(message);

    const companyLine = safeCompany ? `<br /><span style="color:${C.muted};">${safeCompany}</span>` : "";

    // Internal notification to Cayden
    const internalHtml = emailShell(`
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom:6px;">
            <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${C.primary};">
              ✦ new inquiry
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:24px;">
            <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:normal;color:${C.fg};line-height:1.3;">
              ${safeSubject}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:20px;">
            <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;color:${C.fg};line-height:1.8;">
              <span style="color:${C.muted};letter-spacing:0.1em;text-transform:uppercase;font-size:9px;">From</span><br />
              ${safeName}${companyLine}<br />
              <a href="mailto:${safeEmail}" style="color:${C.primary};">${safeEmail}</a>
            </p>
          </td>
        </tr>
        ${emailDivider()}
        <tr>
          <td style="padding-bottom:8px;">
            <span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">message</span>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin:0;font-family:Georgia,serif;font-size:15px;color:${C.fg};line-height:1.8;white-space:pre-wrap;">${safeMessage}</p>
          </td>
        </tr>
      </table>
    `);

    // Confirmation to sender
    const confirmHtml = emailShell(`
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom:6px;">
            <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${C.primary};">
              ✦ message received
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:24px;">
            <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:normal;color:${C.fg};line-height:1.3;">
              Thanks for reaching out, ${safeName}.
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:24px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:15px;color:${C.fg};line-height:1.7;opacity:0.85;">
              I've received your inquiry and will get back to you as soon as possible — typically within 1–2 business days.
            </p>
          </td>
        </tr>
        ${emailDivider()}
        <tr>
          <td style="padding-bottom:8px;">
            <span style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">your message</span>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:24px;">
            <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:13px;font-style:italic;color:${C.muted};">${safeSubject}</p>
            <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:${C.muted};line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
          </td>
        </tr>
        ${emailDivider()}
        <tr>
          <td>
            <p style="margin:0;font-family:Georgia,serif;font-size:13px;color:${C.muted};line-height:1.6;">
              — Cayden Gosseck<br />
              <a href="https://caydengosseck.dev" style="color:${C.primary};text-decoration:none;">caydengosseck.dev</a>
            </p>
          </td>
        </tr>
      </table>
    `);

    const { error } = await resend.batch.send([
        {
            from: FROM,
            to: contactEmail,
            subject: mode === "business" ? `[inquiry] ${subject} — ${name}` : `[personal] message from ${name}`,
            html: internalHtml,
            text: `From: ${name}${company ? ` (${company})` : ""} <${email}>\nSubject: ${subject}\n\n${message}`,
        },
        {
            from: FROM,
            to: email,
            subject: mode === "business" ? `Re: ${subject} — caydengosseck.dev` : `Got your message — caydengosseck.dev`,
            html: confirmHtml,
            text: `Hi ${name},\n\nThanks for your message — I'll get back to you within 1–2 business days.\n\nFor reference:\n\n${subject}\n\n"${message}"\n\n— Cayden\ncaydengosseck.dev`,
        },
    ]);

    if (error) {
        return Response.json({ error: "Failed to send email. Please try again." }, { status: 500 });
    }

    return Response.json({ success: true });
}
