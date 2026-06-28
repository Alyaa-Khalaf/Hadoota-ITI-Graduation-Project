"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type WelcomeHeroProps = {
  name: string;
};

export default function WelcomeHero({ name }: WelcomeHeroProps) {
  return (
    <div
  dir="rtl"
  className="child-welcome
    relative overflow-hidden text-center
    rounded-b-[28px]
    border-x-[3px] border-b-[3px] border-primary
    p-20
    mt-20
  "
>
 

  {/* Heading */}
  <h1
    className="
      mt-0 mb-3
      text-4xl md:text-5xl
      leading-[1.3]
      text-cat-animals
      font-bold
    "
  >
    مرحبًا يا {name}

    <motion.span
      animate={{ rotate: [0, 25, -10, 20, -5, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1 }}
      className="inline-block origin-[70%_70%]"
    >
      👋
    </motion.span>
  </h1>

  <p className="text-base font-bold mb-7 text-cat-adventure">
    جاهز لمغامرة جديدة مليانة سحر ومتعة؟
  </p>

  {/* CTA Button */}
  <motion.div
    animate={{ y: [0, -5, 0] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    whileHover={{ y: -3 }}
    whileTap={{ y: 3 }}
    className="inline-block"
  >
    <Link href="/characters"
      className="
        inline-flex items-center gap-2
        text-white text-xl bg-primary
        px-9 py-3
        rounded-full
        cursor-pointer mt-8
      "
    >
      🚀 ابدأ المغامرة
    </Link>
  </motion.div>

  
</div>
  );
}