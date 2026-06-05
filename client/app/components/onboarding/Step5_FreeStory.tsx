"use client";
import { useState, useEffect } from "react";
import Button from "../ui/Button";

interface Step5Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step5_FreeStory({ onNext, onPrev }: Step5Props) {
  const [childInfo, setChildInfo] = useState<any>(null);
  const [storyTheme, setStoryTheme] = useState("adventure");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // استرجاع بيانات الطفل من الخطوة السابقة
    const savedChildInfo = localStorage.getItem("tempChildInfo");
    if (savedChildInfo) {
      setChildInfo(JSON.parse(savedChildInfo));
    }
  }, []);

  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🚀 ربط الـ API لإنشاء أول قصة حرة للطفل
      const response = await fetch("/api/stories/generate-free-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: childInfo?.name,
          childAge: childInfo?.age,
          childAvatar: childInfo?.avatar,
          theme: storyTheme,
        }),
      });

      if (response.ok) {
        onNext();
      }
    } catch (err) {
      console.error("خطأ في إنشاء القصة", err);
    } finally {
      setIsLoading(false);
    }
  };

  const AVATARS: Record<string, string> = {
    lion: "🦁",
    fox: "🦊",
    panda: "🐼",
    rabbit: "🐰",
    unicorn: "🦄",
    dragon: "🐉",
  };

  return (
    <form onSubmit={handleGenerateStory} className="space-y-6 text-right" dir="rtl">
      <div className="text-center">
        <h3 className="text-xl font-black text-gray-800">🧙‍♂️✨ تخصيص الحكاية الأولى</h3>
        <p className="text-xs font-bold text-gray-400 mt-1">اختر نمط القصة الأولى المجانية لـ {childInfo?.name}</p>
      </div>

      {/* عرض ملخص بيانات الطفل */}
      {childInfo && (
        <div className="max-w-sm mx-auto bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{AVATARS[childInfo.avatar] || "👦"}</span>
            <div>
              <p className="font-black text-gray-800">{childInfo.name}</p>
              <p className="text-sm text-gray-600">{childInfo.age} سنوات</p>
            </div>
          </div>
        </div>
      )}

      {/* اختيار نمط القصة */}
      <div className="space-y-3 max-w-sm mx-auto">
        <label className="block text-sm font-black text-gray-700">اختر نمط القصة المفضل</label>
        {[
          { value: "adventure", label: "🗺️ مغامرة", emoji: "🗺️" },
          { value: "fantasy", label: "🌟 خيال سحري", emoji: "🌟" },
          { value: "mystery", label: "🔍 غموض", emoji: "🔍" },
          { value: "nature", label: "🌿 الطبيعة", emoji: "🌿" },
        ].map((theme) => (
          <label
            key={theme.value}
            className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
              storyTheme === theme.value
                ? "border-primary bg-primary/5"
                : "border-border-warm hover:border-border-warm/80"
            }`}
          >
            <input
              type="radio"
              name="storyTheme"
              value={theme.value}
              checked={storyTheme === theme.value}
              onChange={(e) => setStoryTheme(e.target.value)}
              className="w-4 h-4"
            />
            <span className="font-bold text-gray-700">{theme.label}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3 max-w-sm mx-auto pt-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1 !py-3 font-black"
          disabled={isLoading}
        >
          {isLoading ? "جاري تجهيز السحر... 🪄" : "ابدأ الحكاية المجانية 📚✨"}
        </Button>
        <Button
          type="button"
          variant="sky"
          className="!py-3 px-6 font-bold"
          onClick={onPrev}
          disabled={isLoading}
        >
          رجوع
        </Button>
      </div>
    </form>
  );
}