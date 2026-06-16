"use client";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { useOnboardingStore } from "@/store/onboardingStore";

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
    <form className="space-y-6 text-right font-sans" onSubmit={handleSubmit}>
      <div className="text-center">
        <h3 className="text-xl font-black">أخبرنا عن طفلك 👦👧</h3>
      </div>

      <Input
        type="text"
        placeholder="اسم الطفل"
        value={child.name}
        onChange={(e) => setChild({ name: e.target.value })}
        label=""
      />

      <select
        value={child.age}
        onChange={(e) => setChild({ age: e.target.value })}
        className="w-full p-3 rounded-xl border"
      >
        <option value="">اختر العمر</option>
        {[3,4,5,6,7,8,9,10,11,12].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <select
        value={child.gender || ""}
        onChange={(e) => setChild({ gender: e.target.value })}
        className="w-full p-3 rounded-xl border"
      >
        <option value="" disabled>اختر نوع الطفل</option>
        <option value="male">ذكر 👦</option>
        <option value="female">أنثى 👧</option>
      </select>

      <div className="flex gap-3 pt-4">
        <Button type="submit" fullWidth variant="primary">
          التالي
        </Button>

        <Button type="button" variant="sky" onClick={onPrev}>
          رجوع
        </Button>
      </div>
    </form>
  );
}