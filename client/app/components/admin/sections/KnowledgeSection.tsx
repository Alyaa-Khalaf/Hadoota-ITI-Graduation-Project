"use client";

import { useCallback, useState } from "react";
import DataTable, { Column } from "../DataTable";
import FormModal, { FormField } from "../FormModal";
import ConfirmDialog from "../ConfirmDialog";
import { useCrudSection } from "@/hooks/useCrudSection";
import { getApiErrorMessage } from "@/utils/api";
import * as admin from "@/services/adminService";
import type { AdminKnowledge } from "@/services/adminService";

const LANG_OPTIONS = [
  { value: "ar", label: "عربي" },
  { value: "en", label: "إنجليزي" },
];

const LANG_LABELS: Record<string, string> = {
  ar: "عربي",
  en: "إنجليزي",
};

const FIELDS: FormField[] = [
  { name: "title", label: "العنوان", required: true },
  { name: "category", label: "التصنيف", required: true },
  { name: "content", label: "المحتوى", type: "textarea", required: true },
  { name: "lang", label: "اللغة", type: "select", options: LANG_OPTIONS },
  { name: "source", label: "المصدر" },
];

export default function KnowledgeSection() {
  const { rows, page, totalPages, total, loading, error, setPage, setSearch, reload, remove } =
    useCrudSection<AdminKnowledge>({ fetcher: admin.listKnowledge, remover: admin.deleteKnowledge });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminKnowledge | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [toDelete, setToDelete] = useState<AdminKnowledge | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setValues({ lang: "ar" });
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (k: AdminKnowledge) => {
    setEditing(k);
    setValues({
      title: k.title,
      category: k.category,
      content: k.content,
      lang: k.lang ?? "ar",
      source: k.source ?? "",
    });
    setFormError("");
    setFormOpen(true);
  };

  const onChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const submit = async () => {
    setSaving(true);
    setFormError("");
    try {
      const body: Partial<AdminKnowledge> = {
        title: values.title,
        category: values.category,
        content: values.content,
        lang: values.lang as AdminKnowledge["lang"],
        source: values.source,
      };
      if (editing) {
        await admin.updateKnowledge(editing._id, body);
      } else {
        await admin.createKnowledge(body);
      }
      setFormOpen(false);
      await reload();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "تعذر حفظ المعلومة"));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await remove(toDelete._id);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<AdminKnowledge>[] = [
    { key: "title", header: "العنوان", render: (k) => <span className="font-bold">{k.title}</span> },
    { key: "category", header: "التصنيف", render: (k) => (
      <span className="px-2 py-1 rounded-lg bg-[#FFF5E6] text-[#FF7043] text-xs font-bold">{k.category}</span>
    ) },
    { key: "lang", header: "اللغة", render: (k) => LANG_LABELS[k.lang ?? "ar"] ?? k.lang },
    { key: "source", header: "المصدر", render: (k) => k.source ?? "—" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-[#3D2C1E]">بنك المعرفة</h2>
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
        onCreate={openCreate}
        createLabel="معلومة جديدة"
        onEdit={openEdit}
        onDelete={(k) => setToDelete(k)}
        rowKey={(k) => k._id}
      />

      <FormModal
        open={formOpen}
        title={editing ? "تعديل معلومة" : "إضافة معلومة"}
        fields={FIELDS}
        values={values}
        onChange={onChange}
        onSubmit={submit}
        onClose={() => setFormOpen(false)}
        loading={saving}
      />
      {formError && <p className="text-red-500 text-xs font-bold text-center">{formError}</p>}

      <ConfirmDialog
        open={Boolean(toDelete)}
        message={`حذف المعلومة "${toDelete?.title}" نهائياً؟`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
