import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

// Only create Redis client in production
let redis: Redis | null = null;
if (process.env.NODE_ENV === "production") {
  redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

export async function checkRateLimit(request: NextRequest): Promise<NextResponse | null> {
  // 🚫 Skip rate limiting in development
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  if (!redis) {
    console.error("❌ [RATE LIMIT] Redis not initialized");
    return null; // Fail open
  }

  try {
    // Get client IP
    const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const key = `rate_limit:${ip}`;

    // Check usage
    const current = await redis.get(key);
    const currentCount = current ? parseInt(current) : 0;

    if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
      const ttl = await redis.ttl(key);
      const resetTime = Math.floor(Date.now() / 1000) + (ttl > 0 ? ttl : RATE_LIMIT_WINDOW);

      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Maximum ${RATE_LIMIT_MAX_REQUESTS} requests per minute allowed.`,
          retryAfter: ttl > 0 ? ttl : RATE_LIMIT_WINDOW,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetTime.toString(),
            "Retry-After": (ttl > 0 ? ttl : RATE_LIMIT_WINDOW).toString(),
          },
        }
      );
    }

    // Increment counter
    const newCount = await redis.incr(key);
    if (newCount === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }

    return null; // ✅ Allow request
  } catch (error) {
    console.error("❌ [RATE LIMIT] Redis error:", error);
    return null; // Fail open
  }
}

// Optional: health check
export async function getRateLimitHealth() {
  if (!redis) return { status: "disabled", redis: false };

  try {
    await redis.ping();
    return { status: "healthy", redis: true };
  } catch {
    return { status: "degraded", redis: false };
  }
}
