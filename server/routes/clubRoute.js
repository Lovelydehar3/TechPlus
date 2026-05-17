import express from "express";
import {
  getClubs,
  getClubBySlug,
  getClubEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
} from "../controllers/clubController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ─── Admin routes (must be before /:slug to avoid slug collision) ─────────────
router.get("/admin/events", protect, adminOnly, getAllEvents);
router.post("/admin/events", protect, adminOnly, createEvent);
router.put("/admin/events/:id", protect, adminOnly, updateEvent);
router.delete("/admin/events/:id", protect, adminOnly, deleteEvent);

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/", getClubs);
router.get("/:slug", getClubBySlug);
router.get("/:slug/events", getClubEvents);

export default router;
