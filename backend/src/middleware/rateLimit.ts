import { Context, Next } from 'hono';

interface RateLimitConfig {
  limit: number;
  windowMs: number;
  message: string;
}

// In-memory request counters keyed by IP address
const POST_LIMIT_STORE = new Map<string, { count: number; expiresAt: number }>();
const GET_LIMIT_STORE = new Map<string, { count: number; expiresAt: number }>();
const WRONG_CODE_LIMIT_STORE = new Map<string, { count: number; expiresAt: number }>();

/**
 * Clean up expired rate limit entries to prevent memory leaks
 */
function cleanStore(store: Map<string, { count: number; expiresAt: number }>) {
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (val.expiresAt < now) {
      store.delete(key);
    }
  }
}

/**
 * Standard in-memory rate limiter middleware
 */
export function rateLimiter(config: RateLimitConfig, storeType: 'post' | 'get') {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('x-real-ip') || 'unknown-ip';
    const now = Date.now();
    const store = storeType === 'post' ? POST_LIMIT_STORE : GET_LIMIT_STORE;
    
    // Periodically prune
    cleanStore(store);

    const record = store.get(ip);

    if (!record) {
      store.set(ip, { count: 1, expiresAt: now + config.windowMs });
    } else if (record.expiresAt < now) {
      store.set(ip, { count: 1, expiresAt: now + config.windowMs });
    } else {
      record.count += 1;
      if (record.count > config.limit) {
        return c.json(
          {
            code: 'RATE_LIMITED',
            message: config.message,
          },
          429
        );
      }
    }

    await next();
  };
}

/**
 * Helper to register a wrong-code guess attempt and rate limit if thresholds exceeded
 */
export async function trackWrongCodeAttempt(c: Context) {
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('x-real-ip') || 'unknown-ip';
  const now = Date.now();
  
  // limit: 20 wrong code attempts per 5 minutes
  const limit = 20;
  const windowMs = 5 * 60 * 1000;

  cleanStore(WRONG_CODE_LIMIT_STORE);

  const record = WRONG_CODE_LIMIT_STORE.get(ip);
  if (!record) {
    WRONG_CODE_LIMIT_STORE.set(ip, { count: 1, expiresAt: now + windowMs });
  } else if (record.expiresAt < now) {
    WRONG_CODE_LIMIT_STORE.set(ip, { count: 1, expiresAt: now + windowMs });
  } else {
    record.count += 1;
  }
}

/**
 * Middleware to reject clients if they're blocked for wrong code enumeration attempts
 */
export async function checkWrongCodeBlocker(c: Context, next: Next) {
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('x-real-ip') || 'unknown-ip';
  const now = Date.now();
  const record = WRONG_CODE_LIMIT_STORE.get(ip);

  if (record && record.expiresAt > now && record.count > 20) {
    return c.json(
      {
        code: 'RATE_LIMITED',
        message: 'Too many incorrect code attempts. Please wait 5 minutes before trying again.',
      },
      429
    );
  }

  await next();
}
