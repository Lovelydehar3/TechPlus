const cleanEnv = (value) =>
  String(value || "")
    .replace(/\\n|\\r/g, "")
    .replace(/\r|\n/g, "")
    .trim()
    .replace(/^"|"$/g, "");

export const normalizeAdminEmail = (value) =>
  String(value || "").trim().toLowerCase();

/** Comma-separated list in ADMIN_EMAILS — always granted admin on login/session. */
export function getAdminEmailSet() {
  const raw = cleanEnv(process.env.ADMIN_EMAILS);
  const defaults = ["karansharma202005@gmail.com", "lovepreetsingh73437@gmail.com"];
  const fromEnv = raw
    ? raw.split(",").map(normalizeAdminEmail).filter(Boolean)
    : [];
  return new Set([...defaults, ...fromEnv]);
}

export function isConfiguredAdminEmail(email) {
  const normalized = normalizeAdminEmail(email);
  if (!normalized) return false;
  return getAdminEmailSet().has(normalized);
}

/** Persist admin role when email is in ADMIN_EMAILS (or default list). */
export async function ensureAdminRoleForUser(user) {
  if (!user?.email) return user;
  if (!isConfiguredAdminEmail(user.email)) return user;
  if (user.role === "admin") return user;

  user.role = "admin";
  await user.save();
  return user;
}
