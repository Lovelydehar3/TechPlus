import express from "express";
import {
  getTechNews,
  getGTechNews,
  getAllTechNews,
  searchNewsArticles,
  refreshNewsCache,
  getNewsArticle
} from "../controllers/newsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get('/newsapi', getTechNews);
router.get('/gnews', getGTechNews);
router.get('/all', getAllTechNews);
router.get('/search', searchNewsArticles);
router.post('/refresh', protect, adminOnly, refreshNewsCache);
router.get('/:id', getNewsArticle);

export default router;
