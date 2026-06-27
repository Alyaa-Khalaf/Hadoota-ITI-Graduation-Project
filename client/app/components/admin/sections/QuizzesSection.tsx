"use client";

import { useState } from "react";
import DataTable, { Column } from "../DataTable";
import DetailModal from "../DetailModal";
import ConfirmDialog from "../ConfirmDialog";
import { quizDetailFields } from "../adminDetails";
import { useCrudSection } from "@/hooks/useCrudSection";
import * as admin from "@/services/adminService";
import type { AdminQuiz } from "@/services/adminService";

export default function QuizzesSection() {
  const { rows, page, totalPages, total, loading, error, setPage, remove } =
    useCrudSection<AdminQuiz>({ fetcher: admin.listQuizzes, remover: admin.deleteQuiz });

  const [toDelete, setToDelete] = useState<AdminQuiz | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [detail, setDetail] = useState<AdminQuiz | null>(null);

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

  const columns: Column<AdminQuiz>[] = [
    { key: "story", header: "الحدوتة", render: (q) => <span className="font-bold">{q.story?.title ?? "—"}</span> },
    { key: "child", header: "الطفل", render: (q) => q.child?.name ?? "—" },
    { key: "questionsCount", header: "عدد الأسئلة" },
    { key: "bestScore", header: "أعلى نتيجة", render: (q) => `${q.bestScore}%` },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-[#3D2C1E]">إدارة الاختبارات</h2>
      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        onView={setDetail}
        onDelete={(q) => setToDelete(q)}
        rowKey={(q) => q._id}
      />

      <DetailModal
        open={Boolean(detail)}
        title="تفاصيل الاختبار"
        fields={detail ? quizDetailFields(detail) : []}
        onClose={() => setDetail(null)}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        message="حذف هذا الاختبار نهائياً؟"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
