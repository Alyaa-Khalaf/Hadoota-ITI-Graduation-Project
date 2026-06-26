"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type ProgressReport = {
  summary: string;
  recommendations: string[];
  aiInsights?: string;
  nextWeekTopics?: string[];
  encouragementMessage?: string;
};

type Props = {
  childId: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AIReportSection({ childId }: Props) {
  const { accessToken } = useAuth();

  const [report, setReport] = useState<ProgressReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // 📥 fetch report
  const fetchReport = async () => {
    if (!childId || !accessToken) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/analytics/${childId}/progress`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();

      if (data?.success) {
        setReport(data.data);
      } else {
        setReport(null);
      }
    } catch (err) {
      console.error("AI report error:", err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 generate new report
  const generateReport = async () => {
    if (!childId || !accessToken) return;

    try {
      setGenerating(true);

      const res = await fetch(
        `${API_BASE}/api/parent-agent/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ childId }),
        }
      );

      const data = await res.json();

      if (data?.success) {
        await fetchReport();
      }
    } catch (err) {
      console.error("Generate report error:", err);
    } finally {
      setGenerating(false);
    }
  };

  // 📌 reload when child changes
  useEffect(() => {
    if (childId) {
      fetchReport();
    }
  }, [childId, accessToken]);

  if (!childId) {
    return (
      <div dir="rtl" className="text-sm text-gray-400 p-4">
        اختر طفلاً لعرض تقرير الذكاء الاصطناعي
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-5 space-y-4">

      {/* Header */}
      <div dir="rtl" className="flex justify-between items-center">
        <h2 className="font-bold text-sm">تقرير الذكاء الاصطناعي الأسبوعي</h2>

        <button
          onClick={generateReport}
          disabled={generating}
          className="px-3 py-1 text-xs bg-primary text-white rounded-md"
        >
          {generating ? "جاري التوليد..." : "توليد التقرير"}
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div dir="rtl" className="text-sm text-gray-500 animate-pulse">
          جارٍ تحميل التقرير...
        </div>
      ) : !report ? (
        <div dir="rtl" className="text-sm text-gray-400">
          لا يوجد تقرير متاح. قم بتوليد تقرير.
        </div>
      ) : (
        <div className="space-y-4">

          {/* Summary */}
          <div dir="rtl">
            <h3 className="text-xs font-bold">الملخص</h3>
            <p className="text-sm text-gray-600">{report.summary}</p>
          </div>

          {/* Insights */}
          {report.aiInsights && (
            <div dir="rtl">
              <h3 className="text-xs font-bold">الاستنتاجات</h3>
              <p className="text-sm text-gray-600">{report.aiInsights}</p>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations?.length > 0 && (
            <div dir="rtl">
              <h3 className="text-xs font-bold">التوصيات</h3>
              <ul className="list-disc pr-4 text-sm text-gray-600">
                {report.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Topics */}
          {report.nextWeekTopics?.length > 0 && (
            <div dir="rtl">
              <h3 className="text-xs font-bold">مواضيع الأسبوع القادم</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {report.nextWeekTopics.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Encouragement */}
          {report.encouragementMessage && (
            <div dir="rtl" className="border-t pt-3">
              <p className="text-sm italic text-orange-600">
                {report.encouragementMessage}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}