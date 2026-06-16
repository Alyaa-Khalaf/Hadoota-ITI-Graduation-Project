import express from "express";
import { submitQuiz } from "../controllers/quizController.js";
import authMiddleware from '../middleware/auth.js';
import { verifyChildOwnership } from "../middleware/childOwnershipMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/submit", verifyChildOwnership, submitQuiz);

export default router;
