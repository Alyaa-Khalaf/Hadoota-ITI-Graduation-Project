"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import DataTable, { Column } from "../DataTable";
import DetailModal from "../DetailModal";
import { transactionDetailFields } from "../adminDetails";
import { useCrudSection } from "@/hooks/useCrudSection";
import { getApiErrorMessage } from "@/utils/api";
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

const STATUS_OPTIONS = [
  { value: "succeeded", label: "ناجحة" },
  { value: "failed", label: "فاشلة" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "refunded", label: "مستردة" },
];

const PLAN_OPTIONS = [
  { value: "pro", label: "Pro" },
  { value: "family", label: "Family" },
  { value: "schools", label: "Schools" },
];

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
  const { rows, page, totalPages, total, loading, error, filters, setPage, setSearch, setFilter, reload } =
    useCrudSection<AdminTransaction>({ fetcher: admin.listTransactions });

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [detail, setDetail] = useState<AdminTransaction | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage("");
    try {
      const result = await admin.syncTransactions();
      setSyncMessage(`تمت مزامنة ${result.synced} معاملة من سجلات الدفع`);
      await reload();
    } catch (err) {
      setSyncMessage(getApiErrorMessage(err, "تعذر مزامنة المعاملات"));
    } finally {
      setSyncing(false);
    }
  };

  const openDetails = async (t: AdminTransaction) => {
    setDetailLoading(true);
    try {
      const full = await admin.getTransaction(t._id);
      setDetail(full);
    } catch {
      setDetail(t);
    } finally {
      setDetailLoading(false);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[#3D2C1E]">المعاملات المالية</h2>
          <p className="text-sm text-[#7A6552] mt-1">
            تُسجَّل المعاملات تلقائياً عبر Paymob — أو مزامنة من سجلات المستخدمين.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#E8DED4] bg-white text-sm font-bold text-[#3D2C1E] hover:bg-[#FFF5E6] transition disabled:opacity-50"
        >
          <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
          مزامنة المدفوعات
        </button>
      </div>

      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
      {syncMessage && (
        <p className={`text-sm font-bold ${syncMessage.includes("تعذر") ? "text-red-500" : "text-green-600"}`}>
          {syncMessage}
        </p>
      )}

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
            key: "plan",
            label: "الخطة",
            value: filters.plan ?? "",
            options: PLAN_OPTIONS,
            onChange: (v) => setFilter("plan", v),
          },
        ]}
        onView={openDetails}
        rowKey={(t) => t._id}
        emptyText="لا توجد معاملات — جرّب مزامنة المدفوعات"
      />

      <DetailModal
        open={Boolean(detail)}
        title="تفاصيل المعاملة"
        fields={detail ? transactionDetailFields(detail) : []}
        loading={detailLoading}
        onClose={() => setDetail(null)}
      />
    </div>
  );
}
