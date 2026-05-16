import axios from "axios";
import { Hackathon } from "../models/hackathonModel.js";

const IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80";

const DEVFOLIO_API_URL = "https://api.devfolio.co/api/hackathons";
const DEVPOST_API_URL = "https://devpost.com/api/hackathons";

const DEVPOST_STATUSES = ["open", "upcoming"];
const TRACKED_PLATFORMS = ["Devfolio", "Devpost", "MLH"];
const COLLEGE_PLATFORM = "Manual";
const PLATFORM_RANK = {
  Devfolio: 3,
  Devpost: 2,
  MLH: 1
};

const PUNJAB_CITY_HINTS = [
  "jalandhar",
  "patiala",
  "ludhiana",
  "amritsar",
  "mohali",
  "sahibzada ajit singh nagar",
  "bathinda",
  "hoshiarpur",
  "pathankot",
  "moga",
  "barnala",
  "rupnagar",
  "sangrur",
  "fazilka",
  "faridkot",
  "kapurthala",
  "malerkotla",
  "muktsar",
  "firozpur",
  "ferozepur",
  "phagwara",
  "khanna",
  "nabha",
  "raikot",
  "sunam",
  "kotkapura",
  "chandigarh"
];

const GENERIC_TAGS = new Set([
  "no restrictions",
  "general",
  "others",
  "other",
  "hackathon",
  "hackathons"
]);

const ORGANIZER_PATTERNS = [
  /organized by ([^.]+?)(?:[.;\n]|$)/i,
  /hosted by ([^.]+?)(?:[.;\n]|$)/i,
  /organized under ([^.]+?)(?:[.;\n]|$)/i,
  /flagship hackathon of ([^.]+?)(?:[.;\n]|$)/i,
  /hackathon hosted by ([^.]+?)(?:[.;\n]|$)/i
];

const DEFAULT_DEVFOLIO_MAX_PAGES = 4;
const DEFAULT_DEVPOST_MAX_PAGES = 8;
const DEFAULT_MAX_RESULTS = 80;

let syncPromise = null;

const clean = (value) =>
  String(value || "")
    .trim()
    .replace(/^"|"$/g, "");

function getRequestHeaders() {
  return {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    Accept: "application/json, text/html;q=0.9,*/*;q=0.8"
  };
}

