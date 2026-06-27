import express from "express";
import { body, param } from "express-validator";
import {
  createChild,
  getChild,
  getChildren,
  updateChild,
  deleteChild,
  setActiveChild,
  getActiveChild,
} from "../controllers/childController.js";
import authMiddleware from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

// تطبيق الحماية على كل المسارات تلقائياً
router.use(authMiddleware);

// 1️⃣ إضافة طفل جديد مع التحقق من البيانات
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
  createChild,
);

// 2️⃣ جلب كل أطفال الأب الحالي
router.get("/", getChildren);

// 🆕 6️⃣ تحديد / جلب "الطفل النشط" حالياً للأب
// ⚠️ لازم يكونوا قبل "/:id" في الترتيب، وإلا Express هيحاول يفسّر
// "active" كقيمة لـ :id ويوصل لـ getChild بالغلط (وهيفشل على isMongoId)
router.post(
  "/active",
  [
    body("childId")
      .trim()
      .notEmpty()
      .withMessage("معرف الطفل مطلوب")
      .isMongoId()
      .withMessage("معرف الطفل غير صحيح"),
  ],
  validate,
  setActiveChild,
);

router.get("/active", getActiveChild);

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

// 4️⃣ تعديل بيانات طفل (تمت إضافتها وتأمينها بالـ Validation)
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

// 5️⃣ حذف طفل نهائياً ()
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