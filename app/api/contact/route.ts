import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_MESSAGE_LENGTH = 5000;

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
        return Response.json({ error: "All fields are required." }, { status: 400 });
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

    const { error } = await resend.batch.send([
        {
            from: "contact@caydengosseck.dev",
            to: contactEmail,
            subject: `New contact from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        },
        {
            from: "contact@caydengosseck.dev",
            to: email,
            subject: "Thanks for reaching out!",
            text: `Hi ${name},\n\nThanks for your message — I'll get back to you soon.\n\nFor reference, here's what you sent:\n\n"${message}"\n\n— Cayden`,
        },
    ]);

    if (error) {
        return Response.json({ error: "Failed to send email. Please try again." }, { status: 500 });
    }

    return Response.json({ success: true });
}
