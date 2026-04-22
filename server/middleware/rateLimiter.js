import rateLimit from "express-rate-limit"

// Rate limiter for authentication endpoints
// Limit is deliberately generous (15) to avoid blocking OTP resend, forgot-password, and
// multiple login attempts within a single user session while still stopping brute force.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: "Too many auth attempts — please wait 15 minutes before trying again.",
  standardHeaders: true,
  legacyHeaders: false
})

// Rate limiter for news API calls
export const newsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: "Too many requests. Please try again later."
})

// Rate limiter for general API calls
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: "Too many requests. Please try again later."
})
