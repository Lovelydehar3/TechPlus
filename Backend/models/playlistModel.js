import mongoose from "mongoose"

const playlistSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    totalDuration: { type: String, default: "" },
    difficulty: { type: String, default: "" },
    externalUrl: { type: String, default: null }
  },
  { timestamps: true }
)

playlistSchema.index({ category: 1, title: 1 })

export const Playlist = mongoose.model("Playlist", playlistSchema)
