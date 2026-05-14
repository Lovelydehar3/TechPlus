import mongoose from "mongoose";

const clubEventSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    venue: {
      type: String,
      default: "",
    },
    date: {
      type: String, // stored as ISO date string for flexible display
      default: "",
    },
    time: {
      type: String,
      default: "",
    },
    registrationUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
      index: true,
    },
  },
  { timestamps: true }
);

clubEventSchema.index({ club: 1, status: 1 });
clubEventSchema.index({ club: 1, createdAt: -1 });

export const ClubEvent = mongoose.model("ClubEvent", clubEventSchema);
