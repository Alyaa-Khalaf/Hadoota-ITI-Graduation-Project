"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type ChannelSettings = {
  email: boolean;
  webPush: boolean;
};

type NotificationSettings = {
  weeklyReport: ChannelSettings;
  screenTime: ChannelSettings;
  achievement: ChannelSettings;
  dailyReminder: ChannelSettings;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SettingsPanel() {
  const { accessToken, isLoading: authLoading } = useAuth();

  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // 📥 fetch settings
  const fetchSettings = async () => {
    if (!accessToken) {
      setLoading(false);
      setSettings(null);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/notifications/settings`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        setSettings(data.data);
      } else {
        setSettings(null);
      }
    } catch (err) {
      console.error("Settings error:", err);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  // 💾 update setting
  const updateSetting = async (
    type: keyof NotificationSettings,
    channel: keyof ChannelSettings
  ) => {
    if (!settings || !accessToken) return;

    const updated = {
      ...settings,
      [type]: {
        ...settings[type],
        [channel]: !settings[type][channel],
      },
    };

    // optimistic update
    setSettings(updated);

    try {
      await fetch(`${API_BASE}/api/notifications/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Update settings error:", err);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchSettings();
  }, [accessToken, authLoading]);

  if (loading) {
    return (
      <div dir="rtl" className="text-sm text-gray-500 animate-pulse p-4">
        جارٍ تحميل الإعدادات...
      </div>
    );
  }

  if (!settings) {
    return (
      <div dir="rtl" className="text-sm text-gray-400 p-4">
        لا يوجد إعدادات
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-white rounded-xl border p-5 space-y-6">
      <h2 className="font-bold text-sm">إعدادات الإشعارات</h2>

      {/* SECTION */}
      {Object.entries(settings).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <h3 className="text-xs font-bold text-gray-700">
            {
              (
                {
                  weeklyReport: "تقرير أسبوعي",
                  screenTime: "مدة الشاشة",
                  achievement: "الإنجازات",
                  dailyReminder: "تذكير يومي",
                } as Record<string, string>
              )[key] || key
            }
          </h3>

          <div className="flex gap-4 bg-gray-50 p-3 rounded-lg">
            {/* Email */}
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={value.email}
                onChange={() =>
                  updateSetting(key as keyof NotificationSettings, "email")
                }
              />
              البريد الإلكتروني
            </label>

            {/* Web Push */}
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={value.webPush}
                onChange={() =>
                  updateSetting(key as keyof NotificationSettings, "webPush")
                }
              />
              إشعارات المتصفح
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}