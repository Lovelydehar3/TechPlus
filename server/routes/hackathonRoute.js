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

const router = express.Router();

router.get("/", getHackathons);

router.get("/admin/college", protect, listCollegeHackathons);
router.post("/admin/college", protect, createCollegeHackathonAdmin);
router.put("/admin/college/:id", protect, updateCollegeHackathonAdmin);
router.delete("/admin/college/:id", protect, deleteCollegeHackathonAdmin);

router.post("/bookmark", protect, addBookmark);
router.delete("/bookmark/:hackathonId", protect, removeBookmark);
router.get("/user/bookmarks", protect, getUserBookmarks);
router.post("/sync", protect, manualSyncHackathons);

router.get("/:id", getHackathon);

export default router;
