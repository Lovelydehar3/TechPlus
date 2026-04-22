import axios from "axios";
import { News } from "../models/newsModel.js";

const NEWS_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80";

/** Last successful live or DB-backed payload for memory fallback when APIs rate-limit */
let memoryNewsCache = [];

/** Avoid hammering third-party APIs on every HTTP request */
let lastLiveFetchAt = 0;
const NEWS_LIVE_COOLDOWN_MS = 12 * 60 * 1000;

function filterArticlesByCategory(articles, category) {
  if (!category || String(category).toLowerCase() === "all") {
    return articles;
  }
  return articles.filter(
    (a) => (a.category || "General") === category
  );
}

function dedupeByUrl(articles) {
  const seen = new Set();
  const out = [];
  for (const a of articles) {
    const u = a.url || `${a.title}-${a.publishedAt}`;
    if (seen.has(u)) continue;
    seen.add(u);
    out.push(a);
  }
  return out;
}

export const fetchGTechNews = async (query = "technology", page = 1) => {
  try {
    const response = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: query,
        page,
        max: 10,
        lang: "en",
        token: process.env.GNEWS_API_KEY
      },
      timeout: 8000
    });

    const articles = response.data.articles || [];

    return articles.map((article) => ({
      title: article.title,
      description: article.description,
      content: article.content || article.description,
      author: article.source?.name || "Unknown",
      source: {
        name: article.source?.name || "GNews",
        id: article.source?.name?.toLowerCase().replace(/\s+/g, "-")
      },
      image: article.image || NEWS_IMAGE_FALLBACK,
      url: article.url,
      category: categorizeNews(
        `${article.title} ${article.description || ""}`
      ),
      publishedAt: new Date(article.publishedAt),
      apiSource: "GNews"
    }));
  } catch {
    return [];
  }
};

export const fetchNewsAPI = async (category = "technology", page = 1) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        category,
        page,
        pageSize: 10,
        language: "en",
        apiKey: process.env.NEWSAPI_KEY
      },
      timeout: 8000
    });

    const articles = response.data.articles || [];

    return articles.map((article) => ({
      title: article.title,
      description: article.description,
      content: article.content || article.description,
      author: article.author || "Unknown",
      source: {
        name: article.source?.name || "NewsAPI",
        id: article.source?.id || ""
      },
      image: article.urlToImage || NEWS_IMAGE_FALLBACK,
      url: article.url,
      category: categorizeNews(
        `${article.title} ${article.description || ""}`
      ),
      publishedAt: new Date(article.publishedAt),
      apiSource: "NewsAPI"
    }));
  } catch {
    return [];
  }
};

function categorizeNews(text) {
  const lower = text.toLowerCase();

  if (lower.includes("c++") || lower.includes(" cpp") || lower.includes("cplusplus")) return "C++";
  if (lower.includes("node.js") || lower.includes("nodejs") || lower.includes(" express") || lower.includes("nestjs")) return "Node.js";
  if (lower.includes("react") && (lower.includes("node") || lower.includes("full stack") || lower.includes("fullstack"))) return "Full Stack";
  if (lower.includes("react")) return "React";
  if (lower.includes("full stack") || lower.includes("fullstack") || lower.includes("mern") || lower.includes("mean stack")) return "Full Stack";
  if (lower.includes("robot") || lower.includes("humanoid") || lower.includes("drone")) return "Robotics";
  if (lower.includes("machine learning") || lower.includes(" deep learning") || lower.includes("neural net") || lower.includes(" llm")) return "ML";
  if (lower.includes("artificial intelligence") || lower.includes("openai") || lower.includes("chatgpt") || lower.includes("generative ai") || lower.includes(" ai ")) return "AI";
  if (lower.includes("java ") || lower.includes(" spring") || lower.includes("kotlin")) return "Java";
  if (lower.includes("data analytic") || lower.includes("business intelligence") || lower.includes("bi ") || lower.includes("dashboard")) return "Data Analytics";
  if (lower.includes("javascript") || lower.includes("typescript") || lower.includes("frontend") || lower.includes("html") || lower.includes("css")) return "Web Development";
  if (lower.includes("security") || lower.includes("vulnerability") || lower.includes("cybersecurity") || lower.includes(" zero-day")) return "Cybersecurity";
  if (lower.includes("startup") || lower.includes("founder") || lower.includes("investor") || lower.includes("unicorn")) return "Startups";
  if (lower.includes("python") || lower.includes("golang") || lower.includes("rust") || lower.includes("programming language")) return "Programming";
  if (lower.includes("cloud") || lower.includes("aws") || lower.includes("kubernetes") || lower.includes("docker") || lower.includes("azure")) return "Cloud";
  if (lower.includes("big data") || lower.includes("data science") || lower.includes("database")) return "Data Science";
  if (lower.includes("data") && (lower.includes("analytic") || lower.includes("warehouse"))) return "Data Analytics";

  return "General";
}

