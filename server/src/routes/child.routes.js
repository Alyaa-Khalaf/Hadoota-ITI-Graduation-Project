import express from "express";
import { body, param } from "express-validator";
import {
  createChild,
  getChild,
  getChildren,
  updateChild,
  deleteChild,
} from "../controllers/childController.js";
import {
  getActiveChild,
  setActiveChild,
} from "../controllers/activeChildController.js";
import authMiddleware from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { checkPlanLimit } from "../middleware/subscriptionMiddleware.js";
import Child from "../models/Child.js";

const router = express.Router();

// تطبيق الحماية على كل المسارات تلقائياً
router.use(authMiddleware);

// Helper: جيب عدد الأطفال الحاليين للـ parent
const getChildCount = (userId) => Child.countDocuments({ parentId: userId });

// 1️⃣ إضافة طفل جديد مع التحقق من البيانات — محمية بـ childrenCount limit
router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("اسم الطفل مطلوب")
      .isLength({ max: 50 })
      .withMessage("الاسم لا يزيد عن 50 حرف"),
    body("age")
      .isInt({ min: 3, max: 12 })
      .withMessage("العمر يجب أن يكون بين 3 و 12 سنة"),
    body("interests")
      .optional()
      .isArray()
      .withMessage("الاهتمامات يجب أن تكون قائمة"),
    body("learningLevel")
      .optional()
      .isIn(["beginner", "intermediate", "advanced"])
      .withMessage("مستوى التعلم غير صحيح"),
  ],
  validate,
  checkPlanLimit("childrenCount", getChildCount),
  createChild,
);

// 2️⃣ جلب كل أطفال الأب الحالي
router.get("/", getChildren);
router.get("/active", getActiveChild);
router.post("/active", setActiveChild);

// 3️⃣ جلب بيانات طفل محدد بواسطة الـ ID
router.get(
  "/:id",
  [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("معرف الطفل مطلوب")
      .isMongoId()
      .withMessage("معرف الطفل غير صحيح"),
  ],
  validate,
  getChild,
);

// 4️⃣ تعديل بيانات طفل
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("معرف الطفل غير صحيح"),
    body("name")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("الاسم لا يزيد عن 50 حرف"),
    body("age")
      .optional()
      .isInt({ min: 3, max: 12 })
      .withMessage("العمر يجب أن يكون بين 3 و 12 سنة"),
  ],
  validate,
  updateChild,
);

// 5️⃣ حذف طفل نهائياً
router.delete(
  "/:id",
  [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("معرف الطفل مطلوب")
      .isMongoId()
      .withMessage("معرف الطفل غير صحيح"),
  ],
  validate,
  deleteChild,
);

export default router;