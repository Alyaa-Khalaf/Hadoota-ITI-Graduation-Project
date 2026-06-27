"use client";

import Button from "../ui/Button";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRouter } from "next/navigation";
// 1. استيراد الـ useAuth عشان نسحب التوكن
import { useAuth } from "@/context/AuthContext";
// 2. استيراد useSelectedChild عشان نحدّث الطفل النشط فورًا بعد إنشائه
import { useSelectedChild } from "@/context/childContext";

const INTERESTS = [
  { id: "adventures", label: "مغامرات", icon: "🚀" },
  { id: "animals", label: "حيوانات", icon: "🦁" },
  { id: "science", label: "علوم", icon: "🌍" },
  { id: "morals", label: "قيم", icon: "🤝" },
  { id: "history", label: "تاريخ", icon: "🏰" },
  { id: "mysteries", label: "ألغاز", icon: "🔍" },
];

interface Props {
  onPrev: () => void;
}

export default function Step3_Interests({ onPrev }: Props) {
  const router = useRouter();

  // سحب الـ accessToken من الـ Context
  const { accessToken } = useAuth();

  // سحب setSelectedChild عشان نحدّث الطفل النشط فورًا بعد الإنشاء
  const { setSelectedChild } = useSelectedChild();

  const child = useOnboardingStore((s) => s.child);
  const setChild = useOnboardingStore((s) => s.setChild);
  const reset = useOnboardingStore((s) => s.reset);

  const toggleInterest = (id: string) => {
    const exists = child.interests.includes(id);

    const updated = exists
      ? child.interests.filter((i) => i !== id)
      : [...child.interests, id];

    setChild({ interests: updated });
  };

  const handleFinish = async () => {
    try {
      console.log("TOKEN FROM CONTEXT:", accessToken);
      console.log("API:", process.env.NEXT_PUBLIC_API_URL);

      // التحقق من وجود التوكن القادم من الـ Context
      if (!accessToken) {
        alert("يجب تسجيل الدخول أولاً أو انتهاء تحميل الجلسة");
        return;
      }

      if (!child.name) {
        alert("أدخل اسم الطفل");
        return;
      }

      if (!child.age) {
        alert("أدخل عمر الطفل");
        return;
      }

      if (child.interests.length === 0) {
        alert("اختر اهتماماً واحداً على الأقل");
        return;
      }

      const payload = {
        name: child.name,
        age: Number(child.age),
        gender: child.gender,
        avatar: child.avatar || "lion",
        interests: child.interests,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/children`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // نمرر التوكن الآمن هنا
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      console.log("CREATE CHILD RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إنشاء ملف الطفل");
      }

      // 🆕 نحدّث الطفل النشط فورًا في الـ state المحلي ببيانات الطفل اللي
      // رجعت من السيرفر، بدل ما نستنى لحد ما /childAdventure تسأل السيرفر
      // من جديد (وده ما كان بيحصل إلا بعد refresh كامل للصفحة).
      // ده كمان بيبعت POST /api/children/active تلقائيًا (موجود جوه
      // setSelectedChild نفسها) ليثبت الاختيار في الداتابيز.
      if (data?.data) {
        setSelectedChild(data.data);
      }

      reset();

      router.push("/childAdventure");
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
    }
  };

  return (
    <div className="space-y-6 text-right">
      <div>
        <h3 className="text-xl font-black mb-2">اختر اهتمامات طفلك ✨</h3>

        <p className="text-sm text-gray-500">اختر اهتماماً واحداً أو أكثر.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {INTERESTS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleInterest(item.id)}
            className={`p-3 rounded-xl border transition ${
              child.interests.includes(item.id)
                ? "border-primary bg-primary/10"
                : "border-gray-200"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleFinish} fullWidth variant="primary">
          إنهاء وإنشاء الحساب 🚀
        </Button>

        <Button type="button" variant="sky" onClick={onPrev}>
          رجوع
        </Button>
      </div>
    </div>
  );
}