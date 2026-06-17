"use client";
import { motion } from "framer-motion";
// استيراد المكونات الموحدة بالمسار النسبي الصحيح
import Badge from "../ui/Badge";
import Card from "../ui/Card";

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const testimonials = [
  {
    name: "أ. هدى منصور",
    role: "معلمة روضة – القاهرة",
    title: "النتيجة في الفصل كانت مذهلة",
    quote: "استخدمت حدوتة في فصلي مع ٢٢ طفل - النتيجة كانت مذهلة! الأطفال بقوا يحبوا القراءة وعندهم مفردات أكثر بكثير. الأسئلة في نهاية القصة بتقيم الفهم بشكل ممتع ومحفز.",
    avatar: "👩‍🏫",
    avatarBg: "bg-cat-nature/40"
  },
  {
    name: "منى إبراهيم",
    role: "أم وطبيبة أطفال",
    title: "آمنة ١٠٠٪ وبتعلّم قيم حلوة",
    quote: "كأم وطبيبة أطفال، أهتم جداً بنوعية المحتوى. حدوتة آمنة ١٠٠٪ وبتعلّم قيم حلوة زي الصدق والشجاعة. بنتي سلمى بتحكيلي القصص وهي فرحانة – ده أكثر حاجة ممكن أتمنّاها.",
    avatar: "👩‍⚕️",
    avatarBg: "bg-cat-adventure"
  },
  {
    name: "أحمد السيد",
    role: "أب لطفلين",
    title: "غيّرت علاقة أولادي بالشاشة تماماً",
    quote: "أولادي كانوا بيقضوا ساعات طويلة بدون فائدة، لكن مع حدوتة الوضع اتغيّر تماماً. بقوا بيسمعوا ويتعلموا، وأنا بتابع تقارير ذكاء أطفال أول بأول وأشوف بالظبط إيه اللي اتعلموه.",
    avatar: "👨",
    avatarBg: "bg-cat-animals"
  },
];

export default function Testimonials() {
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
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={item} className="flex">
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