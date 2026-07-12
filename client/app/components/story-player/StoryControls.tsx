"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // مسار الـ Button الخاص بـ shadcn

type Props = {
  next: () => void;
  prev: () => void;
};

export default function StoryControls({ next, prev }: Props) {
  return (
    <div className="flex justify-between items-center mt-10 gap-6">
      <Button
        variant="secondary"
        size="lg"
        onClick={prev}
        className="px-10 py-8 rounded-[28px] text-xl font-black shadow-md hover:scale-105 transition-transform"
      >
        <ArrowRight size={28} className="ml-2" />
        السابق
      </Button>

      <Button
        size="lg"
        onClick={next}
        className="px-10 py-8 rounded-[28px] text-xl font-black shadow-lg hover:scale-105 transition-transform bg-game-quiz text-game-quiz-foreground hover:bg-game-quiz/90"
      >
        التالي
        <ArrowLeft size={28} className="mr-2" />
      </Button>
    </div>
  );
}