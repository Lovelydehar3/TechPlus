import express from "express"
import {
  adminCreateUser,
  adminGetAllUsers,
  adminDeleteUser,
  adminUpdateUserRole,
  adminVerifyUser
} from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js"
import { adminOnly } from "../middleware/adminMiddleware.js"

const router = express.Router()

router.post('/users', protect, adminOnly, adminCreateUser)
router.get('/users', protect, adminOnly, adminGetAllUsers)
router.delete('/users/:userId', protect, adminOnly, adminDeleteUser)
router.put('/users/:userId/role', protect, adminOnly, adminUpdateUserRole)
router.put('/users/:userId/verify', protect, adminOnly, adminVerifyUser)

export default router
