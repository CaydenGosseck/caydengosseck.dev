import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rate-limit";
import type { RateLimitRule } from "@/types/rate-limit";

type RateLimitRouteRule = {
    pattern: RegExp;
    methods: string[];
    rule: RateLimitRule;
    key: string;
};

const RULES: RateLimitRouteRule[] = [
    // Public endpoints — tightest limits (trigger outbound emails or public DB writes)
    {
        pattern: /^\/api\/contact$/,
        methods: ["POST"],
        rule: { windowMs: 15 * 60 * 1000, maxRequests: 3 },
        key: "contact",
    },
    {
        pattern: /^\/api\/subscribe$/,
        methods: ["POST"],
        rule: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
        key: "subscribe",
    },
    {
        pattern: /^\/api\/comments$/,
        methods: ["POST"],
        rule: { windowMs: 5 * 60 * 1000, maxRequests: 5 },
        key: "comments",
    },
    // Auth-gated endpoints — looser limits
    {
        pattern: /^\/api\/post\//,
        methods: ["POST", "PATCH", "DELETE"],
        rule: { windowMs: 60 * 1000, maxRequests: 20 },
        key: "post",
    },
    {
        pattern: /^\/api\/blog/,
        methods: ["POST", "DELETE"],
        rule: { windowMs: 60 * 1000, maxRequests: 10 },
        key: "blog",
    },
    {
        pattern: /^\/api\/project/,
        methods: ["POST", "PATCH", "DELETE"],
        rule: { windowMs: 60 * 1000, maxRequests: 10 },
        key: "project",
    },
    {
        pattern: /^\/api\/mini_blog/,
        methods: ["POST", "DELETE"],
        rule: { windowMs: 60 * 1000, maxRequests: 10 },
        key: "mini_blog",
    },
    {
        pattern: /^\/api\/updates$/,
        methods: ["POST", "DELETE"],
        rule: { windowMs: 60 * 1000, maxRequests: 10 },
        key: "updates",
    },
    {
        pattern: /^\/api\/github$/,
        methods: ["GET"],
        rule: { windowMs: 60 * 1000, maxRequests: 10 },
        key: "github",
    },
];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Cron routes are token-gated — skip rate limiting
    if (pathname.startsWith("/api/cron/")) {
        return NextResponse.next();
    }

    const method = request.method.toUpperCase();
    const matched = RULES.find(
        (r) => r.pattern.test(pathname) && r.methods.includes(method)
    );

    if (!matched) return NextResponse.next();

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const key = `${ip}:${matched.key}`;

    const result = rateLimiter.check(key, matched.rule);

    if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            {
                status: 429,
                headers: {
                    "Retry-After": String(retryAfter),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": String(result.resetAt),
                },
            }
        );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    response.headers.set("X-RateLimit-Reset", String(result.resetAt));
    return response;
}

export const config = {
    matcher: ["/api/:path*"],
};
