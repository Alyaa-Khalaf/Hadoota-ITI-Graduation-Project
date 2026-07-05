"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Notification = {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type Filter = "all" | "unread" | "read";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NotificationsPanel() {
  const { accessToken, user, isLoading: authLoading } = useAuth();

  // ⚠️ عدّلي هنا لو حقل الـ id عندك في user اسمه مختلف (زي user?.id بدل user?._id)
  const userId = (user as any)?._id || (user as any)?.id;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  // 📥 fetch notifications
  const fetchNotifications = async () => {
    if (!accessToken || !userId) {
      setLoading(false);
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/notifications/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        // 🛡️ getUserNotifications ممكن ترجع array مباشرة أو object فيه
        // notifications array جواه (شكل الـ pagination) — بنغطي الحالتين
        const raw = data.data;
        const list: Notification[] = Array.isArray(raw)
          ? raw
          : raw?.notifications ?? [];
        setNotifications(list);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Notifications error:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // 📌 mark as read
  const markAsRead = async (id: string) => {
    if (!accessToken) return;

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );

    try {
      // ⚠️ الباك اند بيستخدم PUT مش PATCH
      await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 📌 filter logic
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  // 📥 load on mount / when auth state resolves
  useEffect(() => {
    if (authLoading) return;
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, userId, authLoading]);

  if (loading) {
    return (
      <div dir="rtl" className="text-sm text-gray-500 animate-pulse p-4">
        جارٍ تحميل الإشعارات...
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-white rounded-xl border p-5 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-sm">الإشعارات</h2>

        {/* Filters */}
        <div className="flex gap-2 text-xs">
          {[
            { k: "all", l: "الكل" },
            { k: "unread", l: "غير مقروءة" },
            { k: "read", l: "مقروءة" },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k as Filter)}
              className={`px-2 py-1 rounded-md border ${
                filter === f.k ? "bg-primary text-white" : "text-gray-500"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <p className="text-sm text-gray-400">لا توجد إشعارات</p>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markAsRead(n._id)}
              className={`p-3 border rounded-lg cursor-pointer ${
                !n.read ? "bg-orange-50" : "bg-white"
              }`}
            >
              <h3 className="text-sm font-bold">{n.title}</h3>
              <p className="text-xs text-gray-500">{n.message}</p>
              <span className="text-[10px] text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}