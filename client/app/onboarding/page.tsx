"use client";
import { useState } from "react";
import Step1_Welcome from "@/components/onboarding/Step1_Welcome";
import Step2_ChildInfo from "@/components/onboarding/Step2_ChildInfo";
import Step3_Interests from "@/components/onboarding/Step3_Interests";
import Step4_ScreenTime from "@/components/onboarding/Step4_ScreenTime";
import Step5_FreeStory from "@/components/onboarding/Step5_FreeStory";
import StepIndicator from "@/components/onboarding/StepIndicator";

export default function OnboardingPage() {
  // الـ state دي بتبدأ برقم 1 (يعني الخطوة الأولى)
  const [currentStep, setCurrentStep] = useState(1);

  // دالة بتزود رقم الخطوة عشان تروح للي بعدها
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  
  // دالة بتقلل رقم الخطوة عشان ترجع للي قبلها
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF6F0] font-sans" dir="rtl">
      
      {/* (اختياري) مؤشر الخطوات عشان الأهل يعرفوا هم فين */}
      <StepIndicator currentStep={currentStep} totalSteps={5} />

      {/* الكارد الأبيض اللي جواه الخطوات */}
      <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-sm border border-border-warm/40 mt-6">
        
        {/* الخطوة 1: بنباصي لها دالة الـ nextStep في الـ prop اللي اسمه onNext */}
        {currentStep === 1 && (
          <Step1_Welcome onNext={nextStep} />
        )}

        {/* الخطوة 2: بتاخد الـ onNext عشان تروح لخطوة 3، وonPrev عشان ترجع لخطوة 1 */}
        {currentStep === 2 && (
          <Step2_ChildInfo onNext={nextStep} onPrev={prevStep} />
        )}

        {/* الخطوة 3: المواضيع والاهتمامات */}
        {currentStep === 3 && (
          <Step3_Interests onNext={nextStep} onPrev={prevStep} />
        )}

        {/* خطوة 4 لعرض الوقت اللازم للاطفال علي حدوتة*/}
        {currentStep === 4 && 
          <Step4_ScreenTime onNext={nextStep} onPrev={prevStep} />
        }
        {/* لعرض قصه مجانا */}
        {currentStep === 5 && 
          <Step5_FreeStory onNext={nextStep} onPrev={prevStep} />
        }
      </div>
    </div>
  );
}