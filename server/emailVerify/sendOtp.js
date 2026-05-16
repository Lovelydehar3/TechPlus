import nodemailer from "nodemailer"
import crypto from "crypto"
import {
  getSmtpUser,
  getEmailPass,
  getRelaySecret,
  resolveRelayUrl,
  shouldUseRelay
} from "../utils/emailEnv.js"

export const generateOtp = () => crypto.randomInt(100000, 999999).toString()

const clean = (value) =>
  String(value || "")
    .replace(/\\n|\\r/g, "")
    .replace(/\r|\n/g, "")
    .trim()
    .replace(/^["']|["']$/g, "")

const isHttpUrl = (value) => /^https?:\/\/[^/\s]+/i.test(clean(value))

const resolveClientUrl = (overrideUrl) => {
  const override = clean(overrideUrl)
  if (isHttpUrl(override)) return override.replace(/\/$/, "")

  const clientUrl = clean(process.env.CLIENT_URL)
  if (isHttpUrl(clientUrl)) return clientUrl.replace(/\/$/, "")

  return "http://localhost:5173"
}

const relayTimeoutMs = () => {
  const parsed = Number(clean(process.env.EMAIL_TIMEOUT_MS))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15000
}

const sendViaRelay = async ({ to, subject, html }) => {
  const relayUrl = resolveRelayUrl()
  const relaySecret = getRelaySecret()
  const smtpUser = getSmtpUser()
  const smtpPass = getEmailPass()

  if (!relayUrl) {
    throw new Error("EMAIL_RELAY_URL or CLIENT_URL is not configured for email relay")
  }

  if (!relaySecret) {
    throw new Error("EMAIL_RELAY_SECRET is not configured for email relay")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), relayTimeoutMs())

  try {
    const res = await fetch(relayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-email-relay-secret": relaySecret
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        from: smtpUser,
        ...(smtpUser ? { smtpUser } : {}),
        ...(smtpPass ? { smtpPass } : {})
      }),
      signal: controller.signal
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`Relay returned ${res.status}: ${text || res.statusText}`)
    }
  } finally {
    clearTimeout(timeout)
  }
}

const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: getSmtpUser(),
      pass: getEmailPass()
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false
    }
  })

const sendMail = async ({ to, subject, html }) => {
  if (shouldUseRelay()) {
    await sendViaRelay({ to, subject, html })
    return
  }

  const transporter = createTransporter()
  try {
    await transporter.sendMail({
      from: getSmtpUser(),
      to,
      subject,
      html
    })
  } finally {
    try {
      transporter.close()
    } catch {
      // Ignore close errors after the send attempt finishes.
    }
  }
}

const deliverEmail = async (label, payload) => {
  try {
    await sendMail(payload)
    console.log(`[Email] ${label} sent to ${payload.to}`)
    return { ok: true }
  } catch (error) {
    const message = error?.name === "AbortError"
      ? "Email relay timed out"
      : (error?.message || "Email send failed")
    console.error(`[Email] ${label} failed for ${payload.to}:`, message)
    return { ok: false, error: message }
  }
}

export const sendOtpEmail = async (email, otp) =>
  deliverEmail("OTP", {
    to: email,
    subject: "Your OTP - TechPlus News",
    html: `
      <div style="font-family: Arial; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 500px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: #4F46E5;">Email Verification</h2>
          <p style="font-size: 16px; color: #666;">Your OTP is:</p>
          <h1 style="color: #4F46E5; letter-spacing: 8px; font-size: 32px;">${otp}</h1>
          <p style="color: #666;">Valid for <b>10 minutes</b> only.</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">If you did not request this OTP, please ignore this email.</p>
        </div>
      </div>
    `
  })

export const sendResetEmail = async (email, resetToken, clientUrlOverride = "") => {
  const resetLink = `${resolveClientUrl(clientUrlOverride)}/password-reset?token=${resetToken}`

  return deliverEmail("Password reset", {
    to: email,
    subject: "Password Reset - TechPlus News",
    html: `
      <div style="font-family: Arial; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 500px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #666;">Click the button below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          <p style="color: #666; margin-top: 20px;">Or copy this link in your browser:</p>
          <p style="color: #4F46E5; word-break: break-all;">${resetLink}</p>
          <p style="color: #666;">This link will expire in <b>30 minutes</b>.</p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">If you did not request this password reset, please ignore this email.</p>
        </div>
      </div>
    `
  })
}
