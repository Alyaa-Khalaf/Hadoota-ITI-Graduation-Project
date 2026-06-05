"use client";
import { motion } from "framer-motion";
// استيراد الكارت الموحد بالمسار النسبي الصحيح
import Card from "../ui/Card";

const topics = [
  { icon: "🦕", label: "الديناصورات" },
  { icon: "🚀", label: "الفضاء" },
  { icon: "🦁", label: "الحيوانات" },
  { icon: "🌊", label: "البحر" },
  { icon: "⭐", label: "الأنبياء" },
  { icon: "🌱", label: "النباتات" },
  { icon: "🏛️", label: "مصر الجميلة" },
  { icon: "🎨", label: "الألوان" },
  { icon: "🔢", label: "الأرقام" },
  { icon: "👨‍👩‍👧", label: "العائلة" },
];

export default function Features() {
  return (
    // الخلفية مضبوطة على لون حالم ومريح مأخوذ من ألوان الـ Config الخاصة بكِ (page-dreamy)
    <section id="features" className="bg-page-dreamy/40 py-24" dir="rtl">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* النصوص العلوية المنسقة بحجم خطوط وتوزيع مطابق للهوية */}
        <div className="mx-auto mb-16 max-w-3xl text-center font-sans">
          <h2 className="text-4xl font-black text-ink md:text-5xl tracking-tight">
            آلاف المواضيع لاكتشافها
          </h2>
          <p className="mt-3 text-base font-bold text-ink-muted md:text-lg">
            دع طفلك يختار موضوعه المفضل لبناء قصته الفريدة
          </p>
        </div>

        {/* الكروت الموزعة بنظام مرن وموروثة بالكامل من الـ UI */}
        <div className="flex flex-wrap justify-center gap-4 max-w-7xl mx-auto font-sans">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              // الحفاظ على أبعاد وتقسيم شبكة الـ Flex الذكية لتطابق الصورة
              className="w-[calc(50%-8px)] sm:w-[calc(33.33%-12px)] md:w-[calc(25%-12px)] lg:w-[calc(16.66%-14px)] min-w-[140px] flex"
            >
              {/* وراثة الكارت بالكامل مع تمرير كلاسات المحاذاة والـ Padding الداخلي كـ Prop */}
              <Card 
                hoverEffect={true}
                className="w-full flex flex-col items-center justify-center p-6 cursor-pointer select-none"
              >
                {/* الإيموجي أو الأيقونة في المنتصف بحجم كبير مبهج */}
                <div className="text-3xl mb-3">
                  {topic.icon}
                </div>
                
                {/* اسم الموضوع مضبوط بلون الـ ink العريض والـ font-sans */}
                <h3 className="text-sm font-black text-ink text-center tracking-tight">
                  {topic.label}
                </h3>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}