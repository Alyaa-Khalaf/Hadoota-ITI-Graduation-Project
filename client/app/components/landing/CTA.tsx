"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const featuresList = [
  "تقارير أسبوعية مفصلة عن مستوى طفلك",
  "تحكم كامل في وقت الشاشة والقصص",
  "تخصيص واختيار القيم اللغوية والأخلاقية",
];

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-primary to-sky py-24 text-white" dir="rtl">
      <div className="container mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1fr_1.1fr] items-center">
        
        {/* الجزء الأيمن: كارت الـ Mockup الشفاف التوضيحي للوحة التحكم */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-md min-h-[350px] flex flex-col justify-between"
        >
          {/* محاكاة الهيكل الداخلي اللطيف */}
          <div className="rounded-2xl bg-white/10 p-6 border border-white/10">
            <div className="h-4 w-28 rounded bg-white/30 mb-3" />
            <div className="h-3 w-full rounded bg-white/20 mb-2" />
            <div className="h-3 w-3/4 rounded bg-white/20" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
              <div className="h-3 w-16 rounded bg-white/30 mb-3" />
              <div className="h-5 w-24 rounded bg-white/40" />
            </div>
            <div className="rounded-2xl bg-white/10 p-5 border border-white/10">
              <div className="h-3 w-16 rounded bg-white/30 mb-3" />
              <div className="h-5 w-24 rounded bg-white/40" />
            </div>
          </div>
        </motion.div>

        {/* الجزء الأيسر: النصوص والزرار والقائمة المنسقة */}
        <div className="space-y-8 font-sans">
          
          {/* البادج العلوي موروث من الـ UI بالاستايل الداكن الشفاف المتناسق مع التدرج */}
          <div>
            <Badge variant="dark">👪 لوحة الأهل</Badge>
          </div>

          {/* العنوان الرئيسي العريض */}
          <h2 className="text-4xl font-black leading-tight md:text-5xl tracking-tight text-white">
            راحة بال تامة للآباء
          </h2>

          <p className="max-w-xl text-base font-bold leading-relaxed text-white/90 md:text-lg">
            لوحة متكاملة تمنحك رؤية واضحة لتطور طفلك اللغوي، وتتيح لك إدارة أوقات الاستخدام واختيار التوجهات التعليمية المناسبة له بسهولة.
          </p>

          {/* القائمة العمودية الذكية */}
          <div className="space-y-4">
            {featuresList.map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-base font-bold text-white/95">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-black text-white">
                  ✓
                </span>
                <p>{item}</p>
              </div>
            ))}
          </div>

          {/* زر التوجيه موروث بذكاء من الـ UI بستايل story-bg المباين للخط الغامق ink */}
          <div className="pt-4">
            <Link href="/auth/register">
              <Button variant="story-bg" className="text-base !py-4 !px-10">
                استكشف لوحة الآباء
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}