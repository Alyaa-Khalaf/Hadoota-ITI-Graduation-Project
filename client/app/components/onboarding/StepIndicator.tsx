"use client";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  // مصفوفة بعدد الخطوات لتوليد النقاط تلقائياً [1, 2, 3, 4, 5]
  const stepsArray = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-md mx-auto mb-2 font-sans" dir="rtl">
      {/* نصوص توضيحية خفيفة */}
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-xs font-black text-primary">إعداد الحساب</span>
        <span className="text-xs font-bold text-ink-muted">
          الخطوة <span className="text-primary font-black">{currentStep}</span> من {totalSteps}
        </span>
      </div>

      {/* شريط التقدم والنقاط */}
      <div className="relative flex items-center justify-between w-full">
        {/* الخط الخلفي الثابت المستمر */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-border-warm/50 rounded-full z-0" />

        {/* الخط الملون المتحرك اللي بيعبر عن التقدم */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500 ease-in-out z-0"
          style={{ 
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
          }}
        />

        {/* النقاط الدائرية لكل خطوة */}
        {stepsArray.map((step) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div
              key={step}
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full font-black text-xs transition-all duration-500 ${
                isCompleted
                  ? "bg-primary text-white scale-100 shadow-sm"
                  : isActive
                  ? "bg-white text-primary border-2 border-primary scale-110 shadow-md shadow-primary/10"
                  : "bg-white text-ink-muted border-2 border-border-warm"
              }`}
            >
              {isCompleted ? (
                // علامة صح لو الخطوة خلصت
                <span className="text-xs font-bold">✓</span>
              ) : (
                // رقم الخطوة لو لسه مخلصتش
                <span>{step}</span>
              )}

              {/* نص صغير اختياري تحت النقطة يوضح اسم الخطوة (يظهر في الشاشات الكبيرة فقط) */}
              {/* <span className={`absolute top-9 text-[10px] whitespace-nowrap font-bold ${isActive ? "text-primary" : "text-ink-muted"}`}>
                {step === 1 && "ترحيب"}
                {step === 2 && "طفلك"}
                {step === 3 && "اهتمامات"}
                {step === 4 && "الوقت"}
                {step === 5 && "الهدية"}
              </span> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}