/**
 * Basic in-memory login rate limiter: per-IP sliding window.
 *
 * Locks out an IP after MAX_FAILS failed attempts within WINDOW_MS. Since PINs
 * are short and guessable, this throttles brute-forcing.
 *
 * NOTE: state lives in the server process's memory. For a single-location shop
 * on a single instance this is sufficient ("basic rate-limiting" per spec). On a
 * multi-instance/serverless deployment, back this with the DB or Redis for a
 * shared counter — the public API here would stay the same.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_FAILS = 5;

// ip -> timestamps (ms) of recent failures within the window.
const failures = new Map<string, number[]>();

export interface RateState {
  locked: boolean;
  /** Attempts remaining before lockout. */
  remaining: number;
  /** Seconds until the oldest failure ages out (0 when not locked). */
  retryAfterSeconds: number;
}

function prune(ip: string, now: number): number[] {
  const list = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length) failures.set(ip, list);
  else failures.delete(ip);
  return list;
}

export function checkRateLimit(ip: string): RateState {
  const now = Date.now();
  const list = prune(ip, now);
  const locked = list.length >= MAX_FAILS;
  const retryAfterSeconds = locked
    ? Math.max(0, Math.ceil((list[0] + WINDOW_MS - now) / 1000))
    : 0;
  return {
    locked,
    remaining: Math.max(0, MAX_FAILS - list.length),
    retryAfterSeconds,
  };
}

export function recordFailure(ip: string): void {
  const now = Date.now();
  const list = prune(ip, now);
  list.push(now);
  failures.set(ip, list);
}

export function resetRateLimit(ip: string): void {
  failures.delete(ip);
}

/** Extract the client IP from request headers (proxy-aware). */
export function ipFromHeaders(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

export function getClientIp(request?: Request): string {
  if (!request) return "unknown";
  return ipFromHeaders(request.headers);
}
