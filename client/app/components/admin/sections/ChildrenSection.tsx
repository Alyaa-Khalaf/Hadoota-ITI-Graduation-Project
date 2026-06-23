"use client";

import { useCallback, useState } from "react";
import DataTable, { Column } from "../DataTable";
import FormModal, { FormField } from "../FormModal";
import ConfirmDialog from "../ConfirmDialog";
import { useCrudSection } from "@/hooks/useCrudSection";
import { getApiErrorMessage } from "@/utils/api";
import * as admin from "@/services/adminService";
import type { AdminChild } from "@/services/adminService";

const EDIT_FIELDS: FormField[] = [
  { name: "name", label: "الاسم", required: true },
  { name: "age", label: "العمر", type: "number", required: true },
  { name: "gender", label: "النوع", type: "select", required: true, options: [
    { value: "male", label: "ذكر" },
    { value: "female", label: "أنثى" },
  ] },
  { name: "learningLevel", label: "المستوى", type: "select", options: [
    { value: "beginner", label: "مبتدئ" },
    { value: "intermediate", label: "متوسط" },
    { value: "advanced", label: "متقدم" },
  ] },
];

export default function ChildrenSection() {
  const { rows, page, totalPages, total, loading, error, setPage, setSearch, reload, remove } =
    useCrudSection<AdminChild>({ fetcher: admin.listChildren, remover: admin.deleteChild });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminChild | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [toDelete, setToDelete] = useState<AdminChild | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openEdit = (ch: AdminChild) => {
    setEditing(ch);
    setValues({
      name: ch.name,
      age: String(ch.age),
      gender: ch.gender,
      learningLevel: ch.learningLevel ?? "beginner",
    });
    setFormError("");
    setFormOpen(true);
  };

  const onChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const submit = async () => {
    if (!editing) return;
    setSaving(true);
    setFormError("");
    try {
      await admin.updateChild(editing._id, {
        name: values.name,
        age: Number(values.age),
        gender: values.gender as AdminChild["gender"],
        learningLevel: values.learningLevel,
      });
      setFormOpen(false);
      await reload();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "تعذر حفظ الطفل"));
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

  const columns: Column<AdminChild>[] = [
    { key: "name", header: "الاسم", render: (ch) => <span className="font-bold">{ch.name}</span> },
    { key: "age", header: "العمر" },
    { key: "gender", header: "النوع", render: (ch) => (ch.gender === "male" ? "ذكر" : "أنثى") },
    { key: "parent", header: "ولي الأمر", render: (ch) => ch.parentId?.name ?? "—" },
    { key: "school", header: "المدرسة", render: (ch) => ch.schoolId?.name ?? "—" },
    { key: "level", header: "المستوى", render: (ch) => `Lv.${ch.level ?? 1}` },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-[#3D2C1E]">إدارة الأطفال</h2>
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
        onEdit={openEdit}
        onDelete={(ch) => setToDelete(ch)}
        rowKey={(ch) => ch._id}
      />

      <FormModal
        open={formOpen}
        title="تعديل طفل"
        fields={EDIT_FIELDS}
        values={values}
        onChange={onChange}
        onSubmit={submit}
        onClose={() => setFormOpen(false)}
        loading={saving}
      />
      {formError && <p className="text-red-500 text-xs font-bold text-center">{formError}</p>}

      <ConfirmDialog
        open={Boolean(toDelete)}
        message={`حذف الطفل "${toDelete?.name}" سيحذف كل حواديته واختباراته نهائياً. متأكد؟`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
