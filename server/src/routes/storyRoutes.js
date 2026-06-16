import express from "express";
import {
  searchStories,
  filterStories,
  getFavoriteStories,
  addFavorite,
  removeFavorite,
} from "../controllers/storyController.js";
import {
  generateStory,
  getGeneratedStory,
} from "../controllers/storyGenerationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { verifyChildOwnership } from "../middleware/childOwnershipMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/generate", verifyChildOwnership, generateStory);
router.get("/generated/:id", getGeneratedStory);

router.get("/search", verifyChildOwnership, searchStories);
router.get("/filter", verifyChildOwnership, filterStories);
router.get("/:childId/favorites", verifyChildOwnership, getFavoriteStories);
router.post("/:id/favorite", verifyChildOwnership, addFavorite);
router.delete("/:id/favorite", verifyChildOwnership, removeFavorite);

export default router;
