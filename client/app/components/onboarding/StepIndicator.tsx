"use client";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  const stepsArray = Array.from(
    { length: totalSteps },
    (_, i) => i + 1
  );

  return (
    <div className="w-full max-w-xs mx-auto mb-3 font-sans" dir="rtl">
      {/* النص العلوي */}
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-xs font-black text-primary">
          إعداد الحساب
        </span>

        <span className="text-xs font-bold text-ink-muted">
          الخطوة{" "}
          <span className="text-primary font-black">
            {currentStep}
          </span>{" "}
          من {totalSteps}
        </span>
      </div>

      {/* progress */}
      <div className="relative flex items-center justify-between w-full">
        {/* الخلفية */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-border-warm/50 rounded-full z-0" />

        {/* الجزء المكتمل */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary rounded-full transition-all duration-500 ease-in-out z-0"
          style={{
            width:
              totalSteps > 1
                ? `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
                : "0%",
          }}
        />

        {/* الدوائر */}
        {stepsArray.map((step) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div
              key={step}
              className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full font-black text-[10px] transition-all duration-300 ${
                isCompleted
                  ? "bg-primary text-white"
                  : isActive
                  ? "bg-white text-primary border-2 border-primary scale-110"
                  : "bg-white text-ink-muted border-2 border-border-warm"
              }`}
            >
              {isCompleted ? "✓" : step}
            </div>
          );
        })}
      </div>
    </div>
  );
}