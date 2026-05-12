import axios from "axios"

const FEED_CACHE_TTL_MS = 6 * 60 * 60 * 1000
const feedCache = new Map()

function cleanText(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim()
}

function decodeXmlEntities(value = "") {
  return String(value || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
}

function extractTag(block, tag) {
  const pattern = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i")
  const match = String(block || "").match(pattern)
  return match ? match[1] : ""
}

function extractAttr(block, tag, attr) {
  const pattern = new RegExp(`<${tag}\\b[^>]*\\b${attr}="([^"]+)"`, "i")
  const match = String(block || "").match(pattern)
  return match ? match[1] : ""
}

function extractChannelAuthor(xml) {
  const authorMatch = String(xml || "").match(/<author>\s*([\s\S]*?)<\/author>/i)
  if (!authorMatch) return ""
  const nameMatch = authorMatch[1].match(/<name>([\s\S]*?)<\/name>/i)
  return decodeXmlEntities(cleanText(nameMatch ? nameMatch[1] : ""))
}

function normalizePlaylistId(value) {
  return cleanText(value).replace(/[^a-zA-Z0-9_-]/g, "")
}

export async function resolveYouTubePlaylistFeed(playlistId) {
  const normalizedPlaylistId = normalizePlaylistId(playlistId)
  if (!normalizedPlaylistId) {
    throw new Error("Invalid YouTube playlist id")
  }

  const cached = feedCache.get(normalizedPlaylistId)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data
  }

  const response = await axios.get("https://www.youtube.com/feeds/videos.xml", {
    params: { playlist_id: normalizedPlaylistId },
    timeout: 20000,
    responseType: "text",
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8"
    }
  })

  const xml = String(response.data || "")
  if (!xml.includes("<feed")) {
    throw new Error("Unable to load YouTube playlist feed")
  }

  const feedTitle = decodeXmlEntities(cleanText(extractTag(xml, "title")))
  const feedDescription = decodeXmlEntities(cleanText(extractTag(xml, "media:description")))
  const channelTitle = extractChannelAuthor(xml)

  const videos = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi
  let entryMatch
  while ((entryMatch = entryRegex.exec(xml))) {
    const entry = entryMatch[1]
    const videoId = cleanText(extractTag(entry, "yt:videoId"))
    if (!videoId) continue

    const title = decodeXmlEntities(cleanText(extractTag(entry, "title")))
    const thumbnail =
      extractAttr(entry, "media:thumbnail", "url") ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

    videos.push({
      title,
      videoId,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail,
      duration: ""
    })
  }

  const data = {
    playlistId: normalizedPlaylistId,
    title: feedTitle || channelTitle || "YouTube Playlist",
    description: feedDescription || "",
    channelTitle,
    videos
  }

  feedCache.set(normalizedPlaylistId, {
    expiresAt: Date.now() + FEED_CACHE_TTL_MS,
    data
  })

  return data
}
