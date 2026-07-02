"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function PreviousButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="
      fixed left-4 top-4
        inline-flex items-center gap-2
        px-5 py-3
        rounded-2xl
        bg-white
        border-2 border-primary
        text-primary
        font-bold
        shadow-md
        transition-all
        hover:bg-primary
        hover:text-white
      "
    >
      <ArrowLeft size={20} />
      رجوع
    </button>
  );
}