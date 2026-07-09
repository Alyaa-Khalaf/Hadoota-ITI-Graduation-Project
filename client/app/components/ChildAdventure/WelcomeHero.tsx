"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import welcomeImage from "../../../public/assets/storyBg.jpg";

export default function WelcomeHero({ name }: { name: string }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src={welcomeImage} alt="Hero Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-slate-950/60" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            مرحباً يا {name} <br />
            <span className="text-teal-300">جاهز لمغامرة جديدة؟</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10">مغامرة مليانة سحر ومتعة في انتظارك الآن</p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-coral-500 hover:bg-coral-600 h-14 px-8 rounded-xl font-bold shadow-xl shadow-coral-500/20" asChild>
              <Link href="/characters">ابدأ المغامرة الآن 🚀</Link>
            </Button>
            <Button size="lg" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 h-14 px-8 rounded-xl font-bold" asChild>
              <Link href="/games/GamesHub">الألعاب 🎮</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}