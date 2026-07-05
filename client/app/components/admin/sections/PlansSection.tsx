"use client";

import { useCallback, useState } from "react";
import DataTable, { Column } from "../DataTable";
import DetailModal from "../DetailModal";
import FormModal, { FormField } from "../FormModal";
import ConfirmDialog from "../ConfirmDialog";
import { planDetailFields } from "../adminDetails";
import { useCrudSection } from "@/hooks/useCrudSection";
import { getApiErrorMessage } from "@/utils/api";
import * as admin from "@/services/adminService";
import type { AdminPlan } from "@/services/adminService";

const AUDIENCE_OPTIONS = [
  { value: "parent", label: "أولياء الأمور" },
  { value: "school", label: "المدارس" },
  { value: "all", label: "الكل" },
];

const AUDIENCE_LABELS: Record<string, string> = {
  parent: "أولياء الأمور",
  school: "المدارس",
  all: "الكل",
};

const BOOL_OPTIONS = [
  { value: "true", label: "نعم" },
  { value: "false", label: "لا" },
];

const FIELDS: FormField[] = [
  // ── معلومات أساسية ──
  { name: "name", label: "اسم الخطة", required: true },
  { name: "slug", label: "المعرّف (slug) — حروف إنجليزية", required: true, placeholder: "pro" },
  { name: "price", label: "السعر (ج.م)", type: "number", required: true },
  { name: "durationDays", label: "مدة الاشتراك (أيام)", type: "number", required: true },
  { name: "audience", label: "الجمهور", type: "select", options: AUDIENCE_OPTIONS },

  // ── Limits ──
  {
    name: "limits.storiesCount",
    label: "عدد القصص المتاحة (-1 = بلا حد)",
    type: "number",
    placeholder: "-1",
  },
  {
    name: "limits.childrenCount",
    label: "عدد الأطفال المسموح بهم",
    type: "number",
    placeholder: "1",
  },
  {
    name: "limits.hasPremiumContent",
    label: "محتوى مميز (Premium)؟",
    type: "select",
    options: BOOL_OPTIONS,
  },
  {
    name: "limits.hasDownloads",
    label: "تحميل القصص Offline؟",
    type: "select",
    options: BOOL_OPTIONS,
  },
  {
    name: "limits.hasDetailedReports",
    label: "تقارير تفصيلية للطفل؟",
    type: "select",
    options: BOOL_OPTIONS,
  },

  // ── Trial ──
  {
    name: "isTrial",
    label: "خطة تجريبية (Trial)؟",
    type: "select",
    options: BOOL_OPTIONS,
  },
  {
    name: "trialDays",
    label: "مدة التجربة (أيام)",
    type: "number",
    placeholder: "7",
  },

  // ── عرض ──
  { name: "features", label: "المميزات (كل ميزة في سطر)", type: "textarea", placeholder: "ميزة 1\nميزة 2" },
  { name: "badge", label: "البادج", placeholder: "الأكثر شعبية 🔥" },
  { name: "highlight", label: "خطة مميزة؟", type: "select", options: BOOL_OPTIONS },
  { name: "isActive", label: "نشطة؟", type: "select", options: BOOL_OPTIONS },
  { name: "sortOrder", label: "ترتيب العرض", type: "number" },
  { name: "description", label: "وصف مختصر", type: "textarea" },
];

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: (currency || "EGP").toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function PlansSection() {
  const { rows, page, totalPages, total, loading, error, filters, setPage, setSearch, setFilter, reload, remove } =
    useCrudSection<AdminPlan>({ fetcher: admin.listPlans, remover: admin.deletePlan });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPlan | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toDelete, setToDelete] = useState<AdminPlan | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [detail, setDetail] = useState<AdminPlan | null>(null);

  const openCreate = () => {
    setEditing(null);
    setValues({
      audience: "all",
      highlight: "false",
      isActive: "true",
      sortOrder: "0",
      // Limits defaults
      "limits.storiesCount": "5",
      "limits.childrenCount": "1",
      "limits.hasPremiumContent": "false",
      "limits.hasDownloads": "false",
      "limits.hasDetailedReports": "false",
      // Trial defaults
      isTrial: "false",
      trialDays: "7",
    });
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (p: AdminPlan) => {
    setEditing(p);
    setValues({
      name: p.name,
      slug: p.slug,
      price: String(p.price),
      durationDays: String(p.durationDays),
      audience: p.audience,
      features: (p.features ?? []).join("\n"),
      badge: p.badge ?? "",
      highlight: p.highlight ? "true" : "false",
      isActive: p.isActive === false ? "false" : "true",
      sortOrder: String(p.sortOrder ?? 0),
      description: p.description ?? "",
      // Limits
      "limits.storiesCount": String(p.limits?.storiesCount ?? 5),
      "limits.childrenCount": String(p.limits?.childrenCount ?? 1),
      "limits.hasPremiumContent": p.limits?.hasPremiumContent ? "true" : "false",
      "limits.hasDownloads": p.limits?.hasDownloads ? "true" : "false",
      "limits.hasDetailedReports": p.limits?.hasDetailedReports ? "true" : "false",
      // Trial
      isTrial: p.isTrial ? "true" : "false",
      trialDays: String(p.trialDays ?? 7),
    });
    setFormError("");
    setFormOpen(true);
  };

  const onChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const buildBody = (): Partial<AdminPlan> => ({
    name: values.name,
    slug: values.slug,
    price: Number(values.price),
    durationDays: Number(values.durationDays),
    audience: (values.audience || "all") as AdminPlan["audience"],
    features: (values.features || "")
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean),
    badge: values.badge,
    highlight: values.highlight === "true",
    isActive: values.isActive !== "false",
    sortOrder: Number(values.sortOrder || 0),
    description: values.description,
    // Limits
    limits: {
      storiesCount: Number(values["limits.storiesCount"] ?? 5),
      childrenCount: Number(values["limits.childrenCount"] ?? 1),
      hasPremiumContent: values["limits.hasPremiumContent"] === "true",
      hasDownloads: values["limits.hasDownloads"] === "true",
      hasDetailedReports: values["limits.hasDetailedReports"] === "true",
    },
    // Trial
    isTrial: values.isTrial === "true",
    trialDays: Number(values.trialDays ?? 7),
  });

  const submit = async () => {
    setSaving(true);
    setFormError("");
    try {
      if (editing) {
        await admin.updatePlan(editing._id, buildBody());
      } else {
        await admin.createPlan(buildBody());
      }
      setFormOpen(false);
      await reload();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "تعذر حفظ الخطة"));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setFormError("");
    try {
      await remove(toDelete._id);
      setToDelete(null);
    } catch (err) {
      setFormError(getApiErrorMessage(err, "تعذر حذف الخطة"));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminPlan>[] = [
    { key: "name", header: "الاسم", render: (p) => <span className="font-bold">{p.name}</span> },
    { key: "slug", header: "المعرّف", render: (p) => <span className="font-mono text-[#FF7043]">{p.slug}</span> },
    { key: "price", header: "السعر", render: (p) => <span className="font-bold">{formatPrice(p.price, p.currency)}</span> },
    { key: "durationDays", header: "المدة", render: (p) => `${p.durationDays} يوم` },
    { key: "audience", header: "الجمهور", render: (p) => AUDIENCE_LABELS[p.audience] ?? p.audience },
    {
      key: "isActive",
      header: "الحالة",
      render: (p) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${p.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
          {p.isActive ? "نشطة" : "معطّلة"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-[#3D2C1E]">إدارة خطط الاشتراك</h2>
        <p className="text-sm text-[#7A6552] mt-1">
          الخطط هنا تظهر للمستخدمين في صفحة الاشتراك والصفحة الرئيسية، وتُشترى عبر Paymob.
        </p>
      </div>
      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        onSearch={setSearch}
        filters={[
          {
            key: "audience",
            label: "الجمهور",
            value: filters.audience ?? "",
            options: AUDIENCE_OPTIONS,
            onChange: (v) => setFilter("audience", v),
          },
          {
            key: "isActive",
            label: "الحالة",
            value: filters.isActive ?? "",
            options: [
              { value: "true", label: "نشطة" },
              { value: "false", label: "معطّلة" },
            ],
            onChange: (v) => setFilter("isActive", v),
          },
        ]}
        onCreate={openCreate}
        createLabel="خطة جديدة"
        onView={setDetail}
        onEdit={openEdit}
        onDelete={(p) => setToDelete(p)}
        rowKey={(p) => p._id}
      />

      <DetailModal
        open={Boolean(detail)}
        title={detail?.name ?? "تفاصيل الخطة"}
        fields={detail ? planDetailFields(detail) : []}
        onClose={() => setDetail(null)}
      />

      <FormModal
        open={formOpen}
        title={editing ? "تعديل خطة" : "إضافة خطة"}
        fields={FIELDS}
        values={values}
        onChange={onChange}
        onSubmit={submit}
        onClose={() => setFormOpen(false)}
        loading={saving}
        errorMessage={formError}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        message={`حذف الخطة "${toDelete?.name}"؟ لو فيها مشتركين، عطّلها بدل الحذف.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}