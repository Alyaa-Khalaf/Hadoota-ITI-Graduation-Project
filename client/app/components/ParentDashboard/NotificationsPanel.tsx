"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Notification = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

type Filter = "all" | "unread" | "read";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NotificationsPanel() {
  const { accessToken, isLoading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  // 📥 fetch notifications
  const fetchNotifications = async () => {
    if (!accessToken) {
      setLoading(false);
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        setNotifications(data.data || []);
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
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    try {
      await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 🗑 delete notification
  const deleteNotification = async (id: string) => {
    if (!accessToken) return;

    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await fetch(`${API_BASE}/api/notifications/${id}`, {
        method: "DELETE",
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
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  // 📥 load on mount / when auth state resolves
  useEffect(() => {
    if (authLoading) return;
    fetchNotifications();
  }, [accessToken, authLoading]);

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
                filter === f.k ? "bg-orange-500 text-white" : "text-gray-500"
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
              key={n.id}
              className={`p-3 border rounded-lg flex justify-between items-start ${
                !n.isRead ? "bg-orange-50" : "bg-white"
              }`}
            >
              {/* Content */}
              <div onClick={() => markAsRead(n.id)} className="cursor-pointer">
                <h3 className="text-sm font-bold">{n.title}</h3>
                <p className="text-xs text-gray-500">{n.body}</p>
                <span className="text-[10px] text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Actions */}
              <button
                onClick={() => deleteNotification(n.id)}
                className="text-red-500 text-xs"
              >
                حذف
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}