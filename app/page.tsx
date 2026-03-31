import InlineLink from "@/components/inline-link";
import { Card } from "@/components/retroui/Card";
import ContactForm from "@/components/contact-form";
import CommentsSection from "@/components/comments-section";
import SubscribeForm from "@/components/subscribe-form";
import SubscribedBanner from "@/components/subscribed-banner";
import StatSheet from "@/components/stat-sheet";

type HomePageProps = {
    searchParams: Promise<{ subscribed?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
    const { subscribed } = await searchParams;
    return (
        <div className="pb-4 flex flex-col gap-6">
            <h1 className="sr-only">Cayden Gosseck — Personal Site</h1>
            {subscribed === "true" && <SubscribedBanner />}
            <div className="grid grid-cols-1 lg:grid-cols-[500px_500px_500px] gap-6 items-stretch">
                {/* Col 1: main content */}
                <div className="flex flex-col gap-6 h-full">
                    <Card>
                        <Card.Content>
                            <div className="flex flex-col gap-4 max-w-prose">
                                <h2 className="sr-only">About</h2>
                                <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                                    Welcome to caydengosseck.dev!
                                </p>
                                <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                                    On the left, you will see my{" "}
                                    <InlineLink href="/blogs">/blogs</InlineLink>
                                    {" "}and my{" "}
                                    <InlineLink href="/projects">/projects</InlineLink>
                                    . Above, you can find my{" "}
                                    <InlineLink href="https://github.com/CaydenGosseck" external>github</InlineLink>
                                    {" "}and{" "}
                                    <InlineLink href="https://www.linkedin.com/in/cayden-gosseck/" external>linkedin</InlineLink>
                                    .
                                </p>
                            </div>
                        </Card.Content>
                    </Card>
                    <SubscribeForm />
                    <div className="grow">
                        <ContactForm />
                    </div>
                </div>
                {/* Col 2: stat sheet */}
                <section aria-labelledby="stats-heading">
                    <h2 id="stats-heading" className="sr-only">Stats</h2>
                    <StatSheet />
                </section>
                {/* Col 3: comments */}
                <section aria-labelledby="comments-heading">
                    <h2 id="comments-heading" className="sr-only">Comments</h2>
                    <CommentsSection />
                </section>
            </div>
        </div>
    );
}
