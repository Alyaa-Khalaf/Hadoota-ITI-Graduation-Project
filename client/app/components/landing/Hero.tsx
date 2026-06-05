"use client";
import { motion } from "framer-motion";
import Link from "next/link";
// استيراد المكونات الموحدة بالمسار النسبي الصحيح
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-story-bg pt-40 pb-24 text-center" dir="rtl">
      {/* تأثيرات الإضاءة الخلفية الناعمة */}
      <div className="pointer-events-none absolute left-1/2 top-12 h-96 w-96 -translate-x-1/2 rounded-full bg-sky/10 blur-3xl" />
      
      <div className="container mx-auto max-w-4xl px-4 flex flex-col items-center">
        
        {/* البادج العلوي المخصص موروث بالكامل من الـ ui */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Badge variant="dreamy">✨ التطبيق الأول لقصص الأطفال التفاعلية في مصر</Badge>
        </motion.div>

        {/* العنوان الرئيسي الكبير */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl font-black leading-tight text-ink md:text-6xl lg:text-7xl font-sans max-w-3xl tracking-tight"
        >
          حوّل وقت الشاشة إلى <span className="text-sky">مغامرة تعليمية</span> ممتعة
        </motion.h1>

        {/* الوصف القصير */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="mt-8 max-w-2xl text-lg font-bold leading-relaxed text-ink-muted sm:text-xl font-sans"
        >
          قصص تفاعلية ذكية، آمنة ومسلية، مصممة خصيصاً لتنمية خيال طفلك وبناء مهاراته اللغوية والأخلاقية.
        </motion.p>

        {/* أزرار التحكم والـ Call to Action موروثة من الـ ui بالكامل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          {/* رابط تسجيل جديد موجه لصفحة الـ register ومبني بزرار الـ primary الأزرق */}
          <Link href="/auth/register" className="w-full sm:w-auto">
            <Button variant="sky" fullWidth className="text-lg !py-4 !px-10">
              ابدأ رحلة طفلك السحرية الآن ✨
            </Button>
          </Link>

          {/* زرار آراء الأهالي واخد ستايل الـ outline الشفاف المحترف */}
          <Link href="#testimonials" className="w-full sm:w-auto">
            <Button variant="outline" fullWidth className="text-lg !py-4 !px-10">
              شاهد آراء الأهالي والتجارب 💬
            </Button>
          </Link>
        </motion.div>

        {/* البادجات السفلية المرنة موروثة بالكامل من الـ ui لتوحيد ستايل الكبسولات */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          <Badge variant="sunny">🧠 محتوى متوافق مع علم نفس الطفل</Badge>
          <Badge variant="dreamy">🛡️ آمن وخالٍ من الإعلانات تماماً</Badge>
          <Badge variant="sky">🔒 رقابة وتحكم كامل للأبوين</Badge>
        </motion.div>

      </div>
    </section>
  );
}