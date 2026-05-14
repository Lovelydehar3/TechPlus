import mongoose from "mongoose"
import { Playlist } from "../models/playlistModel.js"
import { PlaylistVideo } from "../models/playlistVideoModel.js"
import { resolveYouTubePlaylistFeed } from "../services/youtubePlaylistService.js"

export const getPlaylists = async (req, res) => {
  try {
    const withFlags = await Playlist.aggregate([
      { $sort: { domain: 1, title: 1 } },
      {
        $lookup: {
          from: "playlistvideos",
          localField: "_id",
          foreignField: "playlistId",
          as: "_v"
        }
      },
      {
        $project: {
          category: 1,
          group: 1,
          domain: 1,
          title: 1,
          platform: 1,
          resourceType: 1,
          description: 1,
          thumbnail: 1,
          totalDuration: 1,
          difficulty: 1,
          externalUrl: 1,
          tags: 1,
          hasVideos: { $gt: [{ $size: "$_v" }, 0] }
        }
      }
    ])

    res.status(200).json({
      success: true,
      count: withFlags.length,
      playlists: withFlags
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid playlist id" })
    }

    const playlist = await Playlist.findById(id).lean()
    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" })
    }

    const videos = await PlaylistVideo.find({ playlistId: id })
      .select('title videoUrl duration order -_id')
      .sort({ order: 1 })
      .lean()

    res.status(200).json({
      success: true,
      _id: playlist._id,
      title: playlist.title,
      platform: playlist.platform,
      resourceType: playlist.resourceType,
      description: playlist.description,
      thumbnail: playlist.thumbnail,
      category: playlist.category,
      group: playlist.group,
      domain: playlist.domain,
      totalDuration: playlist.totalDuration,
      difficulty: playlist.difficulty,
      externalUrl: playlist.externalUrl,
      tags: playlist.tags || [],
      videos: videos.map((v) => ({
        _id: v._id,
        title: v.title,
        videoUrl: v.videoUrl,
        duration: v.duration,
        order: v.order
      }))
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getYouTubePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params
    const { title: fallbackTitle = "", description: fallbackDescription = "" } = req.query
    const feed = await resolveYouTubePlaylistFeed(playlistId)

    const videos = (feed.videos || []).map((video, index) => ({
      _id: `${feed.playlistId}-${video.videoId}-${index}`,
      title: video.title,
      videoUrl: video.videoUrl,
      duration: video.duration || "",
      order: index,
      thumbnail: video.thumbnail || ""
    }))

    res.status(200).json({
      success: true,
      _id: `youtube:${feed.playlistId}`,
      title: feed.title || fallbackTitle || "YouTube Playlist",
      platform: "YouTube",
      resourceType: "YouTube Playlist",
      description: feed.description || fallbackDescription || "",
      thumbnail: videos[0]?.thumbnail || "",
      category: "YouTube Playlist",
      group: "",
      domain: "YouTube Playlist",
      totalDuration: `${videos.length} videos`,
      difficulty: "Beginner to Intermediate",
      externalUrl: `https://www.youtube.com/playlist?list=${feed.playlistId}`,
      tags: ["youtube", "playlist"],
      videos
    })
  } catch (error) {
    res.status(502).json({
      success: false,
      message: error.message || "Unable to resolve YouTube playlist"
    })
  }
}
