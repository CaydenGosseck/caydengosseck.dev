import Link from "next/link";

export default async function UnsubscribePage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; blog?: string }>;
}) {
    const { success, blog } = await searchParams;

    return (
        <div className="flex flex-col gap-4 py-6 max-w-prose">
            {success === "true" ? (
                <>
                    <h1 className="font-serif text-2xl" style={{ color: "var(--primary)" }}>
                        Unsubscribed
                    </h1>
                    <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>
                        {blog
                            ? `You've been unsubscribed from "${blog}".`
                            : "You've been unsubscribed from all notifications."}
                    </p>
                    <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                        Changed your mind?{" "}
                        <Link href="/">Subscribe again from the homepage.</Link>
                    </p>
                </>
            ) : (
                <>
                    <h1 className="font-serif text-2xl" style={{ color: "var(--primary)" }}>
                        Unsubscribe
                    </h1>
                    <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>
                        To unsubscribe, use the link in any notification email you received.
                        Each email contains an unsubscribe link at the bottom.
                    </p>
                    <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                        <Link href="/">Back to home</Link>
                    </p>
                </>
            )}
        </div>
    );
}
