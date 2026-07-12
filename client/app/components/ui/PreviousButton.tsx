"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PreviousButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="
        fixed top-4 left-4 z-50
        flex items-center justify-center
        w-12 h-12 
        rounded-full
        bg-white/90 backdrop-blur
        border-2 border-primary/30
        text-primary
        shadow-lg
        transition-all duration-300
        hover:scale-110 hover:bg-white hover:border-primary/50
        active:scale-95
      "
      aria-label="رجوع"
    >
      <ArrowLeft size={24} strokeWidth={3} />
    </button>
  );
}