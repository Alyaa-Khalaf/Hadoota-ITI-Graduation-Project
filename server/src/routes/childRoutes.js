import express from "express";
import { createChild, getAllChildren, deleteChild } from "../controllers/childController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.use(protect);

router.post("/", createChild);
router.get("/", getAllChildren);
router.delete("/:id", deleteChild);

export default router;
