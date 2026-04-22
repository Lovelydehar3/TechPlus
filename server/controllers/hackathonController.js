import {
  getAllHackathons,
  getHackathonById,
  bookmarkHackathon,
  removeHackathonBookmark,
  getUserBookmarkedHackathons,
  syncHackathonsFromAPI
} from "../services/hackathonService.js";

// ============ GET ALL HACKATHONS (with filters) ============
export const getHackathons = async (req, res) => {
  try {
    const { mode, search, tags, upcoming } = req.query;

    const filters = {};
    if (mode) filters.mode = mode;
    if (search) filters.search = search;
    if (tags) filters.tags = Array.isArray(tags) ? tags : [tags];
    if (upcoming === 'true') filters.upcoming = true;

    const hackathons = await getAllHackathons(filters);

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
