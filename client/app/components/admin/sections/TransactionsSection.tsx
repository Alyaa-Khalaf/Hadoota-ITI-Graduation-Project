"use client";

import DataTable, { Column } from "../DataTable";
import { useCrudSection } from "@/hooks/useCrudSection";
import * as admin from "@/services/adminService";
import type { AdminTransaction } from "@/services/adminService";

const STATUS_LABELS: Record<AdminTransaction["status"], string> = {
  succeeded: "ناجحة",
  failed: "فاشلة",
  pending: "قيد الانتظار",
  refunded: "مستردة",
};

const STATUS_COLORS: Record<AdminTransaction["status"], string> = {
  succeeded: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-600",
  pending: "bg-yellow-50 text-yellow-700",
  refunded: "bg-blue-50 text-blue-600",
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TransactionsSection() {
  const { rows, page, totalPages, total, loading, error, setPage, setSearch } =
    useCrudSection<AdminTransaction>({ fetcher: admin.listTransactions });

  const columns: Column<AdminTransaction>[] = [
    {
      key: "user",
      header: "المستخدم / المدرسة",
      render: (t) => (
        <div>
          {t.user ? (
            <>
              <p className="font-bold">{t.user.name}</p>
              <p className="text-xs text-[#7A6552]">{t.user.email}</p>
            </>
          ) : t.school ? (
            <>
              <p className="font-bold">{t.school.name}</p>
              <p className="text-xs text-[#7A6552]">{t.school.code}</p>
            </>
          ) : (
            "—"
          )}
        </div>
      ),
    },
    {
      key: "amount",
      header: "المبلغ",
      render: (t) => (
        <span className="font-bold">{formatAmount(t.amount, t.currency)}</span>
      ),
    },
    { key: "plan", header: "الخطة", render: (t) => t.plan ?? "—" },
    {
      key: "status",
      header: "الحالة",
      render: (t) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${STATUS_COLORS[t.status]}`}>
          {STATUS_LABELS[t.status]}
        </span>
      ),
    },
    {
      key: "paymobTransactionId",
      header: "رقم المعاملة",
      render: (t) => t.paymobTransactionId ?? "—",
    },
    {
      key: "createdAt",
      header: "التاريخ",
      render: (t) => formatDate(t.createdAt),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-[#3D2C1E]">المعاملات المالية</h2>
        <p className="text-sm text-[#7A6552] mt-1">
          تُسجَّل المعاملات تلقائياً عند استلام إشعارات Paymob.
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
        rowKey={(t) => t._id}
        emptyText="لا توجد معاملات Paymob مسجّلة حالياً"
      />
    </div>
  );
}
