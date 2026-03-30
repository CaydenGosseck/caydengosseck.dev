"use client";

import { useState } from "react";
import { Card } from "@/components/retroui/Card";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [state, setState] = useState<FormState>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });
            const data = await res.json();
            if (!res.ok) {
                setErrorMsg(data.error ?? "Something went wrong.");
                setState("error");
                return;
            }
            setState("success");
        } catch {
            setErrorMsg("Network error. Please try again.");
            setState("error");
        }
    }

    const inputClass = "w-full px-3 py-2 font-sans text-sm border-2 bg-transparent outline-none focus:border-[var(--foreground)] transition-colors duration-150";
    const inputStyle = { borderColor: "var(--border-color)", color: "var(--foreground)" };

    if (state === "success") {
        return (
            <Card>
                <Card.Header>
                    <Card.Title>contact</Card.Title>
                </Card.Header>
                <Card.Content>
                    <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>
                        Message sent! I&apos;ll get back to you soon.
                    </p>
                    <p className="font-sans text-sm mt-1" style={{ color: "var(--muted-text)" }}>
                        A confirmation has been sent to {email}.
                    </p>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>contact</Card.Title>
            </Card.Header>
            <Card.Content>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="contact-name" className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                            Name <span aria-hidden="true">*</span>
                        </label>
                        <input
                            id="contact-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                            className={inputClass}
                            style={inputStyle}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="contact-email" className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                            Email <span aria-hidden="true">*</span>
                        </label>
                        <input
                            id="contact-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className={inputClass}
                            style={inputStyle}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="contact-message" className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                            Message <span aria-hidden="true">*</span>
                        </label>
                        <textarea
                            id="contact-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={5}
                            className={inputClass}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>

                    {state === "error" && (
                        <p
                            role="alert"
                            className="font-sans text-sm"
                            style={{ color: "var(--foreground)" }}
                        >
                            {errorMsg}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={state === "loading"}
                        className="font-pixel text-[10px] uppercase tracking-widest px-4 py-3 border-2 transition-colors duration-150 hover:bg-[var(--muted-bg)] active:bg-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed w-fit"
                        style={{
                            borderColor: "var(--border-color)",
                            background: "transparent",
                        }}
                    >
                        {state === "loading" ? "Sending..." : "Send"}
                    </button>
                </form>
            </Card.Content>
        </Card>
    );
}
