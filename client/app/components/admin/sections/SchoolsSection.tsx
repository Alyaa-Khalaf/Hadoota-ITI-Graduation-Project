"use client";

import { useCallback, useState } from "react";
import DataTable, { Column } from "../DataTable";
import FormModal, { FormField } from "../FormModal";
import ConfirmDialog from "../ConfirmDialog";
import { useCrudSection } from "@/hooks/useCrudSection";
import { getApiErrorMessage } from "@/utils/api";
import * as admin from "@/services/adminService";
import type { AdminSchool } from "@/services/adminService";

const STATUS_OPTIONS = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "active", label: "نشط" },
  { value: "trialing", label: "تجريبي" },
  { value: "past_due", label: "متأخر" },
  { value: "canceled", label: "ملغي" },
];

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  active: "نشط",
  trialing: "تجريبي",
  past_due: "متأخر",
  canceled: "ملغي",
};

const FIELDS: FormField[] = [
  { name: "name", label: "اسم المدرسة", required: true },
  { name: "subscriptionStatus", label: "حالة الاشتراك", type: "select", options: STATUS_OPTIONS },
];

export default function SchoolsSection() {
  const { rows, page, totalPages, total, loading, error, setPage, setSearch, reload, remove } =
    useCrudSection<AdminSchool>({ fetcher: admin.listSchools, remover: admin.deleteSchool });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminSchool | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [toDelete, setToDelete] = useState<AdminSchool | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setValues({ subscriptionStatus: "pending" });
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (s: AdminSchool) => {
    setEditing(s);
    setValues({ name: s.name, subscriptionStatus: s.subscriptionStatus });
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
      if (editing) {
        await admin.updateSchool(editing._id, {
          name: values.name,
          subscriptionStatus: values.subscriptionStatus as AdminSchool["subscriptionStatus"],
        });
      } else {
        await admin.createSchool({
          name: values.name,
          subscriptionStatus: values.subscriptionStatus as AdminSchool["subscriptionStatus"],
        });
      }
      setFormOpen(false);
      await reload();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "تعذر حفظ المدرسة"));
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

  const columns: Column<AdminSchool>[] = [
    { key: "name", header: "الاسم", render: (s) => <span className="font-bold">{s.name}</span> },
    { key: "code", header: "الكود", render: (s) => <span className="font-mono text-[#FF7043]">{s.code}</span> },
    { key: "admin", header: "المدير", render: (s) => s.adminId?.name ?? "—" },
    { key: "status", header: "الاشتراك", render: (s) => STATUS_LABELS[s.subscriptionStatus] ?? s.subscriptionStatus },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-[#3D2C1E]">إدارة المدارس</h2>
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
        createLabel="مدرسة جديدة"
        onEdit={openEdit}
        onDelete={(s) => setToDelete(s)}
        rowKey={(s) => s._id}
      />

      <FormModal
        open={formOpen}
        title={editing ? "تعديل مدرسة" : "إضافة مدرسة"}
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
        message={`حذف المدرسة "${toDelete?.name}"؟ سيتم فك ارتباط طلابها بها.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
