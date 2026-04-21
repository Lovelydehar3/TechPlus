import express from "express"
import { getRoadmapById, getRoadmaps } from "../controllers/roadmapController.js"

const router = express.Router()

router.get("/", getRoadmaps)
router.get("/:id", getRoadmapById)

export default router
