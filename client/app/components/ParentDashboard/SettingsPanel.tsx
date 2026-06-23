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

const API_BASE = "http://localhost:5000";

export default function SettingsPanel() {
  const { accessToken } = useAuth();

  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // 📥 fetch settings
  const fetchSettings = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/notifications/settings`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (data?.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error("Settings error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 💾 update setting
  const updateSetting = async (
    type: keyof NotificationSettings,
    channel: keyof ChannelSettings
  ) => {
    if (!settings) return;

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
    if (accessToken) {
      fetchSettings();
    }
  }, [accessToken]);

  if (loading) {
    return (
      <div className="text-sm text-gray-500 animate-pulse p-4">
        Loading settings...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-sm text-gray-400 p-4">
        No settings found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-5 space-y-6">

      <h2 className="font-bold text-sm">Notification Settings</h2>

      {/* SECTION */}
      {Object.entries(settings).map(([key, value]) => (
        <div key={key} className="space-y-2">

          <h3 className="text-xs font-bold text-gray-700">
            {key}
          </h3>

          <div className="flex gap-4 bg-gray-50 p-3 rounded-lg">

            {/* Email */}
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={value.email}
                onChange={() =>
                  updateSetting(
                    key as keyof NotificationSettings,
                    "email"
                  )
                }
              />
              Email
            </label>

            {/* Web Push */}
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={value.webPush}
                onChange={() =>
                  updateSetting(
                    key as keyof NotificationSettings,
                    "webPush"
                  )
                }
              />
              Web Push
            </label>

          </div>
        </div>
      ))}
    </div>
  );
}