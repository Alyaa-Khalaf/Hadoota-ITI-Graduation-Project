import express from "express";
import { submitQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";
import { verifyChildOwnership } from "../middleware/childOwnershipMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/submit", verifyChildOwnership, submitQuiz);

export default router;
