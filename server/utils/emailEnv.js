const cleanEnv = (value) =>
  String(value || "")
    .replace(/\\n|\\r/g, "")
    .replace(/\r|\n/g, "")
    .trim()
    .replace(/^["']|["']$/g, "")

const isHttpUrl = (value) => /^https?:\/\/[^/\s]+/i.test(cleanEnv(value))

export const getSmtpUser = () =>
  cleanEnv(process.env.EMAIL) || cleanEnv(process.env.EMAIL_USER)

export const getEmailPass = () => cleanEnv(process.env.EMAIL_PASS)

export const hasSmtpCredentials = () =>
  Boolean(getSmtpUser() && getEmailPass())

export const resolveRelayUrl = () => {
  const explicitRelay = cleanEnv(process.env.EMAIL_RELAY_URL)
  if (isHttpUrl(explicitRelay)) return explicitRelay

  const clientUrl = cleanEnv(process.env.CLIENT_URL)
  if (isHttpUrl(clientUrl)) {
    return `${clientUrl.replace(/\/$/, "")}/api/send-email`
  }

  return ""
}

export const getRelaySecret = () =>
  cleanEnv(process.env.EMAIL_RELAY_SECRET) || cleanEnv(process.env.EMAIL_PASS)

export const shouldUseRelay = () => {
  const relayUrl = resolveRelayUrl()
  if (!relayUrl) return false

  const forceRelay =
    String(process.env.EMAIL_FORCE_RELAY || "").toLowerCase() === "true"

  if (forceRelay) return true
  return Boolean(getRelaySecret())
}

export const hasRelayConfig = () =>
  Boolean(resolveRelayUrl() && getRelaySecret())

/** True when the API should attempt to send mail (SMTP and/or Vercel relay). */
export const canSendEmail = () => hasSmtpCredentials() || hasRelayConfig()

/** Dev-only OTP/token in JSON responses. Never in production. */
export const shouldExposeDevEmailFallback = () =>
  cleanEnv(process.env.NODE_ENV) !== "production"

export const getEmailStatus = () => ({
  smtpConfigured: hasSmtpCredentials(),
  relayConfigured: hasRelayConfig(),
  relayForced:
    String(process.env.EMAIL_FORCE_RELAY || "").toLowerCase() === "true",
  relayUrl: resolveRelayUrl() || null,
  smtpUser: getSmtpUser()
    ? getSmtpUser().replace(/(.{2}).+(@.+)/, "$1***$2")
    : null,
  canSendEmail: canSendEmail()
})
