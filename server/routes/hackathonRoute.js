import express from "express";
import {
  getHackathons,
  getHackathon,
  addBookmark,
  removeBookmark,
  getUserBookmarks,
  manualSyncHackathons,
  listCollegeHackathons,
  createCollegeHackathonAdmin,
  updateCollegeHackathonAdmin,
  deleteCollegeHackathonAdmin
} from "../controllers/hackathonController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getHackathons);

router.get("/admin/college", protect, adminOnly, listCollegeHackathons);
router.post("/admin/college", protect, adminOnly, createCollegeHackathonAdmin);
router.put("/admin/college/:id", protect, adminOnly, updateCollegeHackathonAdmin);
router.delete("/admin/college/:id", protect, adminOnly, deleteCollegeHackathonAdmin);

router.post("/bookmark", protect, addBookmark);
router.delete("/bookmark/:hackathonId", protect, removeBookmark);
router.get("/user/bookmarks", protect, getUserBookmarks);
router.post("/sync", protect, adminOnly, manualSyncHackathons);

router.get("/:id", getHackathon);

export default router;
