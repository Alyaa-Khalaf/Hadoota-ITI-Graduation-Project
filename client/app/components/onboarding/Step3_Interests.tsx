"use client";
import { useState } from "react";
import Button from "../ui/Button";

interface Step3Props {
  onNext: () => void;
  onPrev: () => void;
}

// قائمة الاهتمامات والمواضيع مع الأيقونات والألوان المناسبة للأطفال
const INTERESTS = [
  { id: "adventures", label: "مغامرات وخيال", icon: "🚀", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "animals", label: "قصص حيوانات", icon: "🦁", color: "bg-green-50 text-green-700 border-green-200" },
  { id: "science", label: "علوم وفضاء", icon: "🌍", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "morals", label: "قيم وأخلاق", icon: "🤝", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "history", label: "قصص تاريخية", icon: "🏰", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { id: "mysteries", label: "أشياء غامضة وألغاز", icon: "🔍", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

export default function Step3_Interests({ onNext, onPrev }: Step3Props) {
  // الـ State دي بنحفظ فيها الـ ids بتاعة الاهتمامات اللي تم اختيارها
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // دالة لتحديد أو إلغاء تحديد اهتمام عند الضغط عليه
  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInterests.length === 0) return; // يفضل يختار حاجة واحدة ع الأقل

    // حفظ الاهتمامات مؤقتاً
    localStorage.setItem("tempChildInterests", JSON.stringify(selectedInterests));
    
    onNext(); // الانتقال للخطوة الرابعة (وقت الشاشة)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right font-sans animate-fadeIn">
      {/* العنوان الرئيسي */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-black text-ink">ماذا يحب أن يسمع أو يقرأ؟ 📑✨</h3>
        <p className="text-xs font-bold text-ink-muted">
          اختر موضوعاً واحداً أو أكثر لصنع عالم مليء بالشغف لطفلك.
        </p>
      </div>

      {/* شبكة عرض الاهتمامات (Grid) */}
      <div className="grid grid-cols-2 gap-3.5">
        {INTERESTS.map((item) => {
          const isSelected = selectedInterests.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleInterest(item.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5 scale-[1.02] shadow-sm"
                  : `${item.color} hover:opacity-90`
              }`}
            >
              {/* أيقونة مميزة */}
              <span className="text-2xl bg-white p-2 rounded-xl shadow-xs">{item.icon}</span>
              {/* اسم الاهتمام وعلامة الاختيار */}
              <div className="flex-1 flex justify-between items-center">
                <span className="text-sm font-black text-ink">{item.label}</span>
                {isSelected && <span className="text-primary text-lg font-bold">✓</span>}
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
          disabled={selectedInterests.length === 0} // الزرار هيقفل لو مأختارش حاجة خالص
          className="!py-3.5 font-black order-2"
        >
          {selectedInterests.length === 0 ? "اختر موضوعاً للمتابعة" : "التالي: وقت الشاشة ⏳"}
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