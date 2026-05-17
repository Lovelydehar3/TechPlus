import express from "express"
import { getPlaylistById, getPlaylists, getYouTubePlaylist } from "../controllers/playlistController.js"
import { seedPlaylistsFromCatalog } from "../services/playlistCatalogSeed.js"
import { protect } from "../middleware/authMiddleware.js"
import { adminOnly } from "../middleware/adminMiddleware.js"

const router = express.Router()

router.get("/", getPlaylists)
router.get("/youtube/:playlistId", getYouTubePlaylist)
router.get("/:id", getPlaylistById)

// Admin-only: reset and re-seed playlists with latest catalog
router.post("/reseed", protect, adminOnly, async (req, res) => {
  try {
    const result = await seedPlaylistsFromCatalog({ reset: true })
    res.status(200).json({ success: true, message: `Catalog re-seeded with ${result.count} playlists.` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
