import { User } from "../models/userModel.js"
import { Bookmark } from "../models/bookmarkModel.js"
import { Hackathon } from "../models/hackathonModel.js"
import { Playlist } from "../models/playlistModel.js"
import bcrypt from "bcryptjs"

function buildUserStats(userDoc, savedHackathonsCount = 0) {
  return {
    videosWatched: userDoc.watchHistory?.length || 0,
    bookmarksSaved: userDoc.bookmarks?.length || 0,
    savedResources: userDoc.savedResources?.length || 0,
    savedHackathons: savedHackathonsCount,
    roadmapsDownloaded: userDoc.downloadedRoadmaps?.length || 0
  }
}

// ================== UPLOAD PROFILE IMAGE ==================
export const uploadProfileImage = async (req, res) => {
  try {
    const { imageData } = req.body
    if (imageData === undefined) {
      return res.status(400).json({ success: false, message: "No image data provided" })
    }
    // imageData is a base64 data URL from the frontend
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: imageData },
      { returnDocument: "after" }
    ).select('-password -otp -otpExpires -resetToken -resetTokenExpires')
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    res.status(200).json({ success: true, message: "Profile image updated", user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== GET USER PROFILE ==================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -otp -otpExpires -resetToken -resetTokenExpires')
      .populate('bookmarks')
      .populate('savedResources', 'category title description totalDuration difficulty thumbnail externalUrl')

    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    const savedHackathons = await Hackathon.find({ bookmarkedBy: req.user.id })
      .select('title startDate mode location image description')
      .sort({ startDate: 1 })

    const stats = buildUserStats(user, savedHackathons.length)

    // Use findByIdAndUpdate to avoid calling .save() on a populated document
    // (populated ObjectId refs are full objects — Mongoose can't cast them back)
    await User.findByIdAndUpdate(req.user.id, { $set: { stats } })
    user.stats = stats

    res.status(200).json({ 
      success: true, 
      user: {
        ...user.toObject(),
        createdAt: user.createdAt,
        memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown',
        isVerified: user.isVerified,
        accessLevel: user.role,
        authProvider: 'Email/Password'
      },
      savedHackathons 
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== UPDATE USER PROFILE ==================
export const updateUserProfile = async (req, res) => {
  try {
    const { username, avatar, profileImage, darkMode } = req.body

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    // If username is changing, check for uniqueness
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: req.user.id } })
      if (existingUsername) {
        return res.status(400).json({ success: false, message: "Username already taken" })
      }
      user.username = username
    }

    // Email is permanent (logic removed from update)

    if (avatar !== undefined) user.avatar = avatar
    if (profileImage !== undefined) user.profileImage = profileImage
    if (darkMode !== undefined) user.darkMode = darkMode

    await user.save()

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        profileImage: user.profileImage,
        darkMode: user.darkMode,
        stats: user.stats,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== DELETE ACCOUNT ==================
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" })

    await Bookmark.deleteMany({ userId: req.user.id })
    await User.findByIdAndDelete(req.user.id)

    res.clearCookie('techplus_token')
    res.status(200).json({ success: true, message: "Account deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== ADD BOOKMARK ==================
export const addBookmark = async (req, res) => {
  try {
    const { articleTitle, articleUrl, articleImage, articleSource, category, description } = req.body

    if (!articleTitle || !articleUrl) {
      return res.status(400).json({ success: false, message: "Title and URL are required" })
    }

    const existing = await Bookmark.findOne({ userId: req.user.id, articleUrl })
    if (existing) {
      return res.status(400).json({ success: false, message: "Article already bookmarked" })
    }

    const bookmark = await Bookmark.create({
      userId: req.user.id,
      articleTitle,
      articleUrl,
      articleImage: articleImage || '',
      articleSource: articleSource || '',
      category: category || 'General',
      description: description || ''
    })

    const user = await User.findById(req.user.id)
    user.bookmarks.push(bookmark._id)
    user.stats = buildUserStats(user)
    await user.save()

    res.status(201).json({ success: true, message: "Bookmark added successfully", bookmark })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== GET USER BOOKMARKS ==================
export const getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, total: bookmarks.length, bookmarks })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== DELETE BOOKMARK ==================
export const deleteBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.params
    const bookmark = await Bookmark.findById(bookmarkId)
    if (!bookmark) return res.status(404).json({ success: false, message: "Bookmark not found" })

    if (bookmark.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" })
    }

    await Bookmark.findByIdAndDelete(bookmarkId)
    const user = await User.findById(req.user.id)
    user.bookmarks = user.bookmarks.filter((id) => String(id) !== String(bookmarkId))
    user.stats = buildUserStats(user)
    await user.save()

    res.status(200).json({ success: true, message: "Bookmark deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== UPDATE ROADMAP PROGRESS ==================
export const updateRoadmapProgress = async (req, res) => {
  try {
    const { roadmapId, itemId, completed, title } = req.body

    if (!roadmapId || !itemId) {
      return res.status(400).json({ success: false, message: "RoadmapId and ItemId are required" })
    }

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    const progressIndex = user.roadmapProgress.findIndex(
      p => p.roadmapId === roadmapId && p.itemId === itemId
    )

    if (progressIndex !== -1) {
      user.roadmapProgress[progressIndex].completed = completed
    } else {
      user.roadmapProgress.push({ roadmapId, itemId, completed })
    }

    const historyIndex = user.watchHistory.findIndex(
      (item) => item.type === 'roadmap' && item.roadmapId === roadmapId && item.itemId === itemId
    )
    const historyPayload = {
      type: 'roadmap',
      title: title || roadmapId,
      path: `/roadmaps?id=${roadmapId}&step=${itemId}`,
      roadmapId,
      itemId,
      completed: Boolean(completed),
      progress: completed ? 100 : 0,
      timestamp: Date.now()
    }
    if (historyIndex !== -1) {
      user.watchHistory[historyIndex] = { ...user.watchHistory[historyIndex].toObject(), ...historyPayload }
    } else {
      user.watchHistory.push(historyPayload)
    }
    if (user.watchHistory.length > 100) {
      user.watchHistory = user.watchHistory.slice(-100)
    }
    user.stats = buildUserStats(user)

    await user.save()

    res.status(200).json({ success: true, message: "Progress updated", roadmapProgress: user.roadmapProgress })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== GET ROADMAP PROGRESS ==================
export const getRoadmapProgress = async (req, res) => {
  try {
    const { roadmapId } = req.params
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    const progress = user.roadmapProgress.filter(p => p.roadmapId === roadmapId)
    res.status(200).json({ success: true, progress })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== UPDATE LAST ACTIVITY ==================
export const updateLastActivity = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    const prev = user.lastActivity?.toObject?.() ?? (user.lastActivity && typeof user.lastActivity === "object" ? { ...user.lastActivity } : {})
    const next = { ...prev }

    const fields = ["type", "title", "path", "timestamp", "videoId", "videoTitle", "videoIndex", "seconds", "playbackStarted"]

    for (const key of fields) {
      if (req.body[key] !== undefined) next[key] = req.body[key]
    }

    if (req.body.type != null && req.body.type !== "resource") {
      next.videoId = null; next.videoTitle = null; next.videoIndex = null; next.seconds = null; next.playbackStarted = false;
    }

    next.timestamp = typeof req.body.timestamp === "number" ? req.body.timestamp : Date.now()
    user.lastActivity = next
    if (next.type === "resource" || next.type === "roadmap") {
      const historyIndex = user.watchHistory.findIndex((item) => {
        if (next.type === "resource") {
          return item.type === "resource" && item.videoId === next.videoId && item.path === next.path
        }
        return item.type === "roadmap" && item.path === next.path && item.title === next.title
      })

      const historyPayload = {
        type: next.type,
        title: next.title,
        path: next.path,
        videoId: next.videoId || null,
        videoTitle: next.videoTitle || null,
        videoIndex: next.videoIndex ?? null,
        seconds: next.seconds ?? 0,
        completed: Boolean(req.body.completed),
        progress: typeof next.seconds === "number" ? Math.min(100, Math.max(0, Math.round((next.seconds / 600) * 100))) : 0,
        timestamp: next.timestamp
      }

      if (historyIndex !== -1) {
        user.watchHistory[historyIndex] = { ...user.watchHistory[historyIndex].toObject(), ...historyPayload }
      } else {
        user.watchHistory.push(historyPayload)
      }

      if (user.watchHistory.length > 100) {
        user.watchHistory = user.watchHistory.slice(-100)
      }
    }
    user.stats = buildUserStats(user)
    await user.save()

    res.status(200).json({ success: true, message: "Last activity updated", lastActivity: user.lastActivity })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== RECORD ROADMAP DOWNLOAD ==================
export const recordRoadmapDownload = async (req, res) => {
  try {
    const { title, roadmapId } = req.body
    if (!title || !roadmapId) {
      return res.status(400).json({ success: false, message: "Title and RoadmapId are required" })
    }

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    // Initialize array if it doesn't exist (safety)
    if (!user.downloadedRoadmaps) user.downloadedRoadmaps = []

    // Add new download to the end
    user.downloadedRoadmaps.push({
      title,
      roadmapId,
      timestamp: new Date()
    })

    // Keep only the latest 20
    if (user.downloadedRoadmaps.length > 20) {
      user.downloadedRoadmaps = user.downloadedRoadmaps.slice(-20)
    }

    user.stats = buildUserStats(user)
    await user.save()
    res.status(200).json({ success: true, message: "Roadmap download recorded" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== GET SAVED RESOURCES ==================
export const getSavedResources = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      'savedResources',
      'category title description totalDuration difficulty thumbnail externalUrl'
    )
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    res.status(200).json({ success: true, savedResources: user.savedResources || [] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== TOGGLE SAVED RESOURCE ==================
export const saveResource = async (req, res) => {
  try {
    const { playlistId } = req.body
    if (!playlistId) {
      return res.status(400).json({ success: false, message: "Playlist id is required" })
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
      return res.status(404).json({ success: false, message: "Resource not found" })
    }

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    const alreadySaved = user.savedResources.some((id) => String(id) === String(playlistId))
    if (alreadySaved) {
      return res.status(400).json({ success: false, message: "Resource already saved" })
    }

    user.savedResources.push(playlistId)
    user.stats = buildUserStats(user)
    await user.save()

    res.status(201).json({ success: true, message: "Resource saved", savedResources: user.savedResources })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ================== REMOVE SAVED RESOURCE ==================
export const removeSavedResource = async (req, res) => {
  try {
    const { playlistId } = req.params
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })

    user.savedResources = user.savedResources.filter((id) => String(id) !== String(playlistId))
    user.stats = buildUserStats(user)
    await user.save()

    res.status(200).json({ success: true, message: "Saved resource removed", savedResources: user.savedResources })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
