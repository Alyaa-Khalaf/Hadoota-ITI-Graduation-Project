"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, UserCircle } from "lucide-react";
import CTAImage from '../../../public/assets/CTA.jpg';
import Image from "next/image";


export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24" dir="rtl">
      {/* خلفية متدرجة (Gradient Background) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-magic" />

      {/* عناصر توهج ديكوراتيف (Decorative blurs) */}
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-sunny/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* جزء النصوص */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-white/20 text-white mb-6 border-white/20">
              <Sparkles className="w-3 h-3 ml-1" /> رحلة آمنة وممتعة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              هل أنت مستعد لمنح طفلك <br />
              <span className="text-sunny">أفضل تجربة تعليمية؟</span>
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              انضم إلى آلاف الأهالي الذين وثقوا في حدوتة. احصل على رؤية كاملة لتطور طفلك، وأدر أوقات تعلمه بكل سهولة.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
  {/* الزر الأول */}
  <Button 
    size="lg" 
    className="rounded-2xl bg-white text-primary hover:bg-white/90 text-base font-bold shadow-xl px-8 h-14" 
    asChild
  >
    <Link href="/auth/register" className="flex items-center gap-2">
      ابدأ رحلة طفلك الآن 
      {/* استخدمنا ArrowLeft عشان يكون متوافق مع اتجاه الكتابة بالعربي */}
      <ArrowRight className="w-5 h-5" /> 
    </Link>
  </Button>

  {/* الزر الثاني */}
  <Button 
    size="lg" 
    variant="default" 
    className="rounded-2xl border-white/30 text-white hover:bg-white/10 text-base font-bold px-8 h-14" 
    asChild
  >
    <Link href="/about" className="flex items-center gap-2">
      <UserCircle className="w-5 h-5" /> اكتشف لوحة الآباء
    </Link>
  </Button>
</div>
          </motion.div>

          {/* جزء الصورة والعناصر العائمة */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center relative"
          >
            <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative">
              {/* هنا ضعي صورتك الجديدة التي سنتفق عليها */}
              <Image
              src={CTAImage} alt="طفل يقرأ" className="w-full h-full object-cover" />
            </div>

            {/* عناصر عائمة (بدل PawPrint استخدمنا نجوم) */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-4 -left-4"
            >
              <Sparkles className="w-10 h-10 text-sunny" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute bottom-8 -right-4"
            >
              <Sparkles className="w-12 h-12 text-sky" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}