export const cacheNewsInDB = async (articles) => {
  if (!articles?.length) return;
  try {
    for (const article of articles) {
      if (!article.url) continue;
      await News.findOneAndUpdate(
        { url: article.url },
        {
          $set: {
            ...article,
            image: article.image || NEWS_IMAGE_FALLBACK
          }
        },
        { upsert: true, returnDocument: "after" }
      );
    }
  } catch {
    /* non-fatal */
  }
};

export const getAllNews = async (category = null, limit = 20) => {
  try {
    const query = {};
    if (category && String(category).toLowerCase() !== "all") {
      query.category = category;
    }

    const articles = await News.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    return articles.map((a) => ({
      ...a,
      image: a.image || NEWS_IMAGE_FALLBACK
    }));
  } catch {
    return [];
  }
};

export const searchNews = async (searchQuery) => {
  try {
    const articles = await News.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } }
      ]
    })
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean();

    return articles.map((a) => ({
      ...a,
      image: a.image || NEWS_IMAGE_FALLBACK
    }));
  } catch {
    return [];
  }
};

async function fetchLiveNewsMerged() {
  const gNews = await fetchGTechNews("technology");
  const apiNews = await fetchNewsAPI("technology");
  const merged = dedupeByUrl([...gNews, ...apiNews]);
  return merged
    .filter((a) => a.title && a.url)
    .map((a) => ({
      ...a,
      image: a.image || NEWS_IMAGE_FALLBACK
    }));
}

/**
 * Primary resolver: live APIs (cooldown) → MongoDB cache → in-memory cache → empty + message
 */
export const getNewsWithFallback = async (category = null, limit = 40, forceLive = false) => {
  const normalizedCat =
    category && String(category).toLowerCase() !== "all"
      ? String(category)
      : null;

  const now = Date.now();
  const withinCooldown =
    !forceLive && now - lastLiveFetchAt < NEWS_LIVE_COOLDOWN_MS && memoryNewsCache.length >= 3;

  if (withinCooldown) {
    const pool = memoryNewsCache;
    const filtered = filterArticlesByCategory(pool, normalizedCat);
    if (filtered.length > 0) {
      return {
        articles: filtered.slice(0, limit),
        source: "memory",
        rateLimited: false,
        message: null,
        usedFallback: false
      };
    }
    /* Category may not exist in memory — continue to DB / live */
  }

  try {
    const live = await fetchLiveNewsMerged();

    if (live.length > 0) {
      lastLiveFetchAt = now;
      await cacheNewsInDB(live);
      memoryNewsCache = live.slice(0, 120);
      const filtered = filterArticlesByCategory(live, normalizedCat);
      return {
        articles: filtered.slice(0, limit),
        source: "live",
        rateLimited: false,
        message: null,
        usedFallback: false
      };
    }
  } catch {
    /* fall through to cache */
  }

  const dbArticles = await getAllNews(normalizedCat, limit * 2);
  if (dbArticles.length > 0) {
    memoryNewsCache = dbArticles.slice(0, 120);
    return {
      articles: dbArticles.slice(0, limit),
      source: "mongodb",
      rateLimited: true,
      message: null,
      usedFallback: true
    };
  }

  if (memoryNewsCache.length > 0) {
    const filtered = filterArticlesByCategory(memoryNewsCache, normalizedCat);
    if (filtered.length > 0) {
      return {
        articles: filtered.slice(0, limit),
        source: "memory",
        rateLimited: true,
        message: null,
        usedFallback: true
      };
    }
  }

  return {
    articles: [],
    source: "empty",
    rateLimited: true,
    message:
      "News temporarily unavailable due to API limit. Please try later.",
    usedFallback: false
  };
};

export const fetchAndCacheNews = async () => {
  try {
    const live = await fetchLiveNewsMerged();
    if (live.length > 0) {
      lastLiveFetchAt = Date.now();
      await cacheNewsInDB(live);
      memoryNewsCache = live.slice(0, 120);
    }
    return { success: true, total: live.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
