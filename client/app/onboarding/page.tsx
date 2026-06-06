"use client";
import { useState } from "react";
import Step2_ChildInfo from "@/components/onboarding/Step2_ChildInfo";
import Step3_Interests from "@/components/onboarding/Step3_Interests";
import Step4_ScreenTime from "@/components/onboarding/Step4_ScreenTime";
import StepIndicator from "@/components/onboarding/StepIndicator";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const childInfo = JSON.parse(localStorage.getItem("tempChildInfo") || "{}");
      const interests = JSON.parse(localStorage.getItem("tempChildInterests") || "[]");
      const screenTime = localStorage.getItem("tempScreenTime") || "30";

      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

      if (token) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/children`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: childInfo.name,
            age: Number(childInfo.age),
            avatar: childInfo.avatar || "",
            interests,
            dailyScreenTime: Number(screenTime),
          }),
        });

        if (!res.ok) throw new Error("فشل الحفظ");
      }

      localStorage.removeItem("tempChildInfo");
      localStorage.removeItem("tempChildInterests");
      localStorage.removeItem("tempScreenTime");

      setCurrentStep(4);
    } catch {
      setError("حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF6F0] font-sans" dir="rtl">

      {/* Page Header */}
      <div className="w-full max-w-xl mb-4 text-center">
        <h1 className="text-2xl font-black text-ink">إعداد الملف الشخصي</h1>
        <p className="text-sm text-ink-muted mt-1">أضف بيانات طفلك لنبدأ رحلة التعلم</p>
      </div>

      <StepIndicator currentStep={currentStep} totalSteps={3} />

      <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-sm border border-border-warm/40 mt-6">

        {currentStep === 1 && (
          <Step2_ChildInfo onNext={nextStep} onPrev={() => window.location.href = "/dashboard"} />
        )}

        {currentStep === 2 && (
          <Step3_Interests onNext={nextStep} onPrev={prevStep} />
        )}

        {currentStep === 3 && (
          <Step4_ScreenTime
            onNext={handleFinish}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 4 && (
          <div className="text-center space-y-6 py-6">
            <div className="text-6xl">🎉</div>
            <h3 className="text-2xl font-black text-ink">تم إعداد الملف بنجاح!</h3>
            <p className="text-sm font-bold text-ink-muted">
              حساب طفلك جاهز الآن. يمكنك البدء في استكشاف القصص والمغامرات.
            </p>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="mt-4 w-full py-4 bg-primary text-white rounded-2xl font-black text-base shadow-lg shadow-primary/20 hover:opacity-90 transition"
            >
              الذهاب إلى لوحة التحكم 🚀
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-red-500 font-bold">{error}</p>
        )}
      </div>
    </div>
  );
}
