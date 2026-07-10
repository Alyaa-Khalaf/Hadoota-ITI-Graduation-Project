"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import welcomeImage from "../../../public/assets/storyBg.jpg";

export default function WelcomeHero({ name }: { name: string }) {
  return (
    <section className="container mx-auto px-4 my-8 ">
      {/* Container بتنسيق الـ Pill والـ Shadow الخاص بمشروعك */}
      <div className="relative rounded-[2.5rem] overflow-hidden  border border-border shadow-md">
        <div className="grid md:grid-cols-2 gap-8 items-center bg-primary/10 p-8 md:p-12 lg:p-16">
          
          {/* الصورة مع تأثيرات الحركة */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-[4/3] rounded-[2rem] overflow-hidden card-elevated"
          >
            <Image
              src={welcomeImage}
              alt="مغامرة بطل الأبطال"
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>

          {/* المحتوى */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading leading-[1.1] text-foreground">
                مرحباً يا <span className="text-gradient-primary font-bold">{name}</span>
                <br />
                <span className="text-muted-foreground">جاهز لمغامرة جديدة؟</span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start">
              {/* زر بطل الأبطال يستخدم الـ Primary */}
              <Button
                
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg transition-all hover:scale-105"
              >
                <Link href="/characters">ابدأ المغامرة الآن 🚀</Link>
              </Button>
              
              {/* زر الألعاب يستخدم الـ Muted */}
              <Button
                
                variant="outline"
                className="rounded-full px-8 py-6 text-lg border-2 hover:bg-muted transition-all hover:scale-105"
              >
                <Link href="/games/GamesHub">الألعاب 🎮</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}