import dns from "dns"
import nodemailer from "nodemailer"
import crypto from "crypto"

dns.setDefaultResultOrder?.("ipv4first")

export const generateOtp = () => crypto.randomInt(100000, 999999).toString()

const clean = (value) =>
  String(value || "")
    .replace(/\\n|\\r/g, "")
    .replace(/\r|\n/g, "")
    .trim()
    .replace(/^"|"$/g, "")

const isHttpUrl = (value) => /^https?:\/\/[^/\s]+/i.test(clean(value))
const EMAIL_TIMEOUT_MS = Number(clean(process.env.EMAIL_TIMEOUT_MS || process.env.EMAIL_STRATEGY_TIMEOUT_MS)) || 12000
const isProduction = clean(process.env.NODE_ENV) === "production"

const smtpUser = () => clean(process.env.EMAIL)
const smtpPass = () => clean(process.env.EMAIL_PASS)
const emailFrom = () => clean(process.env.EMAIL_FROM) || smtpUser()
const hasSmtpConfig = () => Boolean(smtpUser() && smtpPass())

const resolveClientUrl = (overrideUrl) => {
  const override = clean(overrideUrl)
  if (isHttpUrl(override)) return override.replace(/\/$/, "")

  const clientUrl = clean(process.env.CLIENT_URL)
  if (isHttpUrl(clientUrl)) return clientUrl.replace(/\/$/, "")

  return "http://localhost:5173"
}

const resolveRelayUrl = () => {
  const explicitRelay = clean(process.env.EMAIL_RELAY_URL)
  if (isHttpUrl(explicitRelay)) return explicitRelay

  const clientUrl = clean(process.env.CLIENT_URL)
  if (isHttpUrl(clientUrl)) return `${clientUrl.replace(/\/$/, "")}/api/send-email`

  return ""
}

const relaySecrets = () =>
  [clean(process.env.EMAIL_RELAY_SECRET), smtpPass()]
    .filter(Boolean)
    .filter((value, index, items) => items.indexOf(value) === index)

const readBooleanOverride = (value) => {
  const configured = clean(value).toLowerCase()
  if (["1", "true", "yes", "on"].includes(configured)) return true
  if (["0", "false", "no", "off"].includes(configured)) return false
  return null
}

const shouldForceRelay = () => {
  const configured = readBooleanOverride(process.env.EMAIL_FORCE_RELAY)
  if (configured !== null) return configured
  return isProduction && Boolean(resolveRelayUrl())
}

const toFriendlyEmailError = (error) => {
  const raw = `${error?.message || ""} ${error?.code || ""}`
  if (/relay authentication failed|Unauthorized email relay request/i.test(raw)) {
    return new Error("Email relay authentication failed. Check EMAIL_RELAY_SECRET on Render and Vercel.")
  }
  if (/relay is not configured|EMAIL_RELAY_URL/i.test(raw)) {
    return new Error("Email relay is not configured. Set EMAIL_RELAY_URL and EMAIL_RELAY_SECRET.")
  }
  if (/Invalid login|Username and Password not accepted|EAUTH/i.test(raw)) {
    return new Error("Email login failed. Check EMAIL and EMAIL_PASS app password.")
  }
  if (/timeout|ETIMEDOUT|ECONNECTION|ENETUNREACH|ECONNREFUSED|AbortError/i.test(raw)) {
    return new Error("Email service timeout. Please try again shortly.")
  }
  return new Error(error?.message || "Email service failed")
}

async function sendWithBrevo(mailOptions) {
  const apiKey = clean(process.env.BREVO_API_KEY)
  if (!apiKey) return null

  const sender = emailFrom()
  if (!sender) {
    throw new Error("EMAIL_FROM or EMAIL is required when using Brevo.")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS)

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        sender: { email: sender, name: "TechPlus" },
        to: [{ email: mailOptions.to }],
        subject: mailOptions.subject,
        htmlContent: mailOptions.html
      }),
      signal: controller.signal
    })

    const text = await response.text()
    let data = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = { message: text }
    }

    if (!response.ok) {
      throw new Error(data.message || `Brevo email failed with status ${response.status}`)
    }

    return data
  } finally {
    clearTimeout(timeout)
  }
}

async function sendWithHttpRelay(mailOptions) {
  const relayUrl = resolveRelayUrl()
  const secrets = relaySecrets()

  if (!relayUrl || secrets.length === 0) {
    return null
  }

  let lastError = null

  for (const relaySecret of secrets) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS)

    try {
      const response = await fetch(relayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-email-relay-secret": relaySecret
        },
        body: JSON.stringify({
          from: mailOptions.from,
          to: mailOptions.to,
          subject: mailOptions.subject,
          html: mailOptions.html,
          smtpUser: smtpUser(),
          smtpPass: smtpPass()
        }),
        signal: controller.signal
      })

      const text = await response.text()
      let data = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = { message: text }
      }

      if (!response.ok || data.success === false) {
        const relayError = new Error(data.message || `Email relay failed with status ${response.status}`)
        relayError.status = response.status
        throw relayError
      }

      return data
    } catch (error) {
      lastError = error?.name === "AbortError" ? new Error("Email relay timeout") : error
      if (Number(error?.status) === 401 && relaySecret !== secrets[secrets.length - 1]) {
        continue
      }
    } finally {
      clearTimeout(timeout)
    }
  }

  throw lastError || new Error("Email relay failed")
}

async function sendWithSmtp(mailOptions) {
  if (!hasSmtpConfig()) {
    throw new Error("SMTP email credentials are not configured.")
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: smtpUser(),
      pass: smtpPass()
    },
    connectionTimeout: EMAIL_TIMEOUT_MS,
    greetingTimeout: EMAIL_TIMEOUT_MS,
    socketTimeout: EMAIL_TIMEOUT_MS,
    family: 4,
    tls: {
      rejectUnauthorized: false,
      servername: "smtp.gmail.com"
    }
  })

  try {
    return await transporter.sendMail(mailOptions)
  } finally {
    try {
      transporter.close()
    } catch {
      // Ignore close errors after the send attempt finishes.
    }
  }
}

async function sendEmail(mailOptions) {
  const from = clean(mailOptions.from) || emailFrom()
  const payload = { ...mailOptions, from }
  const forceRelay = shouldForceRelay()
  let lastError = null

  try {
    const brevoResult = await sendWithBrevo(payload)
    if (brevoResult) return brevoResult
  } catch (error) {
    lastError = error
    if (clean(process.env.EMAIL_PROVIDER).toLowerCase() === "brevo") {
      throw toFriendlyEmailError(error)
    }
  }

  try {
    const relayResult = await sendWithHttpRelay(payload)
    if (relayResult) return relayResult
  } catch (error) {
    lastError = error
    if (forceRelay) throw toFriendlyEmailError(error)
  }

  if (forceRelay) {
    throw toFriendlyEmailError(lastError || new Error("Email relay is not configured. Set EMAIL_RELAY_URL and EMAIL_RELAY_SECRET."))
  }

  try {
    return await sendWithSmtp(payload)
  } catch (error) {
    throw toFriendlyEmailError(error)
  }
}

export const sendOtpEmail = async (email, otp) => {
  return sendEmail({
    from: emailFrom(),
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
}

export const sendResetEmail = async (email, resetToken, clientUrlOverride = "") => {
  const resetLink = `${resolveClientUrl(clientUrlOverride)}/password-reset?token=${resetToken}`

  return sendEmail({
    from: emailFrom(),
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
