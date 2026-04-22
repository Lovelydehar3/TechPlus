import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  avatar: { type: String, default: null },
  profileImage: { type: String, default: null },
  darkMode: { type: Boolean, default: false },
  // Watch history
  watchHistory: [{
    type: { type: String },
    title: String,
    path: String,
    roadmapId: String,
    itemId: String,
    videoId: String,
    videoTitle: String,
    videoIndex: Number,
    seconds: Number,
    completed: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    timestamp: Number
  }],
  // Saved resources (playlist IDs)
  savedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  // Bookmarks
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bookmark'
  }],
  // Roadmap progress
  roadmapProgress: [{
    roadmapId: String,
    itemId: String,
    completed: { type: Boolean, default: false }
  }],
  // History of downloaded roadmap PDFs
  downloadedRoadmaps: [{
    title: String,
    roadmapId: String,
    timestamp: { type: Date, default: Date.now }
  }],
  stats: {
    videosWatched: { type: Number, default: 0 },
    bookmarksSaved: { type: Number, default: 0 },
    savedResources: { type: Number, default: 0 },
    savedHackathons: { type: Number, default: 0 },
    roadmapsDownloaded: { type: Number, default: 0 }
  },
  // Last activity (for Resume card)
  lastActivity: {
    type: { type: String, default: null },
    title: { type: String, default: null },
    path: { type: String, default: null },
    timestamp: { type: Number, default: null },
    videoId: { type: String, default: null },
    videoTitle: { type: String, default: null },
    videoIndex: { type: Number, default: null },
    seconds: { type: Number, default: null },
    playbackStarted: { type: Boolean, default: false }
  },
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
