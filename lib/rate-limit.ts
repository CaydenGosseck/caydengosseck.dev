import type { RateLimitEntry, RateLimitRule, RateLimitResult } from "@/types/rate-limit";

class RateLimiter {
    private store = new Map<string, RateLimitEntry>();
    private lastCleanup = Date.now();

    check(key: string, rule: RateLimitRule): RateLimitResult {
        this.maybeCleanup();

        const now = Date.now();
        const entry = this.store.get(key);

        if (!entry || now >= entry.resetAt) {
            this.store.set(key, { count: 1, resetAt: now + rule.windowMs });
            return { allowed: true, remaining: rule.maxRequests - 1, resetAt: now + rule.windowMs };
        }

        if (entry.count >= rule.maxRequests) {
            return { allowed: false, remaining: 0, resetAt: entry.resetAt };
        }

        entry.count++;
        return { allowed: true, remaining: rule.maxRequests - entry.count, resetAt: entry.resetAt };
    }

    private maybeCleanup() {
        const now = Date.now();
        if (now - this.lastCleanup < 60_000) return;
        this.lastCleanup = now;
        for (const [key, entry] of this.store) {
            if (now >= entry.resetAt) this.store.delete(key);
        }
    }
}

export const rateLimiter = new RateLimiter();
