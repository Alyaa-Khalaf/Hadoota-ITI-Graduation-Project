"use client";
import { useState } from "react";
import Button from "../ui/Button";

interface Step4Props {
  onNext: () => void;
  onPrev: () => void;
}

// خيارات وقت الشاشة اليومي
const TIME_OPTIONS = [
  { id: "15", label: "15 دقيقة", description: "مناسب جداً للأطفال الصغار", icon: "🌱" },
  { id: "30", label: "30 دقيقة", description: "الوقت الموصى به يومياً", icon: "✨" },
  { id: "45", label: "45 دقيقة", description: "لرحلات قراءة ومغامرات أطول", icon: "🚀" },
  { id: "unlimited", label: "غير محدود", description: "تحكم يدوي من الوالدين", icon: "♾️" },
];

export default function Step4_ScreenTime({ onNext, onPrev }: Step4Props) {
  // القيمة الافتراضية 30 دقيقة وهي الموصى بها
  const [selectedTime, setSelectedTime] = useState("30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // حفظ وقت الشاشة مؤقتاً
    localStorage.setItem("tempScreenTime", selectedTime);
    
    onNext(); // الانتقال للخطوة الخامسة والأخيرة (جرب أول حدوتة)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right font-sans animate-fadeIn">
      {/* العنوان الرئيسي */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-black text-ink">تحديد وقت الشاشة اليومي ⏳</h3>
        <p className="text-xs font-bold text-ink-muted">
          لحماية عين طفلك، سيقوم التطبيق بالتوقف تلقائياً بعد انتهاء المدة المحددة.
        </p>
      </div>

      {/* قائمة الخيارات العودية */}
      <div className="space-y-3">
        {TIME_OPTIONS.map((option) => {
          const isSelected = selectedTime === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedTime(option.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5 scale-[1.01] shadow-xs"
                  : "border-border-warm bg-white hover:border-border-warm/80"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* الأيقونة */}
                <span className="text-2xl bg-warm/30 p-2 rounded-xl">{option.icon}</span>
                {/* النصوص */}
                <div>
                  <h4 className="text-sm font-black text-ink">{option.label}</h4>
                  <p className="text-xs font-bold text-ink-muted">{option.description}</p>
                </div>
              </div>

              {/* دائرة الاختيار (Radio effect) */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isSelected ? "border-primary bg-primary" : "border-border-warm"
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* أزرار التحكم */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          fullWidth={true}
          className="!py-3.5 font-black order-2"
        >
          التالي: حكايتك الأولى 🎁
        </Button>
        <Button
          type="button"
          variant="sky"
          fullWidth={false}
          onClick={onPrev}
          className="!py-3.5 px-6 font-bold text-ink order-1"
        >
          رجوع
        </Button>
      </div>
    </form>
  );
}