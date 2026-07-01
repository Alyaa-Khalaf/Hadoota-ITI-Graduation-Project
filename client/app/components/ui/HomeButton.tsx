"use client";

import Link from "next/link";
import { Home } from "lucide-react";

/**
 * زر عائم بسيط يرجّع المستخدم للصفحة الرئيسية المناسبة.
 * يُضاف للصفحات اللي مفيهاش Navbar أو رابط رجوع.
 *
 * @param href وجهة الرجوع — افتراضيًا "/" (هوم الموقع العام).
 *             لصفحات الطفل مرّر "/childAdventure".
 * @param label نص الـ tooltip / accessibility.
 */
export default function HomeButton({
  href = "/",
  label = "الصفحة الرئيسية",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      dir="rtl"
      className="
        fixed top-4 right-4 z-50
        flex items-center gap-2
        rounded-full
        bg-white/90 backdrop-blur
        border-2 border-primary/30
        px-4 py-2.5
        text-sm font-black text-primary
        shadow-lg
        transition hover:scale-105 hover:bg-white
      "
    >
      <Home size={18} />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
