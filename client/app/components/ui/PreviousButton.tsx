"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function PreviousButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      
      className="
       fixed top-4 left-4 z-50
        inline-flex items-center gap-2
        rounded-full
        bg-white/90 backdrop-blur
        border-2 border-primary/30
        px-4 py-2.5
        text-sm font-black text-primary
        shadow-lg
        transition hover:scale-105 hover:bg-white
      "
    >
      <ArrowLeft size={20} />
      رجوع
    </button>
  );
}