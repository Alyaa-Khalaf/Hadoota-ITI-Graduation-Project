"use client";
import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import {useEffect, useState} from "react";

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

type Testimonial = {
  id: string;
  name: string;
  role: string;
  title: string;
  quote: string;
  avatar?: string;
  avatarBg?: string;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        // استبدل ده بالـ endpoint الحقيقي لاحقاً
        // const res = await fetch("/api/testimonials");
        // const data = await res.json();
        // setTestimonials(data.data?? []);

      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      } finally {
        setLoading(false);
      }
    };

    // fetchTestimonials();
  }, []);

  return (
    // استخدام لون خلفية متناسق مأخوذ من الـ Config بدلاً من درجة اللون العشوائية لتطابق النظام الموحد
    <section id="testimonials" className="bg-story-bg py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 text-center font-sans">
        
        {/* البادج العلوي الموحد */}
        <div>
          <Badge variant="sunny">آراء الأهل</Badge>
        </div>

        {/* العنوان الرئيسي الكبير */}
        <h2 className="mt-4 text-4xl font-black text-ink md:text-5xl">
          ماذا يقول <span className="text-sky">أهالينا؟</span>
        </h2>
        
        <p className="mx-auto mt-3 max-w-2xl text-base font-bold text-ink-muted md:text-lg">
          أكثر من عائلة مصرية وثقت بحدوتة – إليك بعض آرائهم
        </p>

        {/* شبكة الكروت الثلاثية المبهجة الموروثة من الـ UI */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          variants={list} 
          className="mt-16 grid gap-8 md:grid-cols-3 text-right"
        >
          {testimonials?.map((t) => (
            <motion.div key={t.id} variants={item} className="flex">
              {/* وراثة الكارت بالكامل وجعله يتمدد ليتساوى مع جيرانه تلقائياً */}
              <Card 
                hoverEffect={true} 
                className="relative flex flex-col justify-between w-full p-8"
              >
                <div>
                  {/* علامة الاقتباس الموف الأنيقة */}
                  <div className="absolute top-6 left-6 text-3xl font-serif text-magic/20 select-none">
                    ❞
                  </div>

                  {/* العنوان الداخلي المبهج للكارت موروث من الـ ui */}
                  <div className="mb-5">
                    <Badge variant="dreamy">"{t.title}"</Badge>
                  </div>

                  {/* نص الرأي الكامل */}
                  <p className="text-sm font-bold leading-relaxed text-ink-muted">
                    {t.quote}
                  </p>
                </div>

                {/* الجزء السفلي: بيانات الشخص والأفاتار */}
                <div className="mt-8 pt-5 border-t border-border-warm/40">
                  <div className="flex items-center gap-3">
                    {/* الأفاتار */}
                    <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center text-lg shadow-inner select-none`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-black text-sm text-ink">{t.name}</p>
                      <p className="text-xs font-bold text-ink-muted mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}