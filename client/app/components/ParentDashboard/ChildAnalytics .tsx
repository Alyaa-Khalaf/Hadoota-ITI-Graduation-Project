"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/context/AuthContext";

type WeeklyActivity = {
  name: string;
  stories: number;
};

type TopicDistribution = {
  name: string;
  value: number;
  color?: string;
};

type Props = {
  childId: string;
};

const API_BASE = "http://localhost:5000";

export default function ChildAnalytics({ childId }: Props) {
  const { accessToken } = useAuth();

  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [topics, setTopics] = useState<TopicDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId || !accessToken) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 📊 Weekly Activity
        const weeklyRes = await fetch(
          `${API_BASE}/api/analytics/${childId}/stories?period=weekly&days=7`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const weeklyData = await weeklyRes.json();
        setWeeklyActivity(weeklyData?.data || []);

        // 🧠 Topics
        const topicsRes = await fetch(
          `${API_BASE}/api/analytics/${childId}/topics`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const topicsData = await topicsRes.json();
        setTopics(topicsData?.data || []);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [childId, accessToken]);

  if (!childId) {
    return (
      <div className="p-4 text-sm text-gray-400">
        اختر طفل لعرض التحليلات
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500 animate-pulse">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* 📈 Weekly Chart */}
      <div className="h-80 bg-white rounded-xl p-4 border">
        <h3 className="text-sm font-bold mb-3">
          Weekly Reading Activity
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="stories"
              stroke="#FF7043"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 Topics Chart */}
      <div className="h-80 bg-white rounded-xl p-4 border">
        <h3 className="text-sm font-bold mb-3">
          Topics Distribution
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topics}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {topics.map((t, i) => (
                <Cell key={i} fill={t.color || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}