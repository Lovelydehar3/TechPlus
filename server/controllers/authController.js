import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import validator from "validator"
import crypto from "crypto"
import { User } from "../models/userModel.js"
import { generateOtp, sendOtpEmail, sendResetEmail } from "../emailVerify/sendOtp.js"
import { buildAuthCookieOptions } from "../utils/cookies.js"

const cleanEnv = (value) =>
  String(value || "")
    .replace(/\\n|\\r/g, "")
    .replace(/\r|\n/g, "")
    .trim()
    .replace(/^"|"$/g, "")

function hasEmailConfig() {
  return Boolean(cleanEnv(process.env.EMAIL) && cleanEnv(process.env.EMAIL_PASS))
}

const buildOtpDeliveryPayload = (emailResult, otp, skipVerification) => {
  if (skipVerification) return { emailDelivered: true }

  if (emailResult?.ok) {
    return { emailDelivered: true }
  }

  if (!hasEmailConfig()) {
    return { emailDelivered: false, devOtp: otp }
  }

  return {
    emailDelivered: false,
    emailError: emailResult?.error || "Email delivery failed"
  }
}

const isProduction = cleanEnv(process.env.NODE_ENV) === "production"
const emailVerificationDisabled = cleanEnv(process.env.DISABLE_EMAIL_VERIFICATION) === "true"

const normalizeEmail = (value) => String(value || "").trim().toLowerCase()
const normalizeUsername = (value) => String(value || "").trim()
const buildAuthUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  avatar: user.avatar || null,
  profileImage: user.profileImage || null,
  darkMode: Boolean(user.darkMode)
})

const issueAuthToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '72h' }
  )

