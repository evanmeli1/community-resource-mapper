import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

// Create Redis client for local Docker Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true, // Don't connect until first command
});

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute

interface RateLimitResult {
  success: boolean;
  reset: number;
  remaining: number;
}

export async function checkRateLimit(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Get client IP
    const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const key = `rate_limit:${ip}`;
    
    console.log(`🔄 [RATE LIMIT] Checking rate limit for IP: ${ip}`);
    
    // Simpler Redis approach - use simple counter with expiration
    const current = await redis.get(key);
    const currentCount = current ? parseInt(current) : 0;
    
    console.log(`🔄 [RATE LIMIT] IP: ${ip} | Current count: ${currentCount}/${RATE_LIMIT_MAX_REQUESTS}`);
    
    // Check if rate limit would be exceeded
    if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
      console.log(`🚫 [RATE LIMIT] Rate limit exceeded for IP: ${ip}`);
      
      const ttl = await redis.ttl(key);
      const resetTime = Math.floor(Date.now() / 1000) + (ttl > 0 ? ttl : RATE_LIMIT_WINDOW);
      
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Maximum ${RATE_LIMIT_MAX_REQUESTS} requests per minute allowed.`,
          retryAfter: ttl > 0 ? ttl : RATE_LIMIT_WINDOW
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
    
    // Set expiration only if this is the first request
    if (newCount === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }
    
    const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - newCount);
    console.log(`✅ [RATE LIMIT] Request allowed for IP: ${ip} | New count: ${newCount} | Remaining: ${remaining}`);
    
    return null; // Allow request to continue
    
  } catch (error) {
    console.error("❌ [RATE LIMIT] Redis error:", error);
    
    // On Redis error, allow request through (fail open)
    console.log("⚠️ [RATE LIMIT] Failing open due to Redis error");
    return null;
  }
}

// Health check function for monitoring
export async function getRateLimitHealth(): Promise<{ status: string; redis: boolean }> {
  try {
    await redis.ping();
    return { status: "healthy", redis: true };
  } catch (error) {
    console.error("Redis health check failed:", error);
    return { status: "degraded", redis: false };
  }
}