"use client";
import { Button } from "@/components/ui/Button"; // تأكد من استيراد المكون الصحيح
import { signIn } from "next-auth/react";
import Chrome  from "lucide-react"; // أيقونة بديلة لجوجل
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
interface SocialLoginProps {
  isLoading: boolean;
}

export default function SocialLogin({ isLoading }: SocialLoginProps) {
  const handleGoogleLogin = () => {
    if (isLoading) return;
    signIn("google", { callbackUrl: "/childAdventure" });
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-border-warm"></div>
        <span className="flex-shrink mx-4 text-sm font-bold text-ink-muted">أو المتابعة عبر</span>
        <div className="flex-grow border-t border-border-warm"></div>
      </div>

      <Button
        type="button"
        variant="outline" // أو استخدم variant="sky" إذا كان معرفاً لديك
        className="w-full !py-6 font-black flex items-center justify-center gap-3 border-border-warm hover:bg-primary-wash hover:border-primary transition-all duration-300"
        disabled={isLoading}
        onClick={handleGoogleLogin}
      >
        {/* يمكنك استبدال Chrome بأيقونة Google من react-icons/fc إذا أردت اللون الرسمي */}
       <FontAwesomeIcon icon={faGoogle} className="text-[#DB4437]" />
        <span className="text-ink">الدخول بواسطة حساب جوجل</span>
      </Button>
    </div>
  );
}