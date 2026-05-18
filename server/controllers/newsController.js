import {
  getNewsWithFallback,
  searchNews,
  fetchAndCacheNews,
  getNewsById
} from "../services/newsService.js";
import cacheService from "../services/cacheService.js";
import { News } from "../models/newsModel.js";
import { Bookmark } from "../models/bookmarkModel.js";
import { User } from "../models/userModel.js";

function parseCategory(category) {
  if (!category || String(category).toLowerCase() === "all") return null;
  return String(category);
}

export const getTechNews = async (req, res) => {
  try {
    const { category = null, refresh } = req.query;
    const forceLive = refresh === "1" || refresh === "true";
    const cat = parseCategory(category);
    
    // Use cache key based on category
    const cacheKey = `news-${cat || 'all'}`;
    
    // If forced refresh, skip cache
    let result;
    if (forceLive) {
      result = await getNewsWithFallback(cat, 40, forceLive);
      cacheService.set(cacheKey, result, 5 * 60 * 1000); // Cache for 5 mins
    } else {
      // Try cache first, fallback to fetch
      result = await cacheService.getOrCompute(
        cacheKey,
        () => getNewsWithFallback(cat, 40, false),
        5 * 60 * 1000 // 5 minutes TTL
      );
    }

    // Cache for 5 mins in browser, 30 mins in CDN
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=1800');

    res.status(200).json({
      success: true,
      source: result.source,
      total: result.articles.length,
      articles: result.articles,
      rateLimited: result.rateLimited,
      message: result.message,
      usedFallback: result.usedFallback
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      source: "empty",
      total: 0,
      articles: [],
      rateLimited: true,
      message:
        "News temporarily unavailable due to API limit. Please try later.",
      usedFallback: false
    });
  }
};

export const searchNewsArticles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters"
      });
    }

    const articles = await searchNews(q);

    res.status(200).json({
      success: true,
      total: articles.length,
      articles,
      query: q
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search news",
      error: error.message
    });
  }
};

export const refreshNewsCache = async (req, res) => {
  try {
    const result = await fetchAndCacheNews();

    res.status(200).json({
      success: true,
      message: "News cache refreshed",
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to refresh news cache",
      error: error.message
    });
  }
};

export const getGTechNews = async (req, res) => {
  try {
    const { query = "technology", page = 1, refresh } = req.query;
    const forceLive = refresh === "1" || refresh === "true";
    const result = await getNewsWithFallback(null, 40, forceLive);

    res.status(200).json({
      success: true,
      source: result.source,
      total: result.articles.length,
      articles: result.articles,
      rateLimited: result.rateLimited,
      message: result.message,
      usedFallback: result.usedFallback,
      query
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      source: "empty",
      total: 0,
      articles: [],
      rateLimited: true,
      message:
        "News temporarily unavailable due to API limit. Please try later."
    });
  }
};

export const getAllTechNews = async (req, res) => {
  try {
    const { page = 1, category = null, refresh, limit } = req.query;
    const normalized = parseCategory(category);
    const forceLive = refresh === "1" || refresh === "true";
    const pageSize = limit ? parseInt(limit, 10) : 12;
    const pageNum = parseInt(page, 10) || 1;
    const skip = Math.max(0, (pageNum - 1) * pageSize);

    const result = await getNewsWithFallback(normalized, pageSize * 2, forceLive, skip);

    // Cache for 5 mins in browser, 30 mins in CDN
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=1800');

    res.status(200).json({
      success: true,
      combined: {
        total: result.articles.length,
        articles: result.articles.slice(0, pageSize)
      },
      source: result.source,
      rateLimited: result.rateLimited,
      message: result.message,
      usedFallback: result.usedFallback,
      page: pageNum,
      pageSize: pageSize
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      combined: { total: 0, articles: [] },
      source: "empty",
      rateLimited: true,
      message:
        "News temporarily unavailable due to API limit. Please try later.",
      usedFallback: false,
      page: 1,
      pageSize: 12
    });
  }
};

export const getNewsArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await getNewsById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
      error: error.message
    });
  }
};

// ============ ADMIN: DELETE NEWS ARTICLE ============
export const deleteNewsArticle = async (req, res) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }

  try {
    const { id } = req.params;
    const article = await News.findById(id);
    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    // Clean up bookmarks referencing this article
    if (article.url) {
      await Bookmark.deleteMany({ articleUrl: article.url }).catch(() => {});
    }
    if (article.image) {
      await Bookmark.deleteMany({ articleImage: article.image }).catch(() => {});
    }

    // Remove from user bookmark references
    await User.updateMany(
      { bookmarks: id },
      { $pull: { bookmarks: id } }
    ).catch(() => {});

    // Remove from news savedBy arrays
    await News.findByIdAndDelete(id);

    // Clear news cache
    cacheService.clear();

    res.status(200).json({ success: true, message: "Article deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete article",
      error: error.message
    });
  }
};
