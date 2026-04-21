import express from "express"
import {
  getUserProfile,
  updateUserProfile,
  deleteAccount,
  addBookmark,
  getUserBookmarks,
  deleteBookmark,
  updateRoadmapProgress,
  getRoadmapProgress,
  updateLastActivity,
  uploadProfileImage,
  recordRoadmapDownload,
  getSavedResources,
  saveResource,
  removeSavedResource
} from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get('/profile', protect, getUserProfile)
router.put('/update', protect, updateUserProfile)
router.delete('/account', protect, deleteAccount)

router.post('/bookmarks', protect, addBookmark)
router.get('/bookmarks', protect, getUserBookmarks)
router.delete('/bookmarks/:bookmarkId', protect, deleteBookmark)

router.put('/roadmap-progress', protect, updateRoadmapProgress)
router.get('/roadmap-progress/:roadmapId', protect, getRoadmapProgress)

router.put('/last-activity', protect, updateLastActivity)
router.post('/upload-profile', protect, uploadProfileImage)
router.post('/record-roadmap-download', protect, recordRoadmapDownload)
router.get('/saved-resources', protect, getSavedResources)
router.post('/saved-resources', protect, saveResource)
router.delete('/saved-resources/:playlistId', protect, removeSavedResource)

export default router
