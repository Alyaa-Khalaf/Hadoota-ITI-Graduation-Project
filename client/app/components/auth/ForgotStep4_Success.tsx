"use client";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

export default function ForgotStep4_Success() {
  const router = useRouter();

  const handleGoToLogin = () => {
    // التوجيه لصفحة تسجيل الدخول الحقيقية بتاعتك
    router.push("/auth/login");
  };

  return (
    <div className="text-center space-y-6 py-4 font-sans animate-fadeIn">
      {/* أيقونة النجاح المتحركة */}
      <div className="relative inline-block">
        <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-500 text-3xl font-bold animate-bounce">
          ✓
        </div>
        <div className="absolute -top-1 -right-1 text-xl animate-pulse">✨</div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-ink">تم التحديث بنجاح! 🎉</h3>
        <p className="text-sm font-bold text-ink-muted leading-relaxed max-w-xs mx-auto">
          تم تغيير كلمة المرور الخاصة بحسابك بنجاح. يمكنك الآن تسجيل الدخول واستكمال رحلة الحكايات السحرية.
        </p>
      </div>

      <div className="pt-4">
        <Button
          type="button"
          variant="primary"
          fullWidth={true}
          onClick={handleGoToLogin}
          className="!py-4 text-base font-black shadow-lg shadow-primary/20"
        >
          تسجيل الدخول الآن 🔐✨
        </Button>
      </div>
    </div>
  );
}