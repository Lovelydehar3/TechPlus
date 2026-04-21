import express from "express"
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post('/register', register)                      // Public
router.post('/verify-otp', verifyOtp)                  // Public
router.post('/resend-otp', resendOtp)                  // Public
router.post('/login', login)                           // Public
router.post('/logout', protect, logout)                // Private
router.post('/forgot-password', forgotPassword)        // Public
router.post('/reset-password', resetPassword)          // Public

export default router