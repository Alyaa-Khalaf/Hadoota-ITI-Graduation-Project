"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Bell, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function ParentHeader() {
  const { setAccessToken, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = async () => {
    try {
      await logout();
      setAccessToken(null);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
      setAccessToken(null);
      router.push("/auth/login");
    }
  };

  return (
    <header className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LEFT - Brand */}
        <div className="flex items-center gap-3">
          <div className="text-xl">🧸</div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Parent Dashboard
            </h1>
            <p className="text-xs text-gray-500">
              Manage children, analytics & AI reports
            </p>
          </div>
        </div>

        {/* CENTER - NAVIGATION */}
        <nav className="hidden md:flex items-center gap-2 bg-gray-50 p-1 rounded-xl">

          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1
              ${activeTab === "overview"
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-white"
              }`}
          >
            <LayoutDashboard size={14} />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg
              ${activeTab === "reports"
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-white"
              }`}
          >
            AI Reports
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1
              ${activeTab === "notifications"
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-white"
              }`}
          >
            <Bell size={14} />
            Notifications
          </button>

        </nav>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-2">

          <button
            onClick={() => router.push("/parent/settings")}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Settings size={18} />
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1"
          >
            <LogOut size={14} />
            Logout
          </button>

        </div>
      </div>
    </header>
  );
}