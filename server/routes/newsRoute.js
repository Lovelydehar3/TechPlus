import express from "express"
import {
  getTechNews,
  getGTechNews,
  getAllTechNews,
  searchNewsArticles,
  refreshNewsCache
} from "../controllers/newsController.js"

const router = express.Router()

router.get('/newsapi',    getTechNews)         // Tech news
router.get('/gnews',      getGTechNews)        // GNews
router.get('/all',        getAllTechNews)      // Combined
router.get('/search',     searchNewsArticles)  // Search endpoint
router.post('/refresh',   refreshNewsCache)    // Admin refresh cache

export default router