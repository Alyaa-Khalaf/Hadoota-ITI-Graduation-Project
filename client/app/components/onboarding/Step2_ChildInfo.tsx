"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/store/onboardingStore";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User } from "lucide-react";

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step2_ChildInfo({ onNext, onPrev }: Step2Props) {
  const child = useOnboardingStore((s) => s.child);
  const setChild = useOnboardingStore((s) => s.setChild);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!child.name || !child.age || !child.gender) return;
    onNext();
  };

  return (
    <motion.form 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 text-right font-sans" 
      onSubmit={handleSubmit}
      dir="rtl"
    >
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-black text-slate-900">أخبرنا عن طفلك 👦👧</h3>
        <p className="text-sm text-slate-500 font-medium">هذه المعلومات تساعدنا في تخصيص القصص المناسبة له.</p>
      </div>

      {/* حقل الاسم */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 pr-1">اسم الطفل</label>
        <Input
          type="text"
          placeholder="مثال: أحمد"
          value={child.name}
          onChange={(e) => setChild({ name: e.target.value })}
          className="h-12 rounded-2xl border-slate-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* حقول العمر والنوع بستايل متناسق */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 pr-1">العمر</label>
          <select
            value={child.age}
            onChange={(e) => setChild({ age: e.target.value })}
            className="w-full h-12 px-3 rounded-2xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">اختر العمر</option>
            {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <option key={n} value={n}>{n} سنوات</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 pr-1">النوع</label>
          <select
            value={child.gender || ""}
            onChange={(e) => setChild({ gender: e.target.value })}
            className="w-full h-12 px-3 rounded-2xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="" disabled>حدد النوع</option>
            <option value="male">ذكر 👦</option>
            <option value="female">أنثى 👧</option>
          </select>
        </div>
      </div>

      {/* الأزرار */}
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
          type="submit" 
          className="flex-1 rounded-full py-6 font-black shadow-lg shadow-primary/20"
        >
          التالي <ArrowLeft className="mr-2 h-5 w-5" />
        </Button>
      </div>
    </motion.form>
  );
}