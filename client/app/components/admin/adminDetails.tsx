import type { DetailField } from "./DetailModal";
import type {
  AdminUser,
  AdminChild,
  AdminStory,
  AdminSchool,
  AdminQuiz,
  AdminKnowledge,
  AdminTransaction,
} from "@/services/adminService";

const ROLE_LABELS: Record<string, string> = {
  parent: "ولي أمر",
  admin: "مدير",
  teacher: "معلم",
  student: "طالب",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "مكتملة",
  generating: "قيد التوليد",
  failed: "فشلت",
  succeeded: "ناجحة",
  pending: "قيد الانتظار",
  refunded: "مستردة",
  active: "نشط",
  inactive: "غير نشط",
  cancelled: "ملغي",
};

function fmtDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function fmtMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount);
}

export function userDetailFields(u: AdminUser): DetailField[] {
  return [
    { label: "الاسم", value: u.name },
    { label: "الإيميل", value: u.email },
    { label: "الدور", value: ROLE_LABELS[u.role] ?? u.role },
    { label: "الاشتراك", value: u.subscription?.plan ?? "free" },
    { label: "حالة الاشتراك", value: STATUS_LABELS[u.subscription?.status ?? ""] ?? u.subscription?.status ?? "—" },
    { label: "ينتهي في", value: fmtDate(u.subscription?.expiresAt) },
    { label: "تاريخ التسجيل", value: fmtDate(u.createdAt) },
  ];
}

export function childDetailFields(ch: AdminChild): DetailField[] {
  return [
    { label: "الاسم", value: ch.name },
    { label: "العمر", value: String(ch.age) },
    { label: "النوع", value: ch.gender === "male" ? "ذكر" : "أنثى" },
    { label: "ولي الأمر", value: ch.parentId?.name ?? "—" },
    { label: "إيميل ولي الأمر", value: ch.parentId?.email ?? "—" },
    { label: "المدرسة", value: ch.schoolId?.name ?? "—" },
    { label: "المستوى", value: ch.learningLevel ?? "—" },
    { label: "XP", value: String(ch.xp ?? 0) },
    { label: "المستوى (Lv)", value: String(ch.level ?? 1) },
    { label: "الاهتمامات", value: ch.interests?.join("، ") || "—" },
    { label: "تاريخ الإضافة", value: fmtDate(ch.createdAt) },
  ];
}

export function storyDetailFields(s: AdminStory): DetailField[] {
  return [
    { label: "العنوان", value: s.title },
    { label: "الشخصية", value: s.character },
    { label: "الموضوع", value: s.topic },
    { label: "الطفل", value: s.childId?.name ?? "—" },
    { label: "عمر الطفل", value: s.childId?.age ? String(s.childId.age) : "—" },
    { label: "الحالة", value: STATUS_LABELS[s.status] ?? s.status },
    { label: "مفضلة", value: s.isFavorite ? "نعم" : "لا" },
    { label: "آمنة", value: s.safetyCheck?.safe ? "نعم" : "لا" },
    { label: "مبلّغ عنها", value: s.safetyCheck?.flagged ? "نعم" : "لا" },
    { label: "سبب التبليغ", value: s.safetyCheck?.reason || "—" },
    { label: "تاريخ الإنشاء", value: fmtDate(s.createdAt) },
  ];
}

export function schoolDetailFields(s: AdminSchool): DetailField[] {
  return [
    { label: "الاسم", value: s.name },
    { label: "الكود", value: s.code },
    { label: "المدير", value: s.adminId?.name ?? "—" },
    { label: "إيميل المدير", value: s.adminId?.email ?? "—" },
    { label: "حالة الاشتراك", value: STATUS_LABELS[s.subscriptionStatus] ?? s.subscriptionStatus },
    { label: "ينتهي في", value: fmtDate(s.subscriptionExpiresAt) },
    { label: "تاريخ التسجيل", value: fmtDate(s.createdAt) },
  ];
}

export function quizDetailFields(q: AdminQuiz): DetailField[] {
  return [
    { label: "الحدوتة", value: q.story?.title ?? "—" },
    { label: "الطفل", value: q.child?.name ?? "—" },
    { label: "عدد الأسئلة", value: String(q.questionsCount) },
    { label: "أعلى نتيجة", value: `${q.bestScore}%` },
    { label: "تاريخ الإنشاء", value: fmtDate(q.createdAt) },
  ];
}

export function knowledgeDetailFields(k: AdminKnowledge): DetailField[] {
  return [
    { label: "العنوان", value: k.title },
    { label: "التصنيف", value: k.category },
    { label: "اللغة", value: k.lang === "en" ? "إنجليزي" : "عربي" },
    { label: "المصدر", value: k.source ?? "—" },
    { label: "الوسوم", value: k.tags?.join("، ") || "—" },
    { label: "نشط", value: k.isActive === false ? "لا" : "نعم" },
    { label: "المحتوى", value: <span className="whitespace-pre-wrap">{k.content}</span> },
    { label: "تاريخ الإضافة", value: fmtDate(k.createdAt) },
  ];
}

export function transactionDetailFields(t: AdminTransaction): DetailField[] {
  return [
    {
      label: "المستخدم",
      value: t.user ? `${t.user.name} (${t.user.email})` : "—",
    },
    {
      label: "المدرسة",
      value: t.school ? `${t.school.name} — ${t.school.code}` : "—",
    },
    { label: "المبلغ", value: fmtMoney(t.amount, t.currency) },
    { label: "الخطة", value: t.plan ?? "—" },
    { label: "الحالة", value: STATUS_LABELS[t.status] ?? t.status },
    { label: "المزود", value: t.provider ?? "paymob" },
    { label: "رقم المعاملة", value: t.paymobTransactionId ?? "—" },
    { label: "رقم الطلب", value: t.paymobOrderId ?? "—" },
    { label: "المرجع", value: t.reference ?? "—" },
    { label: "الوصف", value: t.description ?? "—" },
    { label: "التاريخ", value: fmtDate(t.createdAt) },
  ];
}
