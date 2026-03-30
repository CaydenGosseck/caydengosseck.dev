import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col gap-6 py-6 max-w-prose">
            <h1 className="font-serif text-2xl" style={{ color: "var(--primary)" }}>
                Privacy Policy
            </h1>
            <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                Last updated: March 2026
            </p>

            <section className="flex flex-col gap-2">
                <h2 className="font-serif text-lg" style={{ color: "var(--primary)" }}>What I collect</h2>
                <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                    If you use the <strong>contact form</strong>, I receive your name, email address, and message.
                    These are used only to reply to you and are not stored in any database.
                </p>
                <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                    If you <strong>subscribe to the newsletter</strong>, I store your email address, your subscription
                    preferences (which blogs you follow), and tokens used to confirm your subscription and process
                    unsubscribe requests.
                </p>
                <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                    If you leave a <strong>comment</strong>, I store your name and message for display on the site.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="font-serif text-lg" style={{ color: "var(--primary)" }}>How I use it</h2>
                <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                    Newsletter email addresses are used solely to send notifications when new posts are published.
                    I do not sell, share, or use your email for any other purpose.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="font-serif text-lg" style={{ color: "var(--primary)" }}>Data retention</h2>
                <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                    Newsletter subscriber data is retained for as long as you remain subscribed.
                    When you unsubscribe, your record is soft-deleted and will be fully purged within 90 days.
                    Comments are retained indefinitely unless you request removal.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="font-serif text-lg" style={{ color: "var(--primary)" }}>Third-party services</h2>
                <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                    Emails are sent via <strong>Resend</strong> (US-based). Subscriber data is stored in{" "}
                    <strong>Supabase</strong> (US-based hosted PostgreSQL). Both services may process data
                    outside the EEA. Resend and Supabase maintain their own privacy policies and data processing
                    agreements.
                </p>
            </section>

            <section className="flex flex-col gap-2">
                <h2 className="font-serif text-lg" style={{ color: "var(--primary)" }}>Your rights</h2>
                <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                    You can unsubscribe from the newsletter at any time using the unsubscribe link in any email,
                    or by visiting <Link href="/unsubscribe">/unsubscribe</Link>.
                    To request access to, correction of, or deletion of any data I hold about you,
                    contact me via the <Link href="/">contact form</Link>.
                </p>
            </section>
        </div>
    );
}
