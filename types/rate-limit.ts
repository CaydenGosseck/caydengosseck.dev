export type RateLimitEntry = {
    count: number;
    resetAt: number;
};

export type RateLimitRule = {
    windowMs: number;
    maxRequests: number;
};

export type RateLimitResult = {
    allowed: boolean;
    remaining: number;
    resetAt: number;
};
