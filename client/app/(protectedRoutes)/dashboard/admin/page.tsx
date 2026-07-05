"use client";

import { useState } from "react";
import {
  LayoutDashboard, Users, Baby, BookOpen, School, FileQuestion, BrainCircuit, CreditCard, Tag, Coins,
} from "lucide-react";

import RoleGuard from "@/components/admin/RoleGuard";
import AdminShell, { AdminSection } from "@/components/admin/AdminShell";
import { useAuth } from "@/context/AuthContext";

import OverviewSection from "@/components/admin/sections/OverviewSection";
import UsersSection from "@/components/admin/sections/UsersSection";
import ChildrenSection from "@/components/admin/sections/ChildrenSection";
import StoriesSection from "@/components/admin/sections/StoriesSection";
import SchoolsSection from "@/components/admin/sections/SchoolsSection";
import QuizzesSection from "@/components/admin/sections/QuizzesSection";
import KnowledgeSection from "@/components/admin/sections/KnowledgeSection";
import TransactionsSection from "@/components/admin/sections/TransactionsSection";
import PlansSection from "@/components/admin/sections/PlansSection";
import TokenUsageSection from "@/components/admin/sections/TokenUsageSection";


const SECTIONS: AdminSection[] = [
  { key: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { key: "users", label: "المستخدمين", icon: Users },
  { key: "children", label: "الأطفال", icon: Baby },
  { key: "stories", label: "الحواديت", icon: BookOpen },
  { key: "schools", label: "المدارس", icon: School },
  { key: "quizzes", label: "الاختبارات", icon: FileQuestion },
  { key: "transactions", label: "المعاملات", icon: CreditCard },
  { key: "plans", label: "الخطط", icon: Tag },
  { key: "tokenUsage", label: "استهلاك التوكنز", icon: Coins },
  { key: "knowledge", label: "بنك المعرفة", icon: BrainCircuit },
];

function renderSection(key: string) {
  switch (key) {
    case "users":
      return <UsersSection />;
    case "children":
      return <ChildrenSection />;
    case "stories":
      return <StoriesSection />;
    case "schools":
      return <SchoolsSection />;
    case "quizzes":
      return <QuizzesSection />;
    case "transactions":
      return <TransactionsSection />;
    case "plans":
      return <PlansSection />;
    case "tokenUsage":
      return <TokenUsageSection />;
    case "knowledge":
      return <KnowledgeSection />;
    default:
      return <OverviewSection />;
  }
}

export default function AdminDashboardPage() {
  const [active, setActive] = useState("overview");
  const { logout } = useAuth();

  return (
    <RoleGuard>
      <AdminShell
        sections={SECTIONS}
        active={active}
        onSelect={setActive}
        onLogout={logout}
      >
        {renderSection(active)}
      </AdminShell>
    </RoleGuard>
  );
}