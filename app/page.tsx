import InlineLink from "@/components/inline-link";
import { Card } from "@/components/retroui/Card";
import ContactForm from "@/components/contact-form";
import CommentsSection from "@/components/comments-section";
import SubscribeForm from "@/components/subscribe-form";

export default function HomePage() {
    return (
        <div className="pb-4 flex flex-col gap-6">
            <h1 className="sr-only">Cayden Gosseck — Personal Site</h1>
            <Card>
                <Card.Content>
                    <div className="flex flex-col gap-4 max-w-prose">
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
                        <p className="font-sans text-base leading-relaxed" style={{ color: "var(--foreground)" }}>
                            Also, check out my{" "}<InlineLink href="/stats">/stats</InlineLink>
                            {" "}page to learn more about me.
                        </p>
                    </div>
                </Card.Content>
            </Card>
            <SubscribeForm />
            <ContactForm />
            <CommentsSection />
        </div>
    );
}