// ================== REGISTER ==================
export const register = async (req, res) => {
  try {
    const username = normalizeUsername(req.body.username)
    const email = normalizeEmail(req.body.email)
    const { password, confirmPassword } = req.body

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long, contain uppercase, lowercase, a number and a special character"
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" })
    }

    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({ success: false, message: "Username must be 3-50 characters" })
    }

    const existingByEmail = await User.findOne({ email })
    const existingByUsername = await User.findOne({ username })

    if (existingByUsername && existingByUsername.email !== email) {
      if (!existingByUsername.isVerified) {
        await User.deleteOne({ _id: existingByUsername._id, isVerified: false })
      } else {
        return res.status(400).json({ success: false, message: "Username already taken" })
      }
    }

    if (existingByEmail?.isVerified) {
      return res.status(400).json({
        success: false,
        code: "EMAIL_ALREADY_REGISTERED",
        message: "Email already registered. Please log in or reset your password."
      })
    }

    // FIX #3: Check if email verification is disabled (emergency bypass)
    const skipVerification = emailVerificationDisabled

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = generateOtp()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 min

    // FIX #3: Handle existing unverified user — update and send OTP atomically
    if (existingByEmail && !existingByEmail.isVerified) {
      existingByEmail.username = username
      existingByEmail.password = hashedPassword
      existingByEmail.otp = otp
      existingByEmail.otpExpires = otpExpires

      // If verification is disabled, mark verified immediately
      if (skipVerification) {
        existingByEmail.isVerified = true
        existingByEmail.otp = null
        existingByEmail.otpExpires = null
      }

      await existingByEmail.save()

      let emailResult = { ok: true }
      if (!skipVerification && hasEmailConfig()) {
        emailResult = await sendOtpEmail(email, otp)
      }

      return res.status(200).json({
        success: true,
        message: skipVerification
          ? "Email verification bypassed. Account is ready."
          : emailResult.ok
            ? "New OTP sent. Please verify your email."
            : hasEmailConfig()
              ? "Account updated, but the OTP email could not be sent. Use Resend OTP."
              : "OTP regenerated in development mode.",
        ...buildOtpDeliveryPayload(emailResult, otp, skipVerification)
      })
    }

    // FIX #3: Create user FIRST, then send OTP. Don't rollback if OTP fails.
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      otp: skipVerification ? null : otp,
      otpExpires: skipVerification ? null : otpExpires,
      isVerified: skipVerification
    })

    let emailResult = { ok: true }
    if (!skipVerification && hasEmailConfig()) {
      emailResult = await sendOtpEmail(email, otp)
    }

    res.status(201).json({
      success: true,
      message: skipVerification
        ? "Account created successfully. You can now log in."
        : emailResult.ok
          ? "OTP sent to your email. Please verify."
          : hasEmailConfig()
            ? "Account created, but the OTP email could not be sent. Use Resend OTP."
            : "OTP generated in development mode.",
      ...buildOtpDeliveryPayload(emailResult, otp, skipVerification)
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== VERIFY OTP ==================
export const verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email)
    const { otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Already verified" })
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" })
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired. Request new one." })
    }

    user.isVerified = true
    user.otp = null
    user.otpExpires = null
    await user.save()

    const token = issueAuthToken(user)

    res.cookie('techplus_token', token, buildAuthCookieOptions())

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      token,
      user: buildAuthUser(user)
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== RESEND OTP ==================
export const resendOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email)

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    if (user.isVerified) return res.status(400).json({ success: false, message: "Already verified" })

    // FIX #3: If verification is disabled, auto-verify on resend
    if (emailVerificationDisabled) {
      user.isVerified = true
      user.otp = null
      user.otpExpires = null
      await user.save()
      return res.status(200).json({
        success: true,
        message: "Email verification bypassed. Account is now verified."
      })
    }

    const otp = generateOtp()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = otp
    user.otpExpires = otpExpires
    await user.save()

    let emailResult = { ok: true }
    if (hasEmailConfig()) {
      emailResult = await sendOtpEmail(email, otp)
    }

    res.status(200).json({
      success: true,
      message: emailResult.ok
        ? "New OTP sent!"
        : hasEmailConfig()
          ? "Could not send OTP email. Please try again in a moment."
          : "OTP regenerated in development mode.",
      ...buildOtpDeliveryPayload(emailResult, otp, false)
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== LOGIN ==================
export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email)
    const { password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        code: "WRONG_PASSWORD",
        message: "Wrong password"
      })
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "User already exists. Please verify your email. OTP sent.",
        requiresVerification: true,
        email: user.email
      })
    }

    const token = issueAuthToken(user)

    res.cookie('techplus_token', token, buildAuthCookieOptions())

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: buildAuthUser(user)
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== LOGOUT ==================
export const logout = async (req, res) => {
  try {
    res.clearCookie('techplus_token', buildAuthCookieOptions())

    res.status(200).json({ success: true, message: "Logged out successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== CURRENT SESSION ==================
export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('_id username email role isVerified avatar profileImage darkMode')
      .lean()

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.status(200).json({
      success: true,
      user: buildAuthUser(user)
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== FORGOT PASSWORD ==================
export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email)

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email. Please sign up first." })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000) // 30 min

    user.resetToken = resetToken
    user.resetTokenExpires = resetTokenExpires
    await user.save()

    console.log(`[Auth] ForgotPassword request for: ${email}. Email config: ${hasEmailConfig()}`)

    let emailResult = { ok: true }
    if (hasEmailConfig()) {
      const originFromClient = cleanEnv(req.body?.clientOrigin)
      const originFromHeader = cleanEnv(req.headers.origin)
      emailResult = await sendResetEmail(email, resetToken, originFromClient || originFromHeader)
    }

    res.status(200).json({
      success: true,
      message: emailResult.ok
        ? "Password reset email sent"
        : hasEmailConfig()
          ? "Reset link could not be emailed. Please try again shortly."
          : "Password reset token generated in development mode",
      ...(emailResult.ok && hasEmailConfig() ? { recipientHint: email, emailDelivered: true } : {}),
      ...(!emailResult.ok && hasEmailConfig()
        ? { emailDelivered: false, emailError: emailResult.error || "Email delivery failed" }
        : {}),
      ...(!hasEmailConfig() ? { devResetToken: resetToken, emailDelivered: false } : {})
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== RESET PASSWORD ==================
export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long, contain uppercase, lowercase, a number and a special character"
      })
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    })

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.isVerified = true
    user.otp = null
    user.otpExpires = null
    user.resetToken = null
    user.resetTokenExpires = null
    await user.save()

    res.status(200).json({ success: true, message: "Password reset successful. Please log in with your new password." })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
