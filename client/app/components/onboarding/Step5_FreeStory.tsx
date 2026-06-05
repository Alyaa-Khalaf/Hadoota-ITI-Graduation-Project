"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface Step5Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step5_FreeStory({ onNext, onPrev }: Step5Props) {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childAvatar, setChildAvatar] = useState("👦");
  const [interest, setInterest] = useState("Space");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🚀 ربط الـ API لإنشاء بروفايل الطفل الأول وبدء أول قصة حرة له
      await fetch("ضع_رابط_api_إنشاء_حساب_الطفل_الأول_هنا", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: childName,
          age: Number(childAge),
          avatar: childAvatar,
          interests: [interest]
        }),
      });

      onNext(); // لو نجح، انقل لشاشة النهاية بنجاح والدخول للداشبورد
    } catch (err) {
      console.error("خطأ في إنشاء ملف الطفل", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateProfile} className="space-y-6 text-right" dir="rtl">
      <div className="text-center">
        <h3 className="text-xl font-black text-gray-800">تخصيص الحكاية الأولى 🧙‍♂️✨</h3>
        <p className="text-xs font-bold text-gray-400 mt-1">أدخل بيانات طفلك لنصنع له أول قصة سحرية خاصة به مجاناً!</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        <Input type="text" placeholder="اسم البطل الصغير" required value={childName} onChange={(e) => setChildName(e.target.value)} label="اسم الطفل" />
        <Input type="number" placeholder="العمر" required value={childAge} onChange={(e) => setChildAge(e.target.value)} label="العمر" />
        
        <div>
          <label className="block text-xs font-black text-gray-700 mb-1.5">اختر الأفاتار المفضّل</label>
          <div className="flex gap-4 justify-center text-3xl bg-gray-50 p-3 rounded-2xl">
            {["👦", "👧", "👶", "🧚‍♂️"].map((emoji) => (
              <span key={emoji} className={`cursor-pointer transition ${childAvatar === emoji ? "scale-125 border-b-2 border-primary" : ""}`} onClick={() => setChildAvatar(emoji)}>{emoji}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 max-w-sm mx-auto pt-4">
        <Button type="submit" variant="primary" className="flex-1 !py-3 font-black" disabled={isLoading}>
          {isLoading ? "جاري تجهيز السحر... 🪄" : "ابدأ حكايتك الأولى 📚✨"}
        </Button>
        <Button type="button" variant="sky" className="!py-3 px-6 font-bold" onClick={onPrev} disabled={isLoading}>رجوع</Button>
      </div>
    </form>
  );
}