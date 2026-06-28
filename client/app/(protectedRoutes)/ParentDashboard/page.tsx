"use client";

import ParentHeader from "@/components/ParentDashboard/ParentHeader";
import ChildrenList from "@/components/ParentDashboard/ChildrenList";
import { useState, useEffect } from "react";
import { useChildren } from "@/hooks/useChildren";
import ChildAnalytics from "@/components/ParentDashboard/ChildAnalytics ";
import AIReportSection from "@/components/ParentDashboard/AIReportSection";
import NotificationsPanel from "@/components/ParentDashboard/NotificationsPanel";
import SettingsPanel from "@/components/ParentDashboard/SettingsPanel";

export type DashboardTab = "overview" | "reports" | "notifications";

export default function ParentDashboard() {
  const [selectedChildId, setSelectedChildId] = useState("");
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const { children, loading } = useChildren();
  // Auto-select first child when children load
  useEffect(() => {
    if (!loading && children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0]._id);
    }
  }, [children, loading, selectedChildId]);

  return (
    <div dir="rtl">
      <ParentHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-6xl mx-auto px-6 mt-6">
        {/* نظرة عامة: قائمة الأطفال + التحليلات */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <ChildrenList
  selectedChildId={selectedChildId}
  setSelectedChildId={setSelectedChildId}
/>

            {selectedChildId && <ChildAnalytics childId={selectedChildId} />}
          </div>
        )}

        {/* تقارير الذكاء الاصطناعي */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {!selectedChildId ? (
              <div className="p-6 text-sm text-gray-400 text-center bg-white rounded-xl border">
                `اختر طفلاً أولاً من تبويب نظرة عامة`
              </div>
            ) : (
              <AIReportSection childId={selectedChildId} />
            )}
          </div>
        )}

        {/* الإشعارات والإعدادات */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <NotificationsPanel />
            <SettingsPanel />
          </div>
        )}
      </div>
    </div>
  );
}