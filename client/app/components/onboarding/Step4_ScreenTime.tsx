"use client";
import { useState } from "react";
import Button from "../ui/Button";

interface Step4Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step4_ScreenTime({ onNext, onPrev }: Step4Props) {
  const [time, setTime] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(false);
    try {
      // 🚀 ربط الـ API لحفظ ساعات وقت الشاشة
      await fetch("ضع_رابط_api_حفظ_وقت_الشاشة_هنا", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screenTimeHours: time }),
      });
      
      onNext(); // انقل للخطوة الأخيرة بعد الحفظ
    } catch (err) {
      console.error("خطأ أثناء حفظ الوقت", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-center text-right" dir="rtl">
      <div>
        <h3 className="text-xl font-black text-gray-800">تحديد وقت الشاشة ⏳</h3>
        <p className="text-xs font-bold text-gray-400 mt-1">اضبط الوقت اليومي المسموح به لطفلك داخل التطبيق.</p>
      </div>

      {/* العداد الذكي */}
      <div className="flex items-center justify-center gap-6 bg-gray-50 p-6 rounded-3xl max-w-xs mx-auto">
        <button type="button" className="text-2xl bg-white w-10 h-10 rounded-full shadow-sm font-black" onClick={() => setTime(time + 1)}>+</button>
        <span className="text-2xl font-black text-gray-800">{time} ساعة</span>
        <button type="button" className="text-2xl bg-white w-10 h-10 rounded-full shadow-sm font-black" onClick={() => time > 1 && setTime(time - 1)}>-</button>
      </div>

      <div className="flex gap-3 max-w-sm mx-auto pt-4">
        <Button type="button" variant="primary" className="flex-1 !py-3 font-black" disabled={isLoading} onClick={handleSave}>
          {isLoading ? "جاري الحفظ..." : "حفظ ومتابعة ✨"}
        </Button>
        <Button type="button" variant="sky" className="!py-3 px-6 font-bold" onClick={onPrev} disabled={isLoading}>رجوع</Button>
      </div>
    </div>
  );
}