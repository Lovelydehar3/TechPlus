export function buildAuthCookieOptions() {
  const isProd = process.env.NODE_ENV === "production"
  // FIX #5: In production, ALWAYS use sameSite=none + secure for cross-origin
  // (Vercel frontend → Render backend). Ignore COOKIE_SAME_SITE env override in prod.
  const sameSite = isProd ? "none" : "lax"
  const secure = isProd

  return {
    httpOnly: true,
    sameSite,
    secure,
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}

