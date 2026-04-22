import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  articleTitle: {
    type: String,
    required: true
  },
  articleUrl: {
    type: String,
    required: true
  },
  articleImage: {
    type: String,
    default: null
  },
  articleSource: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['AI', 'Web Development', 'Cybersecurity', 'Data Science', 'General'],
    default: 'General'
  },
  description: {
    type: String,
    default: null
  }
}, { timestamps: true });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
