"use client";

import { useCallback, useState } from "react";
import DataTable, { Column } from "../DataTable";
import DetailModal from "../DetailModal";
import FormModal, { FormField } from "../FormModal";
import ConfirmDialog from "../ConfirmDialog";
import { userDetailFields } from "../adminDetails";
import { useCrudSection } from "@/hooks/useCrudSection";
import { getApiErrorMessage } from "@/utils/api";
import * as admin from "@/services/adminService";
import type { AdminUser } from "@/services/adminService";

const ROLE_LABELS: Record<string, string> = {
  parent: "ولي أمر",
  admin: "مدير",
  // teacher: "معلم",
  student: "طالب",
};

const ROLE_OPTIONS = [
  { value: "parent", label: "ولي أمر" },
  // { value: "teacher", label: "معلم" },
  { value: "student", label: "طالب" },
  { value: "admin", label: "مدير" },
];

const CREATE_FIELDS: FormField[] = [
  { name: "name", label: "الاسم", required: true },
  { name: "email", label: "الإيميل", type: "email", required: true },
  { name: "password", label: "كلمة المرور", type: "password", required: true },
  { name: "role", label: "الدور", type: "select", required: true, options: ROLE_OPTIONS },
];

const EDIT_FIELDS: FormField[] = [
  { name: "name", label: "الاسم", required: true },
  { name: "email", label: "الإيميل", type: "email", required: true },
  { name: "role", label: "الدور", type: "select", required: true, options: ROLE_OPTIONS },
];

export default function UsersSection() {
  const { rows, page, totalPages, total, loading, error, filters, setPage, setSearch, setFilter, reload, remove } =
    useCrudSection<AdminUser>({ fetcher: admin.listUsers, remover: admin.deleteUser });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [detail, setDetail] = useState<AdminUser | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const openDetails = async (u: AdminUser) => {
    setDetailLoading(true);
    try {
      const full = await admin.getUser(u._id);
      setDetail(full);
    } catch {
      setDetail(u);
    } finally {
      setDetailLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setValues({ role: "parent" });
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setValues({ name: u.name, email: u.email, role: u.role });
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
        await admin.updateUser(editing._id, {
          name: values.name,
          email: values.email,
          role: values.role as AdminUser["role"],
        });
      } else {
        await admin.createUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role as AdminUser["role"],
        });
      }
      setFormOpen(false);
      await reload();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "تعذر حفظ المستخدم"));
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

  const columns: Column<AdminUser>[] = [
    { key: "name", header: "الاسم", render: (u) => <span className="font-bold">{u.name}</span> },
    { key: "email", header: "الإيميل" },
    { key: "role", header: "الدور", render: (u) => (
      <span className="px-2 py-1 rounded-lg bg-[#FFF5E6] text-[#FF7043] text-xs font-bold">{ROLE_LABELS[u.role] ?? u.role}</span>
    ) },
    { key: "subscription", header: "الاشتراك", render: (u) => u.subscription?.plan ?? "free" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-[#3D2C1E]">إدارة المستخدمين</h2>
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
        filters={[{
          key: "role",
          label: "الدور",
          value: filters.role ?? "",
          options: ROLE_OPTIONS,
          onChange: (v) => setFilter("role", v),
        }]}
        onCreate={openCreate}
        createLabel="مستخدم جديد"
        onView={openDetails}
        onEdit={openEdit}
        onDelete={(u) => setToDelete(u)}
        rowKey={(u) => u._id}
      />

      <DetailModal
        open={Boolean(detail)}
        title={detail?.name ?? "تفاصيل المستخدم"}
        fields={detail ? userDetailFields(detail) : []}
        loading={detailLoading}
        onClose={() => setDetail(null)}
      />

      <FormModal
        open={formOpen}
        title={editing ? "تعديل مستخدم" : "إضافة مستخدم"}
        fields={editing ? EDIT_FIELDS : CREATE_FIELDS}
        values={values}
        onChange={onChange}
        onSubmit={submit}
        onClose={() => setFormOpen(false)}
        loading={saving}
        errorMessage={formError}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        message={`هل أنت متأكد من حذف "${toDelete?.name}"؟ سيتم حذف كل أطفاله وحواديتهم نهائياً.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
