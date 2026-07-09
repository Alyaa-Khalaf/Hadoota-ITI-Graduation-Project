"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-primary-wash text-ink font-sans pt-16"
      dir="rtl"
    >
      <div className="container mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-12 text-right md:grid-cols-2 lg:grid-cols-4">
          
          {/* قسم العلامة التجارية */}
          <div className="space-y-4">
            <img src="https://i.postimg.cc/vBh3rg27/6dcc91a697e148f9b10475c183968468.png" alt="Hadoota Logo" className="w-32" />
            <p className="text-sm font-bold leading-relaxed text-ink-muted">
              منصة مصرية مبتكرة لقصص الأطفال التفاعلية والذكية، مصممة لتنمية خيال طفلك وبناء مهاراته في بيئة آمنة.
            </p>
            <div className="flex gap-3">
              {/* {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-primary">
                  <Icon className="w-5 h-5" />
                </a> */}
              {/* ))} */}
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="space-y-4">
            <h5 className="text-base font-black text-header">🔗 روابط سريعة</h5>
            <ul className="space-y-3 text-sm font-bold text-ink-muted">
              <li><Link href="#features" className="hover:text-primary transition-colors">الموضوعات التعليمية</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">خطط الأسعار</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">عن حدوتة</Link></li>
              <li><Link href="/policy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
            </ul>
          </div>

          {/* النشرة البريدية (إضافة جديدة) */}
          <div className="space-y-4">
            <h5 className="text-base font-black text-header">💌 انضم لنشرتنا</h5>
            <p className="text-sm font-bold text-ink-muted">أحدث القصص والنصائح التربوية في بريدك.</p>
            <div className="flex bg-white rounded-xl p-1 border border-primary/10">
              <input type="email" placeholder="بريدك الإلكتروني" className="flex-1 bg-transparent px-3 text-sm outline-none" />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90">اشترك</button>
            </div>
          </div>

          {/* التواصل */}
          <div className="space-y-4 text-sm font-bold text-ink-muted">
            <h5 className="text-base font-black text-header">📞 تواصل معنا</h5>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> ٠١٠٠٠٠٠٠٠٠٠</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> support@hadouta.com</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> القاهرة، مصر</p>
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