"use client";
import { motion } from "framer-motion";
import Link from "next/link";
// استيراد البادج الموحد بالمسار النسبي الصحيح
import Badge from "../ui/Badge";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      // التدرج المبهج من البرتقالي الأساسي (primary) إلى الأزرق (sky) متناسق مع الـ CTA
      className="bg-gradient-to-r from-primary to-sky text-story-bg font-sans"
      dir="rtl"
    >
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3 text-right">
          
          {/* العمود الأول: عن حدوتة */}
          <div className="space-y-4">
            <h4 className="text-xl font-black tracking-tight text-white">✨ حدوتة</h4>
            <p className="text-sm font-bold leading-relaxed text-story-bg/85 max-w-xs">
              منصة مصرية مبتكرة لقصص الأطفال التفاعلية والذكية، مصممة بأيدي خبراء لتنمية خيال طفلك وبناء مهاراته وأخلاقه بأمان تام.
            </p>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div className="space-y-4">
            <h5 className="text-base font-black text-white">🔗 روابط سريعة</h5>
            <ul className="text-sm font-bold space-y-3">
              <li>
                <Link href="#features" className="text-story-bg/80 transition duration-200 hover:text-white hover:underline">
                  الموضوعات التعليمية
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-story-bg/80 transition duration-200 hover:text-white hover:underline">
                  خطط الأسعار
                </Link>
              </li>
              <li>
                <Link href="#" className="text-story-bg/80 transition duration-200 hover:text-white hover:underline">
                  سياسة الخصوصية والأمان
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود الثالث: تواصل معنا */}
          <div className="space-y-4">
            <h5 className="text-base font-black text-white">💌 تواصل معنا</h5>
            <p className="text-sm font-bold text-story-bg/85">
              لديك أي استفسار أو اقتراح؟ فريقنا يسعد بخدمتك دائماً.
            </p>
            {/* التعديل هنا: لفينا البادج جوه الـ div وحطينا الاستايل عليه عشان TypeScript ميعترضش */}
            <div className="inline-block !text-sm font-black tracking-wide">
              <Badge variant="dark">
                support@hadouta.com
              </Badge>
            </div>
          </div>
        </div>

        {/* خط الفصل السفلي النظيف */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs font-bold text-story-bg/70">
          © ٢٠٢٦ حدوتة. صُنع بكل حب من أجل جيل ذكي ومبدع 🚀
        </div>
      </div>
    </motion.footer>
  );
}