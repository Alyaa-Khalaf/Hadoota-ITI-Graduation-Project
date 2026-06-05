"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
}

// قائمة بأفاتارز كرتونية تجريبية (تقدري تغيري الإيموجيز لصور بعدين)
const AVATARS = [
  { id: "lion", emoji: "🦁", label: "أسد شجاع" },
  { id: "fox", emoji: "🦊", label: "ثعلب ذكي" },
  { id: "panda", emoji: "🐼", label: "باندا هادئ" },
  { id: "rabbit", emoji: "🐰", label: "أرنب سريع" },
  { id: "unicorn", emoji: "🦄", label: "وحيد قرن سحري" },
  { id: "dragon", emoji: "🐉", label: "تنين مغامر" },
];

export default function Step2_ChildInfo({ onNext, onPrev }: Step2Props) {
  const [childData, setChildData] = useState({
    name: "",
    age: "",
    avatar: "lion", // الأفاتار الافتراضي
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childData.name || !childData.age) return;

    // حفظ بيانات الطفل مؤقتاً في الـ LocalStorage لحد ما نربط الـ API بتاع الأطفال
    localStorage.setItem("tempChildInfo", JSON.stringify(childData));
    
    // الانتقال للخطوة الثالثة
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right font-sans animate-fadeIn">
      {/* العنوان الرئيسي */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-black text-ink">أخبرنا عن طفلك المبدع 👦👧</h3>
        <p className="text-xs font-bold text-ink-muted">
          لنقوم بتخصيص لغة الحواديت والرسومات لتناسب عالم طفلك الخاص.
        </p>
      </div>

      {/* حقل اسم الطفل */}
      <div>
        <label className="block text-sm font-black text-ink mb-1.5">اسم الطفل</label>
        <Input
          type="text"
          placeholder="مثال: أحمد، سارة..."
          required
          value={childData.name}
          onChange={(e) => setChildData({ ...childData, name: e.target.value })}
          label=""
        />
      </div>

      {/* حقل عمر الطفل */}
      <div>
        <label className="block text-sm font-black text-ink mb-1.5">عمر الطفل (سنوات)</label>
        <select
          required
          value={childData.age}
          onChange={(e) => setChildData({ ...childData, age: e.target.value })}
          className="w-full p-3.5 rounded-xl border border-border-warm bg-white text-ink font-bold text-sm focus:outline-none focus:border-primary transition"
        >
          <option value="" disabled hidden>اختر العمر</option>
          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <option key={num} value={num}>
              {num} سنوات
            </option>
          ))}
        </select>
      </div>

      {/* قسم اختيار الأفاتار */}
      <div className="space-y-2">
        <label className="block text-sm font-black text-ink">اختر الشخصية المفضلة لطفلك</label>
        <div className="grid grid-cols-3 gap-3">
          {AVATARS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setChildData({ ...childData, avatar: item.id })}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition ${
                childData.avatar === item.id
                  ? "border-primary bg-primary/5 scale-105"
                  : "border-border-warm bg-white hover:border-border-warm/80"
              }`}
            >
              <span className="text-3xl mb-1">{item.emoji}</span>
              <span className="text-xs font-black text-ink">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* أزرار التحكم (التالي والسابق) */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          fullWidth={true}
          className="!py-3.5 font-black order-2"
        >
          التالي: اهتمامات الطفل ✨
        </Button>
        <Button
          type="button"
          variant="sky" // أو أي ستايل هادي عندك للرجوع
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