"use client";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

interface Step5Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step5_FreeStory({  }: Step5Props) {
  const router = useRouter();

  const handleFinish = () => {
    // هنا بنقول للتطبيق إن المستخدم خلص الـ Onboarding خلاص
    localStorage.setItem("onboardingCompleted", "true");
    
    // التوجه للوحة التحكم (Dashboard) لبدء صناعة الحواديت
    router.push("/dashboard");
  };

  return (
    <div className="text-center space-y-8 py-6 font-sans animate-fadeIn">
      {/* أيقونة الهدية السحرية */}
      <div className="relative inline-block">
        <div className="text-8xl animate-pulse">🎁</div>
        <div className="absolute -top-2 -right-2 text-3xl animate-bounce">✨</div>
      </div>

      {/* رسالة النجاح والاحتفال */}
      <div className="space-y-3">
        <h2 className="text-2xl font-black text-ink">لقد انتهينا بنجاح! 🎉</h2>
        <p className="text-sm font-bold text-ink-muted leading-relaxed max-w-sm mx-auto">
          كل شيء جاهز الآن. لقد قمنا بتجهيز أول "حدوتة" سحرية خصيصاً لطفلك كهدية ترحيبية من عائلة حدوتة.
        </p>
      </div>

      {/* ملخص سريع لما تم إنجازه (اختياري لكنه يعطي شعوراً بالإنجاز) */}
      <div className="grid grid-cols-2 gap-4 text-right">
        <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
          <span className="text-xs font-black text-sky-700 block mb-1">الاهتمامات</span>
          <span className="text-[10px] font-bold text-ink">تم التخصيص بنجاح ✅</span>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
          <span className="text-xs font-black text-amber-700 block mb-1">وقت الشاشة</span>
          <span className="text-[10px] font-bold text-ink">مُفعل ومحمي 🔒</span>
        </div>
      </div>

      {/* الزرار النهائي الكبير */}
      <div className="pt-6">
        <Button 
          type="button" 
          variant="primary" 
          fullWidth={true} 
          onClick={handleFinish}
          className="!py-5 text-lg font-black shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
        >
          اكتشف حكايتك الأولى الآن! 📖✨
        </Button>
        <p className="mt-4 text-[10px] font-bold text-ink-muted">
          بضغطك على الزر، ستبدأ رحلة الخيال والتعلم.
        </p>
      </div>
    </div>
  );
}