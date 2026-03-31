"use client";

import { useState } from "react";
import { Card } from "@/components/retroui/Card";

type FormState = "idle" | "loading" | "success" | "error";
type ContactMode = "personal" | "business";

export default function ContactForm() {
    const [mode, setMode] = useState<ContactMode>("personal");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [state, setState] = useState<FormState>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    function handleModeChange(next: ContactMode) {
        setMode(next);
        setState("idle");
        setErrorMsg("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode,
                    name,
                    email,
                    company: mode === "business" ? company : undefined,
                    subject: mode === "business" ? subject : undefined,
                    message,
                }),
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

    const inputClass = "w-full px-3 py-2 font-sans text-sm border-0 border-b outline-none transition-colors duration-150";
    const inputStyle = { background: "transparent", borderColor: "var(--border-color)", color: "var(--foreground)" };
    const labelClass = "font-pixel text-[9px] uppercase tracking-widest";

    if (state === "success") {
        return (
            <Card className="h-full flex flex-col">
                <Card.Content className="flex flex-col gap-2 py-8">
                    <span className="font-pixel text-xs uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                        ✦ message sent
                    </span>
                    <p className="font-sans text-base" style={{ color: "var(--foreground)" }}>
                        Thanks{mode === "business" ? ` for reaching out, ${name}` : `, ${name}`}. I&apos;ll be in touch shortly.
                    </p>
                    <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                        A confirmation has been sent to {email}.
                    </p>
                </Card.Content>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <Card.Content className="flex flex-col grow">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 grow" noValidate>

                    {/* Header + mode toggle */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="font-pixel text-xs uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                                contact
                            </span>
                            <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
                        </div>
                        <div className="flex w-fit" style={{ border: "1px solid var(--border-color)" }}>
                            {(["personal", "business"] as const).map((m, i) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => handleModeChange(m)}
                                    className="font-pixel text-[9px] uppercase tracking-widest px-3 py-1.5 transition-colors duration-150"
                                    style={{
                                        background: mode === m ? "var(--accent)" : "transparent",
                                        color: "var(--foreground)",
                                        borderRight: i === 0 ? "1px solid var(--border-color)" : undefined,
                                    }}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <p className="font-sans text-sm" style={{ color: "var(--muted-text)" }}>
                            {mode === "personal"
                                ? "Drop me any message"
                                : "Open to work opportunities, collaborations, and consulting engagements"}
                        </p>
                    </div>

                    {/* Personal mode: name + email + message */}
                    {mode === "personal" && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="contact-name" className={labelClass} style={{ color: "var(--muted-text)" }}>
                                        Name <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="contact-name"
                                        name="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Your name"
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="contact-email" className={labelClass} style={{ color: "var(--muted-text)" }}>
                                        Email <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        spellCheck={false}
                                        placeholder="you@example.com"
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 grow">
                                <label htmlFor="contact-message" className={labelClass} style={{ color: "var(--muted-text)" }}>
                                    Message <span aria-hidden="true">*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={5}
                                    placeholder="Hey Cayden…"
                                    className={inputClass + " grow"}
                                    style={{ ...inputStyle, resize: "none" }}
                                />
                            </div>
                        </>
                    )}

                    {/* Business mode: name + company, email + subject, message */}
                    {mode === "business" && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="contact-name" className={labelClass} style={{ color: "var(--muted-text)" }}>
                                        Name <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="contact-name"
                                        name="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Jane Smith"
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="contact-company" className={labelClass} style={{ color: "var(--muted-text)" }}>
                                        Company
                                    </label>
                                    <input
                                        id="contact-company"
                                        name="company"
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        autoComplete="organization"
                                        placeholder="Acme Corp"
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="contact-email" className={labelClass} style={{ color: "var(--muted-text)" }}>
                                        Email <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        spellCheck={false}
                                        placeholder="jane@acme.com"
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="contact-subject" className={labelClass} style={{ color: "var(--muted-text)" }}>
                                        Subject <span aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="contact-subject"
                                        name="subject"
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                        placeholder="Job opportunity"
                                        className={inputClass}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 grow">
                                <label htmlFor="contact-message" className={labelClass} style={{ color: "var(--muted-text)" }}>
                                    Message <span aria-hidden="true">*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={5}
                                    placeholder="Tell me about the role, project, or opportunity…"
                                    className={inputClass + " grow"}
                                    style={{ ...inputStyle, resize: "none" }}
                                />
                            </div>
                        </>
                    )}

                    {state === "error" && (
                        <p role="alert" className="font-sans text-xs" style={{ color: "var(--accent)" }}>
                            {errorMsg}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={state === "loading"}
                        className="font-pixel text-[9px] uppercase tracking-widest px-4 py-2 transition-colors duration-150 hover:bg-[var(--muted-bg)] active:bg-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed w-fit"
                        style={{
                            border: "1px solid var(--border-color)",
                            background: "transparent",
                            color: "var(--foreground)",
                        }}
                    >
                        {state === "loading" ? "sending…" : mode === "business" ? "send inquiry" : "send message"}
                    </button>

                </form>
            </Card.Content>
        </Card>
    );
}
