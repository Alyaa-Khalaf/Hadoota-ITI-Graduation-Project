"use client";

import ParentHeader from "@/components/ParentDashboard/ParentHeader";
import ChildrenList from "@/components/ParentDashboard/ChildrenList";
import { useState } from "react";
import ChildAnalytics from "@/components/ParentDashboard/ChildAnalytics ";
import AIReportSection from "@/components/ParentDashboard/AIReportSection";
import NotificationsPanel from "@/components/ParentDashboard/NotificationsPanel";
import SettingsPanel from "@/components/ParentDashboard/SettingsPanel";

export default function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");

  return (
    <div>
      <ParentHeader />

      <ChildrenList
  selectedChildId={selectedChildId}
  setSelectedChildId={setSelectedChildId}

/>

     <ChildAnalytics childId={selectedChildId} />

     <AIReportSection childId={selectedChildId} />

      <NotificationsPanel />

      <SettingsPanel/>
    </div>
  );
}