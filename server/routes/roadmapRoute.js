import express from "express"
import { getRoadmapById, getRoadmaps } from "../controllers/roadmapController.js"
import { seedRoadmapsFromData } from "../services/roadmapSeedService.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", getRoadmaps)
router.get("/:id", getRoadmapById)

// Admin-only: reset and re-seed roadmaps with latest data
router.post("/reseed", protect, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" })
    }
    const result = await seedRoadmapsFromData({ reset: true })
    res.status(200).json({ success: true, message: `Roadmaps re-seeded with ${result.count} roadmaps.` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
