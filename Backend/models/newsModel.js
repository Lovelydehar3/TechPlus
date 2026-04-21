import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  content: String,
  author: String,
  source: {
    name: String,
    id: String
  },
  image: String,
  url: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    maxlength: 80,
    default: 'General',
    index: true
  },
  publishedAt: Date,
  apiSource: {
    type: String,
    enum: ['GNews', 'NewsAPI', 'Mock', 'Cached'],
    default: 'Cached'
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Text search index for search functionality
newsSchema.index({ title: 'text', description: 'text', category: 1 });

export const News = mongoose.model("News", newsSchema);
