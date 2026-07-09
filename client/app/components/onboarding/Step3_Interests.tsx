"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

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
  const { accessToken } = useAuth();

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

      reset();
      router.push("/childAdventure");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 text-right font-sans"
      dir="rtl"
    >
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-black text-slate-900">اختر اهتمامات طفلك ✨</h3>
        <p className="text-sm font-medium text-slate-500">اختر اهتماماً واحداً أو أكثر لتخصيص التجربة.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {INTERESTS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleInterest(item.id)}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
              child.interests.includes(item.id)
                ? "border-primary bg-primary/5"
                : "border-slate-100 bg-white hover:border-primary/50"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className={`text-sm font-bold ${child.interests.includes(item.id) ? "text-primary" : "text-slate-600"}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrev}
          className="rounded-full py-6 font-bold"
        >
          رجوع
        </Button>
        <Button 
          onClick={handleFinish} 
          className="flex-1 rounded-full py-6 font-black shadow-lg shadow-primary/20"
        >
          إنهاء وإنشاء الحساب 🚀
        </Button>
      </div>
    </motion.div>
  );
}