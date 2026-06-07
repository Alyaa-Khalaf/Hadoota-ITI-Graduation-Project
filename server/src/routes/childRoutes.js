import express from "express";
import { createChild, getAllChildren } from "../controllers/childController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createChild);
router.get("/", getAllChildren);

export default router;
