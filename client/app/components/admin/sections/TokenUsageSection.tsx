"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import * as admin from "@/services/adminService";
import type { AdminTokenUsageSummary, AdminTokenUsageEntry } from "@/services/adminService";
import { getApiErrorMessage } from "@/utils/api";

const PROVIDER_LABELS: Record<string, string> = {
  gemini: "Gemini",
  openai: "OpenAI",
  pollinations: "Pollinations",
};

const OPERATION_LABELS: Record<string, string> = {
  story_structure: "نص القصة",
  scene_image: "صورة المشهد",
  other: "أخرى",
};

function formatNumber(n: number) {
  return new Intl.NumberFormat("ar-EG").format(n || 0);
}

function formatDate(d: string) {
  return new Date(d).toLocaleString("ar-EG", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function TokenUsageSection() {
  const [rows, setRows] = useState<AdminTokenUsageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // تفاصيل مستخدم واحد (لما يتم فتحه)
  const [selectedUser, setSelectedUser] = useState<AdminTokenUsageSummary | null>(null);
  const [entries, setEntries] = useState<AdminTokenUsageEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [entriesError, setEntriesError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await admin.getTokenUsageSummary();
      setRows(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "تعذر جلب بيانات الاستهلاك"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openUserDetail = async (user: AdminTokenUsageSummary) => {
    setSelectedUser(user);
    setEntriesLoading(true);
    setEntriesError("");
    try {
      const result = await admin.getTokenUsageForUser(user.userId, { limit: 50 });
      setEntries(result.items);
    } catch (err) {
      setEntriesError(getApiErrorMessage(err, "تعذر جلب تفاصيل الاستهلاك"));
    } finally {
      setEntriesLoading(false);
    }
  };

  const totals = rows.reduce(
    (acc, r) => ({
      totalTokens: acc.totalTokens + (r.totalTokens || 0),
      imageCount: acc.imageCount + (r.imageCount || 0),
      callsCount: acc.callsCount + (r.callsCount || 0),
    }),
    { totalTokens: 0, imageCount: 0, callsCount: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#3D2C1E]">استهلاك التوكنز (AI)</h2>
          <p className="text-sm text-[#7A6552] mt-1">
            استهلاك كل مستخدم من نماذج توليد القصص والصور (Gemini / OpenAI / Pollinations).
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-2xl bg-[#FF7043] text-white font-black text-sm hover:bg-[#E65F33] transition"
        >
          تحديث
        </button>
      </div>

      {/* بطاقات إجمالية سريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-[#E8DED4] p-4">
          <p className="text-xs text-[#7A6552] font-bold">إجمالي التوكنز</p>
          <p className="text-2xl font-black text-[#3D2C1E] mt-1">{formatNumber(totals.totalTokens)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8DED4] p-4">
          <p className="text-xs text-[#7A6552] font-bold">إجمالي الصور</p>
          <p className="text-2xl font-black text-[#3D2C1E] mt-1">{formatNumber(totals.imageCount)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8DED4] p-4">
          <p className="text-xs text-[#7A6552] font-bold">إجمالي الاستدعاءات</p>
          <p className="text-2xl font-black text-[#3D2C1E] mt-1">{formatNumber(totals.callsCount)}</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

      <div className="bg-white rounded-3xl border border-[#E8DED4] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FFF7EC] text-[#3D2C1E] text-right">
              <th className="p-3 font-black">المستخدم</th>
              <th className="p-3 font-black">إجمالي التوكنز</th>
              <th className="p-3 font-black">Prompt</th>
              <th className="p-3 font-black">Completion</th>
              <th className="p-3 font-black">عدد الصور</th>
              <th className="p-3 font-black">عدد الاستدعاءات</th>
              <th className="p-3 font-black">آخر استخدام</th>
              <th className="p-3 font-black">تفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-[#7A6552]">
                  جاري التحميل...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-[#7A6552]">
                  لا يوجد استهلاك مسجّل بعد.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.userId} className="border-t border-[#F0E8DC] hover:bg-[#FFFBF0] transition">
                  <td className="p-3">
                    <p className="font-bold text-[#3D2C1E]">{r.userName || "—"}</p>
                    <p className="text-xs text-[#7A6552]">{r.userEmail}</p>
                  </td>
                  <td className="p-3 font-bold">{formatNumber(r.totalTokens)}</td>
                  <td className="p-3">{formatNumber(r.promptTokens)}</td>
                  <td className="p-3">{formatNumber(r.completionTokens)}</td>
                  <td className="p-3">{formatNumber(r.imageCount)}</td>
                  <td className="p-3">{formatNumber(r.callsCount)}</td>
                  <td className="p-3 text-xs text-[#7A6552]">{formatDate(r.lastUsedAt)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openUserDetail(r)}
                      className="text-[#FF7043] font-bold hover:underline"
                    >
                      عرض
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          dir="rtl"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-xl border border-[#E8DED4] max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#E8DED4] sticky top-0 bg-white">
              <h3 className="text-lg font-black text-[#3D2C1E]">
                تفاصيل استهلاك: {selectedUser.userName || selectedUser.userEmail}
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-[#7A6552] hover:text-[#3D2C1E] transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              {entriesLoading ? (
                <p className="text-center text-[#7A6552] py-6">جاري التحميل...</p>
              ) : entriesError ? (
                <p className="text-red-500 text-sm font-bold text-center py-6">{entriesError}</p>
              ) : entries.length === 0 ? (
                <p className="text-center text-[#7A6552] py-6">لا توجد استدعاءات مسجّلة.</p>
              ) : (
                <div className="space-y-2">
                  {entries.map((e) => (
                    <div
                      key={e._id}
                      className="border border-[#E8DED4] rounded-2xl p-3 flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-bold text-[#3D2C1E]">
                          {PROVIDER_LABELS[e.provider] || e.provider} —{" "}
                          {OPERATION_LABELS[e.operation] || e.operation}
                        </p>
                        <p className="text-xs text-[#7A6552]">
                          {e.storyId?.title ? `القصة: ${e.storyId.title}` : ""}{" "}
                          {e.childId?.name ? `· الطفل: ${e.childId.name}` : ""}
                        </p>
                        <p className="text-xs text-[#7A6552] mt-1">{formatDate(e.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        {e.totalTokens > 0 && (
                          <p className="font-bold text-[#FF7043]">
                            {formatNumber(e.totalTokens)} توكن
                          </p>
                        )}
                        {e.imageCount > 0 && (
                          <p className="text-xs text-[#7A6552]">{e.imageCount} صورة</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}