function getNumberEnv(name, fallback) {
  const parsed = Number(clean(process.env[name]));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeTitleKey(title) {
  return clean(title).toLowerCase().replace(/\s+/g, " ");
}

function dateKeyFromDate(value) {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function stripMarkdown(text) {
  return clean(text)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(text) {
  return clean(text)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeThemes(themes) {
  const tags = [];

  for (const theme of themes || []) {
    const name = clean(theme?.theme?.name || theme?.name || theme);
    if (!name || GENERIC_TAGS.has(name.toLowerCase())) continue;
    tags.push(name);
  }

  return tags;
}

function formatPrize(value, currency) {
  if (value === null || value === undefined || value === "") return "";

  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return currency ? `${currency} ${clean(value)}` : clean(value);
  }

  const amountText = amount.toLocaleString("en-US");

  if (!currency) return amountText;
  if (currency === "USD") return `$${amountText}`;
  if (currency === "INR") return `INR ${amount.toLocaleString("en-IN")}`;

  return `${currency} ${amountText}`;
}

function safeDate(value) {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function inferMode(modeValue, locationText) {
  const mode = clean(modeValue);
  if (mode) return mode;

  const loc = clean(locationText).toLowerCase();
  if (loc.includes("online") || loc.includes("virtual") || loc.includes("worldwide")) {
    return "Online";
  }

  return "Offline";
}

function resolveState(locationText, cityText, descText, explicitState = "") {
  const explicit = clean(explicitState);
  if (explicit) return explicit;

  const haystack = [locationText, cityText, descText].map(clean).join(" ").toLowerCase();

  if (haystack.includes("punjab") || PUNJAB_CITY_HINTS.some((hint) => haystack.includes(hint))) {
    return "Punjab";
  }

  if (haystack.includes("chandigarh")) {
    return "Chandigarh";
  }

  return "";
}

function isPunjabRelated(hackathon) {
  const text = [
    hackathon?.state,
    hackathon?.city,
    hackathon?.location,
    hackathon?.title,
    ...(hackathon?.tags || [])
  ]
    .map(clean)
    .join(" ")
    .toLowerCase();

  return text.includes("punjab") || PUNJAB_CITY_HINTS.some((hint) => text.includes(hint));
}

function isUpcoming(startDate, endDate, now = new Date()) {
  const start = safeDate(startDate);
  const end = safeDate(endDate) || start;
  if (!start || !end) return false;
  return end.getTime() >= now.getTime();
}

function extractOrganizerFromDescription(description, fallback) {
  const desc = clean(description);

  for (const pattern of ORGANIZER_PATTERNS) {
    const match = desc.match(pattern);
    if (match?.[1]) return clean(match[1]);
  }

  return clean(fallback) || "Community";
}

function buildTags({ themes = [], text = "", state = "", platform = "" }) {
  const tags = new Set([...normalizeThemes(themes)]);
  const lowerText = clean(text).toLowerCase();

  if (/(artificial intelligence|\bai\b|genai|llm|machine learning|\bml\b)/i.test(lowerText)) {
    tags.add("AI");
  }
  if (/machine learning|\bml\b/i.test(lowerText)) {
    tags.add("Machine Learning");
  }
  if (/cloud/i.test(lowerText)) {
    tags.add("Cloud");
  }
  if (/cyber|security|secure/i.test(lowerText)) {
    tags.add("Cybersecurity");
  }
  if (/blockchain|web3|crypto|defi/i.test(lowerText)) {
    tags.add("Blockchain");
  }
  if (/data science|analytics|\bdata\b/i.test(lowerText)) {
    tags.add("Data Science");
  }
  if (/android|ios|flutter|react native|mobile/i.test(lowerText)) {
    tags.add("Mobile");
  }
  if (/ui\/ux|user experience|design/i.test(lowerText)) {
    tags.add("UI/UX");
  }
  if (/frontend|back ?end|full stack|node\.?js|react|next\.?js|web/i.test(lowerText)) {
    tags.add("Web");
  }
  if (state === "Punjab") {
    tags.add("Punjab");
  }
  if (platform) {
    tags.add(platform);
  }

  return [...tags].slice(0, 8);
}

function computeQualityScore(hackathon) {
  let score = 0;
  if (isPunjabRelated(hackathon)) score += 100;
  if (clean(hackathon?.prize)) score += 5;
  if (clean(hackathon?.registrationLink)) score += 3;
  if (clean(hackathon?.image) && clean(hackathon.image) !== IMAGE_FALLBACK) score += 2;
  score += Math.min(Number(hackathon?.participants || 0) / 200, 8);
  score += PLATFORM_RANK[hackathon?.sourcePlatform] || 0;
  return score;
}

function normalizeForStorage(raw) {
  const title = clean(raw?.title);
  const sourceKey = clean(raw?.sourceKey);
  const startDate = safeDate(raw?.startDate);
  const endDate = safeDate(raw?.endDate) || startDate;

  if (!title || !sourceKey || !startDate || !endDate) return null;
  if (endDate.getTime() < Date.now()) return null;

  return {
    sourceKey,
    sourcePlatform: clean(raw?.sourcePlatform) || "Other",
    sourceUrl: clean(raw?.sourceUrl) || undefined,
    externalId: clean(raw?.externalId) || undefined,
    title,
    titleKey: normalizeTitleKey(title),
    dateKey: dateKeyFromDate(startDate),
    description: clean(raw?.description) || title,
    platform: clean(raw?.platform) || clean(raw?.sourcePlatform) || "Other",
    mode: inferMode(raw?.mode, raw?.location),
    country: clean(raw?.country),
    state: clean(raw?.state) || undefined,
    city: clean(raw?.city) || undefined,
    location: clean(raw?.location) || "Online",
    organizer: clean(raw?.organizer) || "Community",
    startDate,
    endDate,
    prize: clean(raw?.prize) || "",
    tags: Array.isArray(raw?.tags) ? raw.tags.slice(0, 8) : [],
    registrationLink: clean(raw?.registrationLink) || clean(raw?.sourceUrl) || undefined,
    image: clean(raw?.image) || IMAGE_FALLBACK,
    participants: Number(raw?.participants || 0) || 0
  };
}

function decodeHtmlEntities(text) {
  return String(text || "")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/");
}

function normalizeDevfolioHackathon(item) {
  const slug = clean(item?.slug);
  const title = clean(item?.name);
  const startDate = safeDate(item?.starts_at);
  const endDate = safeDate(item?.ends_at) || startDate;

  if (!slug || !title || !startDate || !endDate) return null;
  if (item?.private === true) return null;

  const location = clean(item?.location || (item?.is_online ? "Online" : "Offline"));
  const city = clean(item?.city);
  const state = resolveState(location, city, item?.desc || item?.tagline || title, item?.state);
  const country = clean(item?.country);
  const desc = stripMarkdown(item?.desc || item?.tagline || title);

  const totalPrize = Array.isArray(item?.prizes)
    ? item.prizes.find((prize) => /total/i.test(clean(prize?.name))) || item.prizes[0]
    : null;

  const prize = totalPrize
    ? formatPrize(totalPrize?.amount, clean(totalPrize?.currency))
    : "";

  const organizerFallback =
    clean(item?.hackathon_brand?.name) ||
    clean(item?.hackathon_setting?.name) ||
    "Devfolio Community";

  const sourceUrl = `https://${slug}.devfolio.co/overview`;

  return normalizeForStorage({
    sourceKey: `devfolio:${slug}`,
    sourcePlatform: "Devfolio",
    sourceUrl,
    externalId: clean(item?.uuid) || slug,
    title,
    description: desc,
    platform: "Devfolio",
    mode: item?.is_online ? "Online" : "Offline",
    country,
    state,
    city,
    location,
    organizer: extractOrganizerFromDescription(desc, organizerFallback),
    startDate,
    endDate,
    prize,
    tags: buildTags({
      themes: item?.themes || [],
      text: [title, item?.tagline, item?.desc, location, city, country, state].join(" "),
      state,
      platform: "Devfolio"
    }),
    registrationLink: sourceUrl,
    image: clean(item?.cover_img) || IMAGE_FALLBACK,
    participants: Number(item?.participants_count || 0) || 0
  });
}

async function fetchDevfolioHackathons() {
  const maxPages = getNumberEnv("HACKATHON_DEVFOLIO_MAX_PAGES", DEFAULT_DEVFOLIO_MAX_PAGES);
  const now = new Date();
  const normalized = [];

  for (let page = 1; page <= maxPages; page += 1) {
    let items = [];

    try {
      const response = await axios.get(DEVFOLIO_API_URL, {
        params: { page },
        timeout: 25000,
        headers: getRequestHeaders()
      });

      items = Array.isArray(response?.data?.result) ? response.data.result : [];
    } catch {
      break;
    }

    if (!items.length) break;

    for (const item of items) {
      const normalizedItem = normalizeDevfolioHackathon(item);
      if (!normalizedItem) continue;
      if (!isUpcoming(normalizedItem.startDate, normalizedItem.endDate, now)) continue;
      normalized.push(normalizedItem);
    }

    if (items.length < 20) break;
  }

  return normalized;
}

function parseDevpostDates(rangeText) {
  const cleaned = clean(rangeText).replace(/\s+/g, " ");
  if (!cleaned) return { startDate: null, endDate: null };

  const single = cleaned.match(/^([A-Za-z]{3,9}\s+\d{1,2}),\s*(\d{4})$/);
  if (single) {
    const date = safeDate(`${single[1]}, ${single[2]} 00:00:00 UTC`);
    if (!date) return { startDate: null, endDate: null };

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    return { startDate: date, endDate };
  }

  const withYear = cleaned.match(
    /^([A-Za-z]{3,9}\s+\d{1,2})\s*-\s*([A-Za-z]{3,9}\s+\d{1,2}),\s*(\d{4})$/
  );

  if (withYear) {
    const startPart = withYear[1];
    const endPart = withYear[2];
    const endYear = Number(withYear[3]);

    const startRaw = safeDate(`${startPart}, ${endYear} 00:00:00 UTC`);
    const endRaw = safeDate(`${endPart}, ${endYear} 23:59:59 UTC`);

    if (!startRaw || !endRaw) return { startDate: null, endDate: null };

    if (startRaw.getTime() > endRaw.getTime()) {
      const adjustedStart = safeDate(`${startPart}, ${endYear - 1} 00:00:00 UTC`);
      if (adjustedStart) {
        return {
          startDate: adjustedStart,
          endDate: endRaw
        };
      }
    }

    return {
      startDate: startRaw,
      endDate: endRaw
    };
  }

  return { startDate: null, endDate: null };
}

function normalizeDevpostHackathon(item) {
  const id = clean(item?.id);
  const title = clean(item?.title);
  const sourceUrl = clean(item?.url);
  const location = clean(item?.displayed_location?.location || "Online");

  if (!id || !title || !sourceUrl) return null;

  const { startDate, endDate } = parseDevpostDates(item?.submission_period_dates);
  if (!startDate || !endDate) return null;

  const state = resolveState(location, "", title);
  const country = /india|punjab|chandigarh/i.test(location) ? "India" : "";
  const desc = stripMarkdown(`${title}. ${clean(item?.time_left_to_submission)}`);

  const openState = clean(item?.open_state).toLowerCase();
  const mode = /online/i.test(location) || clean(item?.displayed_location?.icon) === "globe"
    ? "Online"
    : "Offline";

  const prize = stripHtml(item?.prize_amount);
  const image = clean(item?.thumbnail_url).startsWith("//")
    ? `https:${clean(item.thumbnail_url)}`
    : clean(item?.thumbnail_url);

  return normalizeForStorage({
    sourceKey: `devpost:${id}`,
    sourcePlatform: "Devpost",
    sourceUrl,
    externalId: id,
    title,
    description: desc,
    platform: "Devpost",
    mode,
    country,
    state,
    city: "",
    location,
    organizer: clean(item?.organization_name) || "Devpost Community",
    startDate,
    endDate,
    prize,
    tags: buildTags({
      themes: item?.themes || [],
      text: [title, location, openState].join(" "),
      state,
      platform: "Devpost"
    }),
    registrationLink: clean(item?.start_a_submission_url) || sourceUrl,
    image: image || IMAGE_FALLBACK,
    participants: Number(item?.registrations_count || 0) || 0
  });
}

async function fetchDevpostByStatus(status) {
  const maxPages = getNumberEnv("HACKATHON_DEVPOST_MAX_PAGES", DEFAULT_DEVPOST_MAX_PAGES);
  const normalized = [];

  for (let page = 1; page <= maxPages; page += 1) {
    let payload = null;

    try {
      const response = await axios.get(DEVPOST_API_URL, {
        params: { status, page },
        timeout: 25000,
        headers: getRequestHeaders()
      });

      payload = response?.data;
    } catch {
      break;
    }

    const items = Array.isArray(payload?.hackathons) ? payload.hackathons : [];
    if (!items.length) break;

    for (const item of items) {
      const normalizedItem = normalizeDevpostHackathon(item);
      if (!normalizedItem) continue;
      normalized.push(normalizedItem);
    }

    const totalCount = Number(payload?.meta?.total_count || 0);
    const perPage = Number(payload?.meta?.per_page || items.length);

    if (totalCount > 0 && perPage > 0 && page * perPage >= totalCount) {
      break;
    }
  }

  return normalized;
}

async function fetchDevpostHackathons() {
  const results = await Promise.allSettled(DEVPOST_STATUSES.map((status) => fetchDevpostByStatus(status)));

  const all = [];
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    all.push(...result.value);
  }

  const now = new Date();
  return all.filter((item) => isUpcoming(item.startDate, item.endDate, now));
}

function extractMlhDataPageJson(html) {
  const match = String(html || "").match(/<div id="app" data-page="([\s\S]*?)">/i);
  if (!match?.[1]) return null;

  try {
    const decoded = decodeHtmlEntities(match[1]);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function getMlhSeasons() {
  const fromEnv = clean(process.env.MLH_SEASONS)
    .split(/[\n,]+/)
    .map((year) => clean(year))
    .filter(Boolean);

  if (fromEnv.length) {
    return [...new Set(fromEnv)];
  }

  const year = new Date().getUTCFullYear();
  return [`${year}`, `${year + 1}`];
}

function normalizeMlhHackathon(item, season) {
  const id = clean(item?.id || item?.slug);
  const title = clean(item?.name);
  const relativeUrl = clean(item?.url);

  if (!id || !title || !relativeUrl) return null;

  const startDate = safeDate(item?.startsAt);
  const endDate = safeDate(item?.endsAt);
  if (!startDate || !endDate) return null;

  const location = clean(item?.location || "Online");
  const venue = item?.venueAddress || {};
  const city = clean(venue?.city);
  const explicitState = clean(venue?.state);
  const countryCode = clean(venue?.country).toUpperCase();

  const country = countryCode === "IN" ? "India" : "";
  const state = resolveState(location, city, title, explicitState);
  const mode = clean(item?.formatType).toLowerCase() === "digital" ? "Online" : "Offline";

  const sourceUrl = relativeUrl.startsWith("http")
    ? relativeUrl
    : `https://www.mlh.com${relativeUrl}`;

  return normalizeForStorage({
    sourceKey: `mlh:${id}`,
    sourcePlatform: "MLH",
    sourceUrl,
    externalId: id,
    title,
    description: stripMarkdown(`${title}. ${clean(item?.dateRange)}.`),
    platform: "MLH",
    mode,
    country,
    state,
    city,
    location,
    organizer: "Major League Hacking",
    startDate,
    endDate,
    prize: "",
    tags: buildTags({
      text: `${title} ${location} ${season} MLH`,
      state,
      platform: "MLH"
    }),
    registrationLink: clean(item?.websiteUrl) || sourceUrl,
    image: clean(item?.backgroundUrl || item?.logoUrl) || IMAGE_FALLBACK,
    participants: 0
  });
}

async function fetchMlhSeasonHackathons(season) {
  const url = `https://www.mlh.com/seasons/${season}/events`;

  const response = await axios.get(url, {
    timeout: 25000,
    headers: getRequestHeaders()
  });

  const parsed = extractMlhDataPageJson(response.data);
  const upcomingEvents = parsed?.props?.upcomingEvents;

  if (!Array.isArray(upcomingEvents)) return [];

  const normalized = [];
  for (const item of upcomingEvents) {
    const normalizedItem = normalizeMlhHackathon(item, season);
    if (normalizedItem) normalized.push(normalizedItem);
  }

  return normalized;
}

async function fetchMlhHackathons() {
  const seasons = getMlhSeasons();
  const results = await Promise.allSettled(seasons.map((season) => fetchMlhSeasonHackathons(season)));

  const all = [];
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    all.push(...result.value);
  }

  const now = new Date();
  return all.filter((item) => isUpcoming(item.startDate, item.endDate, now));
}

function mergeAndDedupe(hackathons) {
  const bySourceKey = new Map();

  for (const item of hackathons) {
    if (!item?.sourceKey) continue;
    const existing = bySourceKey.get(item.sourceKey);
    if (!existing) {
      bySourceKey.set(item.sourceKey, item);
      continue;
    }

    if (computeQualityScore(item) > computeQualityScore(existing)) {
      bySourceKey.set(item.sourceKey, item);
    }
  }

  const byTitleDate = new Map();
  for (const item of bySourceKey.values()) {
    const key = `${item.titleKey || normalizeTitleKey(item.title)}|${item.dateKey || dateKeyFromDate(item.startDate)}`;
    const existing = byTitleDate.get(key);

    if (!existing || computeQualityScore(item) > computeQualityScore(existing)) {
      byTitleDate.set(key, item);
    }
  }

  return [...byTitleDate.values()];
}

async function removeDuplicateHackathonsByKey() {
  const docs = await Hackathon.find({
    sourcePlatform: { $in: TRACKED_PLATFORMS }
  })
    .select("_id sourceKey titleKey dateKey title")
    .lean();

  const seen = new Map();
  const duplicates = [];

  for (const doc of docs) {
    const key =
      clean(doc.sourceKey) ||
      (doc.titleKey && doc.dateKey ? `${doc.titleKey}|${doc.dateKey}` : normalizeTitleKey(doc.title));

    if (!key) continue;

    if (seen.has(key)) {
      duplicates.push(doc._id);
      continue;
    }

    seen.set(key, doc._id);
  }

  if (duplicates.length) {
    await Hackathon.deleteMany({ _id: { $in: duplicates } });
  }
}

async function runHackathonSync() {
  const results = await Promise.allSettled([
    fetchDevfolioHackathons(),
    fetchDevpostHackathons(),
    fetchMlhHackathons()
  ]);

  const live = mergeAndDedupe(
    results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value)
      .filter(Boolean)
  );

  if (!live.length) {
    return {
      error: "No live hackathons received from configured sources",
      createdCount: 0,
      skipped: 0,
      totalNormalized: 0
    };
  }

  let createdCount = 0;
  let skipped = 0;
  const now = new Date();

  for (const raw of live) {
    try {
      const result = await Hackathon.updateOne(
        { sourceKey: raw.sourceKey },
        {
          $set: {
            ...raw,
            updatedAt: now
          },
          $setOnInsert: {
            createdAt: now
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount === 1 || result.modifiedCount === 1) {
        createdCount += 1;
      } else {
        skipped += 1;
      }
    } catch {
      skipped += 1;
    }
  }

  await Hackathon.deleteMany({
    sourcePlatform: { $in: TRACKED_PLATFORMS },
    endDate: { $lt: now }
  });

  await removeDuplicateHackathonsByKey();

  return {
    createdCount,
    skipped,
    totalNormalized: live.length
  };
}

function queueHackathonSync() {
  if (syncPromise) return syncPromise;

  syncPromise = runHackathonSync()
    .catch((error) => ({
      error: error?.message || "Hackathon sync failed",
      createdCount: 0,
      skipped: 0,
      totalNormalized: 0
    }))
    .finally(() => {
      syncPromise = null;
    });

  return syncPromise;
}

export const computeKeys = (title, startDate) => ({
  titleKey: normalizeTitleKey(title),
  dateKey: dateKeyFromDate(startDate)
});

export const syncHackathonsFromAPI = async () => queueHackathonSync();

function pickBestForDisplay(a, b) {
  const aScore = computeQualityScore(a);
  const bScore = computeQualityScore(b);
  if (bScore > aScore) return b;
  return a;
}

function dedupeResponseDocs(docs) {
  const map = new Map();

  for (const hackathon of docs) {
    const key =
      clean(hackathon.titleKey) && clean(hackathon.dateKey)
        ? `${clean(hackathon.titleKey)}|${clean(hackathon.dateKey)}`
        : clean(hackathon.sourceKey) || clean(hackathon.sourceUrl) || normalizeTitleKey(hackathon.title);

    if (!map.has(key)) {
      map.set(key, hackathon);
      continue;
    }

    map.set(key, pickBestForDisplay(map.get(key), hackathon));
  }

  return [...map.values()];
}

function applyHackathonFilters(query, filters) {
  if (filters.mode && filters.mode !== "All") {
    query.mode = filters.mode;
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
      { organizer: { $regex: filters.search, $options: "i" } },
      { location: { $regex: filters.search, $options: "i" } },
      { city: { $regex: filters.search, $options: "i" } },
      { state: { $regex: filters.search, $options: "i" } },
      { tags: { $in: [new RegExp(filters.search, "i")] } }
    ];
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  return query;
}

function withImageFallback(hackathon) {
  return {
    ...hackathon,
    image:
      hackathon.image && String(hackathon.image).trim() ? hackathon.image : IMAGE_FALLBACK
  };
}

const HACKATHON_SELECT =
  "sourceKey sourcePlatform sourceUrl externalId title description platform mode country state city location organizer startDate endDate prize tags registrationLink image time isCollegeFeatured participants titleKey dateKey";

async function fetchCollegeHackathons(filters = {}) {
  const query = applyHackathonFilters(
    {
      sourcePlatform: COLLEGE_PLATFORM,
      isCollegeFeatured: true,
      endDate: { $gte: new Date() }
    },
    filters
  );

  const docs = await Hackathon.find(query)
    .select(HACKATHON_SELECT)
    .sort({ startDate: 1, title: 1 })
    .lean();

  return docs.map(withImageFallback);
}

function buildCollegeSourceKey(title, startDate) {
  const titleKey = normalizeTitleKey(title);
  const dateKey = dateKeyFromDate(startDate) || String(Date.now());
  return `college-${titleKey}-${dateKey}`;
}

function parseTagsInput(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => clean(tag)).filter(Boolean);
  }
  return String(tags || "")
    .split(",")
    .map((tag) => clean(tag))
    .filter(Boolean);
}

export const getAdminCollegeHackathons = async () => {
  const docs = await Hackathon.find({
    sourcePlatform: COLLEGE_PLATFORM,
    isCollegeFeatured: true
  })
    .select(HACKATHON_SELECT)
    .sort({ startDate: -1, createdAt: -1 })
    .lean();

  return docs.map(withImageFallback);
};

export const createCollegeHackathon = async (payload = {}) => {
  const title = clean(payload.title);
  if (!title) throw new Error("Title is required");

  const startDate = payload.startDate ? new Date(payload.startDate) : null;
  const endDate = payload.endDate ? new Date(payload.endDate) : null;
  if (!startDate || Number.isNaN(startDate.getTime())) {
    throw new Error("Valid start date is required");
  }
  if (!endDate || Number.isNaN(endDate.getTime())) {
    throw new Error("Valid end date is required");
  }
  if (endDate < startDate) {
    throw new Error("End date must be after start date");
  }

  const keys = computeKeys(title, startDate);
  const sourceKey = buildCollegeSourceKey(title, startDate);

  const hackathon = await Hackathon.create({
    sourceKey,
    sourcePlatform: COLLEGE_PLATFORM,
    platform: COLLEGE_PLATFORM,
    title,
    description: clean(payload.description),
    image: clean(payload.image),
    location: clean(payload.location),
    organizer: clean(payload.organizer),
    mode: payload.mode || "Online",
    startDate,
    endDate,
    time: clean(payload.time),
    registrationLink: clean(payload.registrationLink),
    prize: clean(payload.prize),
    tags: parseTagsInput(payload.tags),
    isCollegeFeatured: true,
    titleKey: keys.titleKey,
    dateKey: keys.dateKey
  });

  return withImageFallback(hackathon.toObject());
};

export const updateCollegeHackathon = async (id, payload = {}) => {
  const existing = await Hackathon.findOne({
    _id: id,
    sourcePlatform: COLLEGE_PLATFORM,
    isCollegeFeatured: true
  });

  if (!existing) throw new Error("College hackathon not found");

  const title = clean(payload.title) || existing.title;
  const startDate = payload.startDate ? new Date(payload.startDate) : existing.startDate;
  const endDate = payload.endDate ? new Date(payload.endDate) : existing.endDate;

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error("Valid start and end dates are required");
  }
  if (endDate < startDate) {
    throw new Error("End date must be after start date");
  }

  const keys = computeKeys(title, startDate);

  existing.title = title;
  existing.description = clean(payload.description);
  existing.image = clean(payload.image);
  existing.location = clean(payload.location);
  existing.organizer = clean(payload.organizer);
  existing.mode = payload.mode || existing.mode;
  existing.startDate = startDate;
  existing.endDate = endDate;
  existing.time = clean(payload.time);
  existing.registrationLink = clean(payload.registrationLink);
  existing.prize = clean(payload.prize);
  existing.tags = parseTagsInput(payload.tags);
  existing.titleKey = keys.titleKey;
  existing.dateKey = keys.dateKey;
  existing.sourceKey = buildCollegeSourceKey(title, startDate);
  existing.updatedAt = new Date();

  await existing.save();
  return withImageFallback(existing.toObject());
};

export const deleteCollegeHackathon = async (id) => {
  const deleted = await Hackathon.findOneAndDelete({
    _id: id,
    sourcePlatform: COLLEGE_PLATFORM
  });

  if (!deleted) throw new Error("College hackathon not found");
  return { success: true };
};

export const getAllHackathons = async (filters = {}) => {
  try {
    const baseQuery = {
      sourcePlatform: { $in: TRACKED_PLATFORMS },
      endDate: { $gte: new Date() }
    };

    const liveCount = await Hackathon.countDocuments(baseQuery);
    if (!liveCount || filters.refresh) {
      await queueHackathonSync();
    }

    const query = applyHackathonFilters({ ...baseQuery }, filters);

    let collegeHackathons = await fetchCollegeHackathons(filters);

    let hackathons = await Hackathon.find(query)
      .select(HACKATHON_SELECT)
      .sort({ startDate: 1, title: 1 })
      .limit(500)
      .lean();

    hackathons = dedupeResponseDocs(hackathons).map(withImageFallback);

    hackathons.sort((a, b) => {
      const aPunjab = isPunjabRelated(a) ? 1 : 0;
      const bPunjab = isPunjabRelated(b) ? 1 : 0;
      if (aPunjab !== bPunjab) return bPunjab - aPunjab;
      return new Date(a.startDate) - new Date(b.startDate);
    });

    const maxResults = getNumberEnv("HACKATHON_MAX_RESULTS", DEFAULT_MAX_RESULTS);
    const globalLimit = Math.max(maxResults - collegeHackathons.length, 0);
    const merged = [...collegeHackathons, ...hackathons.slice(0, globalLimit)];
    return merged;
  } catch {
    return [];
  }
};

const ACTIVE_HACKATHON_QUERY = {
  $or: [
    { sourcePlatform: { $in: TRACKED_PLATFORMS }, endDate: { $gte: new Date() } },
    {
      sourcePlatform: COLLEGE_PLATFORM,
      isCollegeFeatured: true,
      endDate: { $gte: new Date() }
    }
  ]
};

export const getHackathonById = async (id) => {
  try {
    const hackathon = await Hackathon.findOne({
      _id: id,
      ...ACTIVE_HACKATHON_QUERY
    }).lean();

    if (hackathon && !(hackathon.image && String(hackathon.image).trim())) {
      hackathon.image = IMAGE_FALLBACK;
    }

    return hackathon;
  } catch {
    return null;
  }
};

export const bookmarkHackathon = async (userId, hackathonId) => {
  const hackathon = await Hackathon.findOne({
    _id: hackathonId,
    ...ACTIVE_HACKATHON_QUERY
  });

  if (!hackathon) throw new Error("Hackathon not found");

  if (hackathon.bookmarkedBy.some((bid) => bid.toString() === userId.toString())) {
    return { message: "Already bookmarked" };
  }

  await Hackathon.findByIdAndUpdate(
    hackathonId,
    { $push: { bookmarkedBy: userId } },
    { returnDocument: "after" }
  );

  return { success: true };
};

export const removeHackathonBookmark = async (userId, hackathonId) => {
  await Hackathon.findByIdAndUpdate(
    hackathonId,
    { $pull: { bookmarkedBy: userId } },
    { returnDocument: "after" }
  );

  return { success: true };
};

export const getUserBookmarkedHackathons = async (userId) => {
  try {
    const hackathons = await Hackathon.find({
      bookmarkedBy: userId,
      ...ACTIVE_HACKATHON_QUERY
    }).sort({
      startDate: 1
    });

    return hackathons.map((hackathon) => ({
      ...hackathon.toObject(),
      image:
        hackathon.image && String(hackathon.image).trim()
          ? hackathon.image
          : IMAGE_FALLBACK
    }));
  } catch {
    return [];
  }
};
