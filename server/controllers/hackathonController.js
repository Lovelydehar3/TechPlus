import {
  getAllHackathons,
  getHackathonById,
  bookmarkHackathon,
  removeHackathonBookmark,
  getUserBookmarkedHackathons,
  syncHackathonsFromAPI,
  getAdminCollegeHackathons,
  createCollegeHackathon,
  updateCollegeHackathon,
  deleteCollegeHackathon
} from "../services/hackathonService.js";
import cacheService from "../services/cacheService.js";
import { User } from "../models/userModel.js";
import { Bookmark } from "../models/bookmarkModel.js";

const requireAdmin = (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ success: false, message: "Admin only" });
    return false;
  }
  return true;
};

const invalidateHackathonCache = () => {
  cacheService.clear();
};

// ============ GET ALL HACKATHONS (with filters) ============
export const getHackathons = async (req, res) => {
  try {
    const { mode, search, tags, upcoming, refresh } = req.query;

    const filters = {};
    if (mode) filters.mode = mode;
    if (search) filters.search = search;
    if (tags) filters.tags = Array.isArray(tags) ? tags : [tags];
    if (upcoming === 'true') filters.upcoming = true;
    if (refresh === 'true') filters.refresh = true;

    // Create cache key from filters
    const cacheKey = `hackathons-${JSON.stringify(filters)}`;
    
    let hackathons;
    if (filters.refresh) {
      // Skip cache if explicitly requested
      hackathons = await getAllHackathons(filters);
      cacheService.set(cacheKey, hackathons, 10 * 60 * 1000); // Cache for 10 mins
    } else {
      // Use cache with 10 minute TTL
      hackathons = await cacheService.getOrCompute(
        cacheKey,
        () => getAllHackathons(filters),
        10 * 60 * 1000 // 10 minutes
      );
    }

    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    res.status(200).json({
      success: true,
      total: hackathons.length,
      hackathons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hackathons",
      error: error.message
    });
  }
};

// ============ GET SINGLE HACKATHON ============
export const getHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const hackathon = await getHackathonById(id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    res.status(200).json({
      success: true,
      hackathon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hackathon",
      error: error.message
    });
  }
};

// ============ BOOKMARK HACKATHON ============
export const addBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hackathonId } = req.body;

    if (!hackathonId) {
      return res.status(400).json({
        success: false,
        message: "Hackathon ID required"
      });
    }

    const result = await bookmarkHackathon(userId, hackathonId);

    res.status(201).json({
      success: true,
      message: "Hackathon bookmarked",
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to bookmark hackathon",
      error: error.message
    });
  }
};

// ============ REMOVE BOOKMARK ============
export const removeBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hackathonId } = req.params;

    await removeHackathonBookmark(userId, hackathonId);

    res.status(200).json({
      success: true,
      message: "Bookmark removed"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove bookmark",
      error: error.message
    });
  }
};

// ============ GET USER'S BOOKMARKS ============
export const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const hackathons = await getUserBookmarkedHackathons(userId);

    res.status(200).json({
      success: true,
      total: hackathons.length,
      hackathons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookmarks",
      error: error.message
    });
  }
};

// ============ ADMIN: COLLEGE HACKATHONS ============
export const listCollegeHackathons = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const hackathons = await getAdminCollegeHackathons();
    res.status(200).json({ success: true, total: hackathons.length, hackathons });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch college hackathons",
      error: error.message
    });
  }
};

export const createCollegeHackathonAdmin = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const hackathon = await createCollegeHackathon(req.body);
    invalidateHackathonCache();
    res.status(201).json({ success: true, hackathon });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create college hackathon"
    });
  }
};

export const updateCollegeHackathonAdmin = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const hackathon = await updateCollegeHackathon(req.params.id, req.body);
    invalidateHackathonCache();
    res.status(200).json({ success: true, hackathon });
  } catch (error) {
    const status = error.message === "College hackathon not found" ? 404 : 400;
    res.status(status).json({
      success: false,
      message: error.message || "Failed to update college hackathon"
    });
  }
};

export const deleteCollegeHackathonAdmin = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const hackathonId = req.params.id;

    // Clean up user bookmarks referencing this hackathon
    await User.updateMany(
      { bookmarks: hackathonId },
      { $pull: { bookmarks: hackathonId } }
    ).catch(() => {});

    // Clean up any Bookmark documents referencing this hackathon
    const hackathon = await getHackathonById(hackathonId);
    if (hackathon?.image) {
      await Bookmark.deleteMany({ articleImage: hackathon.image }).catch(() => {});
    }

    await deleteCollegeHackathon(hackathonId);
    invalidateHackathonCache();
    res.status(200).json({ success: true, message: "College hackathon deleted" });
  } catch (error) {
    const status = error.message === "College hackathon not found" ? 404 : 400;
    res.status(status).json({
      success: false,
      message: error.message || "Failed to delete college hackathon"
    });
  }
};

// ============ SYNC HACKATHONS (Manual trigger - Admin only) ============
export const manualSyncHackathons = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin only"
      });
    }

    const result = await syncHackathonsFromAPI();

    res.status(200).json({
      success: true,
      message: "Hackathons synced successfully",
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to sync hackathons",
      error: error.message
    });
  }
};
