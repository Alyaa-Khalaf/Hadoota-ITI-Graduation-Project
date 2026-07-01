"use client";

import { useState } from "react";
import Step1_Welcome from "@/components/onboarding/Step1_Welcome";
import Step2_ChildInfo from "@/components/onboarding/Step2_ChildInfo";
import Step3_Interests from "@/components/onboarding/Step3_Interests";
import StepIndicator from "@/components/onboarding/StepIndicator";
import HomeButton from "@/components/ui/HomeButton";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF6F0]"
      dir="rtl"
    >
      <HomeButton href="/" />
      <StepIndicator
  currentStep={currentStep}
  totalSteps={3}
/>
      <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-sm border border-border-warm/40">
        {currentStep === 1 && (
          <Step1_Welcome onNext={nextStep} />
        )}

        {currentStep === 2 && (
          <Step2_ChildInfo
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {currentStep === 3 && (
          <Step3_Interests
            onPrev={prevStep}
          />
        )}
      </div>
    </div>
  );
}