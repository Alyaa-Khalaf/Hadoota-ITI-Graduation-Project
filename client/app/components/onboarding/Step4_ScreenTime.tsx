"use client";
import { useState } from "react";
import Button from "../ui/Button";

interface Step4Props {
  onNext: () => void;
  onPrev: () => void;
  isSubmitting?: boolean;
}

const SCREEN_TIME_OPTIONS = [
  { value: "15", label: "١٥ دقيقة", desc: "للأطفال الصغار جداً" },
  { value: "30", label: "٣٠ دقيقة", desc: "الأنسب لمعظم الأعمار" },
  { value: "45", label: "٤٥ دقيقة", desc: "للأطفال الأكبر سناً" },
  { value: "60", label: "ساعة كاملة", desc: "للأيام الخاصة فقط" },
];

export default function Step4_ScreenTime({ onNext, onPrev, isSubmitting }: Step4Props) {
  const [selected, setSelected] = useState("30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("tempScreenTime", selected);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right font-sans animate-fadeIn">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-black text-ink">وقت الشاشة اليومي ⏳</h3>
        <p className="text-xs font-bold text-ink-muted">
          حدد الوقت المناسب لطفلك يومياً على التطبيق.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SCREEN_TIME_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelected(option.value)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
              selected === option.value
                ? "border-primary bg-primary/5 scale-[1.02] shadow-sm"
                : "border-border-warm bg-white hover:border-primary/30"
            }`}
          >
            <span className="text-lg font-black text-ink">{option.label}</span>
            <span className="text-xs font-bold text-ink-muted mt-1">{option.desc}</span>
            {selected === option.value && (
              <span className="text-primary text-sm font-bold mt-1">✓</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          fullWidth={true}
          disabled={isSubmitting}
          className="!py-3.5 font-black order-2"
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ وإنهاء الإعداد ✅"}
        </Button>
        <Button
          type="button"
          variant="sky"
          fullWidth={false}
          onClick={onPrev}
          disabled={isSubmitting}
          className="!py-3.5 px-6 font-bold text-ink order-1"
        >
          رجوع
        </Button>
      </div>
    </form>
  );
}
