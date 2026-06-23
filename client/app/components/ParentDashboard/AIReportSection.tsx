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

const API_BASE = "http://localhost:5000";

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
      <div className="text-sm text-gray-400 p-4">
        اختر طفل لعرض تقرير الـ AI
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-5 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-sm">AI Weekly Report</h2>

        <button
          onClick={generateReport}
          disabled={generating}
          className="px-3 py-1 text-xs bg-orange-500 text-white rounded-md"
        >
          {generating ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-sm text-gray-500 animate-pulse">
          Loading report...
        </div>
      ) : !report ? (
        <div className="text-sm text-gray-400">
          No report available. Generate one.
        </div>
      ) : (
        <div className="space-y-4">

          {/* Summary */}
          <div>
            <h3 className="text-xs font-bold">Summary</h3>
            <p className="text-sm text-gray-600">{report.summary}</p>
          </div>

          {/* Insights */}
          {report.aiInsights && (
            <div>
              <h3 className="text-xs font-bold">Insights</h3>
              <p className="text-sm text-gray-600">{report.aiInsights}</p>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold">Recommendations</h3>
              <ul className="list-disc pr-4 text-sm text-gray-600">
                {report.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Topics */}
          {report.nextWeekTopics?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold">Next Week Topics</h3>
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
            <div className="border-t pt-3">
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