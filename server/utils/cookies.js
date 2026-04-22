export function buildAuthCookieOptions() {
  const isProd = process.env.NODE_ENV === "production"
  // Default to "none" in prod so Vercel (frontend) -> Render (backend) works.
  // In dev, "lax" avoids Secure-cookie issues on http://localhost.
  const sameSiteRaw = (process.env.COOKIE_SAME_SITE || (isProd ? "none" : "lax")).toLowerCase()
  const sameSite = sameSiteRaw === "none" ? "none" : "lax"
  const secure = sameSite === "none" ? true : isProd

  return {
    httpOnly: true,
    sameSite,
    secure,
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}

