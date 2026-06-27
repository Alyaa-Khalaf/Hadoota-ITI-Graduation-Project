"use client";

import { useState } from "react";
import { Flag, FlagOff } from "lucide-react";
import DataTable, { Column } from "../DataTable";
import DetailModal from "../DetailModal";
import ConfirmDialog from "../ConfirmDialog";
import { storyDetailFields } from "../adminDetails";
import { useCrudSection } from "@/hooks/useCrudSection";
import { getApiErrorMessage } from "@/utils/api";
import * as admin from "@/services/adminService";
import type { AdminStory } from "@/services/adminService";

const STATUS_LABELS: Record<string, string> = {
  completed: "مكتملة",
  generating: "قيد التوليد",
  failed: "فشلت",
};

const STATUS_OPTIONS = [
  { value: "completed", label: "مكتملة" },
  { value: "generating", label: "قيد التوليد" },
  { value: "failed", label: "فشلت" },
];

function FlagButton({ story, busy, onToggle }: { story: AdminStory; busy: boolean; onToggle: (s: AdminStory) => void }) {
  const flagged = story.safetyCheck?.flagged;
  return (
    <button
      onClick={() => onToggle(story)}
      disabled={busy}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition disabled:opacity-50 ${flagged ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}
    >
      {flagged ? <Flag size={13} /> : <FlagOff size={13} />}
      {flagged ? "مبلّغ عنها" : "آمنة"}
    </button>
  );
}

export default function StoriesSection() {
  const { rows, page, totalPages, total, loading, error, filters, setPage, setSearch, setFilter, reload, remove } =
    useCrudSection<AdminStory>({ fetcher: admin.listStories, remover: admin.deleteStory });

  const [toDelete, setToDelete] = useState<AdminStory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [actionError, setActionError] = useState("");
  const [detail, setDetail] = useState<AdminStory | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const openDetails = async (s: AdminStory) => {
    setDetailLoading(true);
    try {
      const full = await admin.getStory(s._id);
      setDetail(full);
    } catch {
      setDetail(s);
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleFlag = async (story: AdminStory) => {
    setBusyId(story._id);
    setActionError("");
    const nextFlagged = !story.safetyCheck?.flagged;
    try {
      await admin.updateStory(story._id, {
        safetyCheck: { safe: !nextFlagged, flagged: nextFlagged, reason: nextFlagged ? "تم التبليغ يدوياً من الأدمن" : "" },
      });
      await reload();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "تعذر تحديث حالة المراجعة"));
    } finally {
      setBusyId("");
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

  const columns: Column<AdminStory>[] = [
    { key: "title", header: "العنوان", render: (s) => <span className="font-bold">{s.title}</span> },
    { key: "child", header: "الطفل", render: (s) => s.childId?.name ?? "—" },
    { key: "topic", header: "الموضوع" },
    { key: "status", header: "الحالة", render: (s) => STATUS_LABELS[s.status] ?? s.status },
    { key: "flag", header: "المراجعة", render: (s) => <FlagButton story={s} busy={busyId === s._id} onToggle={toggleFlag} /> },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-[#3D2C1E]">إدارة الحواديت ومراجعتها</h2>
      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
      {actionError && <p className="text-red-500 text-sm font-bold">{actionError}</p>}
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
            key: "status",
            label: "الحالة",
            value: filters.status ?? "",
            options: STATUS_OPTIONS,
            onChange: (v) => setFilter("status", v),
          },
          {
            key: "flagged",
            label: "التبليغ",
            value: filters.flagged ?? "",
            options: [{ value: "true", label: "مبلّغ عنها فقط" }],
            onChange: (v) => setFilter("flagged", v),
          },
        ]}
        onView={openDetails}
        onDelete={(s) => setToDelete(s)}
        rowKey={(s) => s._id}
      />

      <DetailModal
        open={Boolean(detail)}
        title={detail?.title ?? "تفاصيل الحدوتة"}
        fields={detail ? storyDetailFields(detail) : []}
        loading={detailLoading}
        onClose={() => setDetail(null)}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        message={`حذف الحدوتة "${toDelete?.title}" نهائياً مع اختباراتها؟`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
