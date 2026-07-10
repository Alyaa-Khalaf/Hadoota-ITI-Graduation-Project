"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  UserCircle,
  Palette,
  BookOpen,
  Trophy,
  BarChart3,
  ShieldCheck,
  Languages,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link"; // استبدلنا Button بـ Link لـ Next.js

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  span: string;
};

const features: Feature[] = [
  { icon: Sparkles, title: "قصص بالذكاء الاصطناعي", description: "أنشئ قصة كاملة خلال ثوانٍ بناءً على عمر الطفل واهتماماته.", iconBg: "bg-amber-100", iconColor: "text-amber-600", span: "md:col-span-2" },
  { icon: UserCircle, title: "طفلك هو البطل", description: "يمكن إدخال اسم الطفل ليصبح الشخصية الرئيسية داخل القصة.", iconBg: "bg-rose-100", iconColor: "text-rose-600", span: "md:col-span-1" },
  { icon: Palette, title: "اختيار الشخصيات", description: "اختر شخصية مفضلة مثل رائد فضاء أو أميرة أو مستكشف أو روبوت.", iconBg: "bg-violet-100", iconColor: "text-violet-600", span: "md:col-span-1" },
  { icon: BookOpen, title: "مكتبة القصص", description: "جميع القصص محفوظة ويمكن قراءتها مرة أخرى في أي وقت.", iconBg: "bg-sky-100", iconColor: "text-sky-600", span: "md:col-span-2" },
  { icon: Trophy, title: "نظام الإنجازات", description: "يحصل الطفل على شارات وإنجازات مع استمرار القراءة.", iconBg: "bg-yellow-100", iconColor: "text-yellow-600", span: "md:col-span-1" },
  { icon: BarChart3, title: "لوحة تحكم الوالدين", description: "متابعة القصص المقروءة ومستوى نشاط الطفل.", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", span: "md:col-span-2" },
  { icon: ShieldCheck, title: "بيئة آمنة للأطفال", description: "كل المحتوى مناسب للأطفال ويتم مراجعته قبل عرضه.", iconBg: "bg-teal-100", iconColor: "text-teal-600", span: "md:col-span-2" },
  { icon: Languages, title: "اللغة العربية", description: "قصص عربية جميلة سهلة القراءة ومناسبة لجميع الأعمار.", iconBg: "bg-fuchsia-100", iconColor: "text-fuchsia-600", span: "md:col-span-1" },
];

export function FeaturesSection() {
  return (
    <section dir="rtl" className="relative overflow-hidden  px-4 py-24 sm:px-8 sm:py-32">
      {/* الخلفية والأشكال المتحركة كما هي */}
      <div className="relative mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md">
             لماذا حدوتة؟
          </Badge>
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            كل قصة تصنع مغامرة جديدة
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            حدوتة ليست مجرد قصص للأطفال... إنها تجربة تفاعلية تنمي الخيال، التعلم، والإبداع مع متابعة كاملة من الوالدين.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 lg:mt-20">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 flex flex-col items-center justify-center gap-3 sm:mt-20">
          <Button asChild size="lg" className="rounded-full bg-slate-900 px-8 py-6 text-base font-medium text-white shadow-lg hover:scale-[1.02]">
            <Link href="/auth/register">ابدأ أول قصة الآن</Link>
          </Button>
          <p className="text-sm text-slate-500">مجاناً — بدون الحاجة لبطاقة ائتمان</p>
        </motion.div>
      </div>
    </section>
  );
}

// فصلنا الـ Card في مكون فرعي لتحسين الأداء (أفضل ممارسة في Next.js)
function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} whileHover={{ y: -6 }} className={`group ${feature.span}`}>
      <Card className="relative h-full overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] backdrop-blur-xl">
        <CardContent className="relative flex h-full flex-col items-start gap-5 p-7 sm:p-8">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconBg} shadow-sm ring-1 ring-white/70`}>
            <Icon className={`h-7 w-7 ${feature.iconColor}`} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}