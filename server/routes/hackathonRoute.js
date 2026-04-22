import express from "express";
import {
  getHackathons,
  getHackathon,
  addBookmark,
  removeBookmark,
  getUserBookmarks,
  manualSyncHackathons
} from "../controllers/hackathonController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getHackathons);

router.post("/bookmark", protect, addBookmark);
router.delete("/bookmark/:hackathonId", protect, removeBookmark);
router.get("/user/bookmarks", protect, getUserBookmarks);
router.post("/sync", protect, manualSyncHackathons);

router.get("/:id", getHackathon);

export default router;
