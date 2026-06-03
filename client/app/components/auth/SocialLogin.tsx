"use client";
import Button from "../ui/Button";

interface SocialLoginProps {
  isLoading: boolean;
}

export default function SocialLogin({ isLoading }: SocialLoginProps) {
  const handleGoogleLogin = () => {
    if (isLoading) return;
    // هنا بيتم التوجيه لـ API جوجل الخاص بعلياء
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/google`;
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-border-warm/60"></div>
        <span className="flex-shrink mx-4 text-xs font-bold text-ink-muted">أو يمكنك المتابعة عبر</span>
        <div className="flex-grow border-t border-border-warm/60"></div>
      </div>

      <Button
        type="button"
        variant="sky"
        fullWidth={true}
        disabled={isLoading}
        onClick={handleGoogleLogin}
        className="!py-3 font-bold flex items-center justify-center gap-2"
      >
        <span>🌐</span>
        <span>الدخول بواسطة حساب جوجل</span>
      </Button>
    </div>
  );
}