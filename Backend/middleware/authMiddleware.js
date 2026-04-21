import jwt from "jsonwebtoken"
import { jwtBlacklist } from "../server.js"

export const protect = (req, res, next) => {
  try {
    const headerToken = req.headers.authorization?.split(' ')[1] // "Bearer <token>"
    const cookieToken = req.cookies?.techplus_token
    const token = headerToken || cookieToken

    if (!token) {
      return res.status(401).json({ message: "Token required. Please login." })
    }

    // Check if token is blacklisted (logged out)
    if (jwtBlacklist.has(token)) {
      return res.status(401).json({ message: "Token has been revoked. Please login again." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired. Please login again." })
    }
    res.status(401).json({ message: "Invalid token" })
  }
}