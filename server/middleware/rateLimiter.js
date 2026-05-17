import rateLimit from "express-rate-limit"

const isProduction = process.env.NODE_ENV === "production"

// Auth rate limiter — applied to login, register, OTP, password reset.
// Excludes GET /me (session check) since it fires on every page load.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // FIX #7: Increased from 30 to 50 in production — users retrying during
  // cold starts were getting blocked. Also skips GET requests (e.g. /me).
  max: isProduction ? 50 : 200,
  message: { success: false, message: "Too many auth attempts — please wait 15 minutes before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: false,
  // Skip GET requests (e.g. /api/auth/me) — they are harmless session checks
  // and shouldn't count toward auth attempt limits.
  skip: (req) => req.method === 'GET',
  // On Render, use the real IP from X-Forwarded-For
  keyGenerator: (req) => req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip
})

// News API rate limiter
export const newsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: { success: false, message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip
})

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip
})

// Admin-specific rate limiter — stricter than general API
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many admin requests. Please wait." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip
})
