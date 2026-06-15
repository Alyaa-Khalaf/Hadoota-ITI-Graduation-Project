"use client";

import { useEffect, useState } from "react";

import Card from "@/components/Card";
import Badge from "@/components/Badge";

export default function StudentsPage() {
  const [students, setStudents] =
    useState<any[]>([]);

  const [count, setCount] =
    useState(0);

  useEffect(() => {
    const schoolId =
      localStorage.getItem("schoolId");

    if (!schoolId) return;

    fetch(
      `/api/schools/${schoolId}/students`
    )
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students);
        setCount(data.count);
      });
  }, []);

  return (
    <div className="p-8">
      <Badge>
        {count} Students
      </Badge>

      <div className="grid gap-4 mt-6">
        {students.map((student) => (
          <Card
            key={student._id}
          >
            <h3 className="font-black">
              {student.name}
            </h3>

            <p>
              {student.email}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}