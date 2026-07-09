"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Step1Props {
  onNext: () => void;
}

export default function Step1_Welcome({ onNext }: Step1Props) {
  // قراءة الاسم مع التأكد من سلامة الكود في بيئة Server/Client
  const parentName = typeof window !== 'undefined' 
    ? localStorage.getItem("parentName") || "ولي الأمر العزيز" 
    : "ولي الأمر العزيز";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 py-6 font-sans"
      dir="rtl"
    >
      {/* أيقونة ترحيبية بتصميم فخم */}
      <div className="mx-auto w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center animate-bounce">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>

      {/* عنوان الترحيب */}
      <div className="space-y-3">
        <h2 className="text-3xl font-black text-slate-900">
          أهلاً بك في عائلة حدوتة، يا {parentName}!
        </h2>
        <p className="text-base text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
          نحن متحمسون جداً لصناعة رحلة تعليمية وتفاعلية ساحرة تناسب طفلك. لنبدأ تجهيز الحساب بلمسات بسيطة.
        </p>
      </div>

      {/* بطاقة توضيحية بستايل الـ Bento Grid */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] rounded-3xl p-6 text-right">
        <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          ماذا سنفعل الآن؟
        </h4>
        <ul className="text-sm font-semibold text-slate-600 space-y-3">
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> تخصيص المحتوى حسب العمر والاهتمامات.
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> إضافة شخصية طفلك المفضلة في القصص.
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" /> ضبط وقت الشاشة الصحي والآمن.
          </li>
        </ul>
      </div>

      {/* الزر الرئيسي بتصميم الـ Template */}
      <Button 
        type="button" 
        size="lg"
        onClick={onNext}
        className="w-full rounded-full py-7 text-lg font-black shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
      >
        يلا بينا نبدأ! <ArrowLeft className="mr-2 h-5 w-5" />
      </Button>
    </motion.div>
  );
}