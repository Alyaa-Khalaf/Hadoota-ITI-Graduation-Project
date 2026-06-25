"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  onAdded: (id: string) => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AVATAR_OPTIONS = ["👶", "🧒", "👧", "👦", "🐻", "🦊", "🐱", "🐰"];

type Gender = "male" | "female"; // 1 = male, 2 = female

export default function AddingChildForm({ onAdded }: Props) {
  const { accessToken } = useAuth();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("من فضلك اكتب اسم الطفل");
      return;
    }

    const ageNumber = Number(age);
    if (!age || Number.isNaN(ageNumber) || ageNumber <= 0) {
      setError("من فضلك اكتب عمر صحيح");
      return;
    }

    if (!accessToken) {
      setError("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/api/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          age: ageNumber,
          gender,
          avatar,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result?.success) {
        setError(result?.message || "حدث خطأ أثناء إضافة الطفل");
        return;
      }

      const newId = result?.data?._id;

      if (newId) {
        onAdded(newId);
      }
    } catch (err) {
      console.error("Failed to add child:", err);
      setError("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form dir="rtl" onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </div>
      )}

      {/* الاسم */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-700">اسم الطفل</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: يوسف"
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* العمر */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-700">العمر</label>
        <input
          type="number"
          min={1}
          max={18}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="مثال: 6"
          className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* الجنس */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-700">الجنس</label>

        <div className="flex gap-3">
          <label className="flex items-center gap-1 text-sm">
             <input
                            type="radio"
                            checked={gender === "male"}
                            onChange={() => setGender("male")}
                        />
            ولد
          </label>

          <label className="flex items-center gap-1 text-sm">
             <input
                            type="radio"
                            checked={gender === "female"}
                            onChange={() => setGender("female")}
                        />
            بنت
          </label>
        </div>
      </div>

      {/* الأفاتار */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-700">اختر صورة</label>

        <div className="flex gap-2 flex-wrap">
          {AVATAR_OPTIONS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`w-10 h-10 flex items-center justify-center text-lg rounded-full border-2 ${
                avatar === a
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* زر الإضافة */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 text-sm font-bold bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-60"
      >
        {submitting ? "جارٍ الإضافة..." : "إضافة الطفل"}
      </button>
    </form>
  );
}