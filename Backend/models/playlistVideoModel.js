import mongoose from "mongoose"

const playlistVideoSchema = new mongoose.Schema(
  {
    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    duration: { type: String, default: "" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
)

playlistVideoSchema.index({ playlistId: 1, order: 1 })

export const PlaylistVideo = mongoose.model("PlaylistVideo", playlistVideoSchema)
