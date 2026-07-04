"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Badge from "../ui/Badge";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-primary-wash text-ink font-sans"
      dir="rtl"
    >
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 text-right md:grid-cols-3">
          {/* عن حدوتة */}
          <div className="space-y-4">
            <h4 className="text-xl font-black tracking-tight text-header">
              <img
                src="https://i.postimg.cc/vBh3rg27/6dcc91a697e148f9b10475c183968468.png"
                alt="Hadoota Logo"
              />
            </h4>

            <p className="max-w-xs text-sm font-bold leading-relaxed text-ink-muted">
              منصة مصرية مبتكرة لقصص الأطفال التفاعلية والذكية، مصممة لتنمية
              خيال طفلك وبناء مهاراته وأخلاقه في بيئة تعليمية آمنة وممتعة.
            </p>
          </div>

          {/* روابط سريعة */}
          <div className="space-y-4">
            <h5 className="text-base font-black">🔗 روابط سريعة</h5>

            <ul className="space-y-3 text-sm font-bold">
              <li>
                <Link
                  href="#features"
                  className="
  text-ink-muted
  transition-colors
  hover:text-primary
"
                >
                  الموضوعات التعليمية
                </Link>
              </li>

              <li>
                <Link
                  href="#pricing"
                  className="
                    text-white/70
                    transition-colors
                    hover:text-primary-light
                  "
                >
                  خطط الأسعار
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="
                    text-white/70
                    transition-colors
                    hover:text-primary-light
                  "
                >
                  سياسة الخصوصية والأمان
                </Link>
              </li>
            </ul>
          </div>

          {/* التواصل */}
          <div className="space-y-4">
            <h5 className="text-base font-black text-header">💌 تواصل معنا</h5>

            <p className="text-sm font-bold text-ink-muted">
              لديك أي استفسار أو اقتراح؟ فريقنا يسعد بخدمتك دائماً.
            </p>

            <div className="inline-block">
              <Badge variant="sky">support@hadouta.com</Badge>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-primary/15 pt-8 text-center">
          <p className="text-xs font-bold text-ink-muted">
            © ٢٠٢٦ حدوتة. صُنع بكل حب من أجل جيل ذكي ومبدع 🚀
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
