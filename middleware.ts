import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Rate limiting store (in-memory, resets on cold start) ──────────────
const rateLimit = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  "/api/auth/register": { limit: 5,  windowMs: 60_000 },  // 5/min
  "/api/auth":          { limit: 10, windowMs: 60_000 },  // 10/min (login)
  "/api/orders":        { limit: 20, windowMs: 60_000 },  // 20/min
  "/api/ai":            { limit: 15, windowMs: 60_000 },  // 15/min
};

function checkRateLimit(ip: string, path: string): boolean {
  const ruleKey = Object.keys(RATE_LIMITS).find((k) => path.startsWith(k));
  if (!ruleKey) return true; // no limit configured → allow

  const rule = RATE_LIMITS[ruleKey];
  const key  = `${ip}:${ruleKey}`;
  const now  = Date.now();
  const entry = rateLimit.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(key, { count: 1, resetAt: now + rule.windowMs });
    return true;
  }

  if (entry.count >= rule.limit) return false;

  entry.count += 1;
  return true;
}

// ─── Middleware ──────────────────────────────────────────────────────────
export default withAuth(
  function middleware(req: NextRequest & { nextauth?: { token: any } }) {
    const { pathname } = req.nextUrl;
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "127.0.0.1";

    // Rate limit API routes
    if (pathname.startsWith("/api/") && !checkRateLimit(ip, pathname)) {
      return new NextResponse(
        JSON.stringify({ message: "Quá nhiều yêu cầu. Vui lòng thử lại sau." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After":  "60",
          },
        }
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // Admin routes — require admin role
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }

        // Protected user routes — require any valid session
        if (
          pathname.startsWith("/profile") ||
          pathname.startsWith("/orders") ||
          pathname.startsWith("/wishlist") ||
          pathname.startsWith("/checkout")
        ) {
          return !!token;
        }

        // Everything else is public
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
    "/api/auth/register",
    "/api/orders/:path*",
    "/api/ai/:path*",
  ],
};
