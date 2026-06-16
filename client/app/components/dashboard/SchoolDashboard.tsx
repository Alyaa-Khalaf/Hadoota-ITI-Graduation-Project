"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Analytics {
  totalStudents: number;
  activeStudents: number;
  storiesRead: number;
  readingMinutes: number;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  useEffect(() => {
    const schoolId =
      localStorage.getItem("schoolId");

    if (!schoolId) return;

    fetch(
      `/api/schools/${schoolId}/analytics`
    )
      .then((res) => res.json())
      .then((data) =>
        setAnalytics(data)
      );
  }, []);

  return (
    <div className="min-h-screen bg-story-bg p-8">
      <div className="mb-8">
        <Badge variant="sky">
          Dashboard
        </Badge>

        <h1 className="text-4xl font-black text-ink mt-4">
          School Analytics
        </h1>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <h3>Total Students</h3>

          <p className="text-4xl font-black text-primary mt-4">
            {analytics?.totalStudents ??
              0}
          </p>
        </Card>

        <Card>
          <h3>Active Students</h3>

          <p className="text-4xl font-black text-sky mt-4">
            {analytics?.activeStudents ??
              0}
          </p>
        </Card>

        <Card>
          <h3>Stories Read</h3>

          <p className="text-4xl font-black text-meadow mt-4">
            {analytics?.storiesRead ??
              0}
          </p>
        </Card>

        <Card>
          <h3>Reading Minutes</h3>

          <p className="text-4xl font-black text-magic mt-4">
            {analytics?.readingMinutes ??
              0}
          </p>
        </Card>
      </div>
    </div>
  );
}