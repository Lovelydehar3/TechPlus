import express from "express"
import { getRoadmapById, getRoadmaps } from "../controllers/roadmapController.js"
import { seedRoadmapsFromData } from "../services/roadmapSeedService.js"
import { protect } from "../middleware/authMiddleware.js"
import { adminOnly } from "../middleware/adminMiddleware.js"

const router = express.Router()

router.get("/", getRoadmaps)
router.get("/:id", getRoadmapById)

// Admin-only: reset and re-seed roadmaps with latest data
router.post("/reseed", protect, adminOnly, async (req, res) => {
  try {
    const result = await seedRoadmapsFromData({ reset: true })
    res.status(200).json({ success: true, message: `Roadmaps re-seeded with ${result.count} roadmaps.` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
