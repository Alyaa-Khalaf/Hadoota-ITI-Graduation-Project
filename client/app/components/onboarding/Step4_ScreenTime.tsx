"use client";
import { useState } from "react";
import Button from "../ui/Button";

interface Step4Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step4_ScreenTime({ onNext, onPrev }: Step4Props) {
  const [dailyLimit, setDailyLimit] = useState("30");
  const [bestTime, setBestTime] = useState("evening");
  const [sessionDuration, setSessionDuration] = useState("15");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store screen time preferences
    if (typeof window !== 'undefined') {
      localStorage.setItem('screenTimePrefs', JSON.stringify({
        dailyLimit: Number(dailyLimit),
        bestTime,
        sessionDuration: Number(sessionDuration)
      }));
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      <div className="text-center">
        <h3 className="text-xl font-black text-gray-800">⏱️ وقت الشاشة</h3>
        <p className="text-xs font-bold text-gray-400 mt-1">حدد الوقت المناسب لطفلك على التطبيق</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {/* الحد اليومي */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2">الحد اليومي المقترح (دقائق)</label>
          <input
            type="range"
            min="10"
            max="120"
            step="10"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            className="w-full"
          />
          <p className="text-center text-lg font-bold text-primary mt-2">{dailyLimit} دقيقة</p>
        </div>

        {/* أفضل وقت */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2">أفضل وقت للاستخدام</label>
          <div className="space-y-2">
            {[
              { value: 'morning', label: '🌅 الصباح' },
              { value: 'afternoon', label: '☀️ بعد الظهر' },
              { value: 'evening', label: '🌙 المساء' }
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 p-3 border border-border-warm rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="bestTime"
                  value={option.value}
                  checked={bestTime === option.value}
                  onChange={(e) => setBestTime(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="font-bold text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* مدة الجلسة الواحدة */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-2">مدة الجلسة الواحدة المقترحة (دقائق)</label>
          <select
            value={sessionDuration}
            onChange={(e) => setSessionDuration(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-border-warm bg-white text-ink font-bold text-sm focus:outline-none focus:border-primary transition"
          >
            <option value="10">10 دقائق</option>
            <option value="15">15 دقيقة</option>
            <option value="20">20 دقيقة</option>
            <option value="30">30 دقيقة</option>
            <option value="45">45 دقيقة</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 max-w-sm mx-auto pt-4">
        <Button type="submit" variant="primary" className="flex-1 !py-3 font-black">
          التالي
        </Button>
        <Button type="button" variant="sky" className="!py-3 px-6 font-bold" onClick={onPrev}>
          رجوع
        </Button>
      </div>
    </form>
  );
}