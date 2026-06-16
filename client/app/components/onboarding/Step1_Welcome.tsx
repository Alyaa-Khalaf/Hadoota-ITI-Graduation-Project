"use client";
import Button from "../ui/Button";

interface Step1Props {
  onNext: () => void;
}

export default function Step1_Welcome({ onNext }: Step1Props) {
  // قراءة الاسم الوهمي أو الحقيقي لو متسيف
  const parentName = typeof window !== 'undefined' 
    ? localStorage.getItem("parentName") || "ولي الأمر العزيز" 
    : "ولي الأمر العزيز";

  return (
    <div className="text-center space-y-6 py-4 font-sans animate-fadeIn">
      {/* إيموجي أو أيقونة ترحيبية سحرية */}
      <div className="text-6xl animate-bounce">✨👋✨</div>

      {/* عنوان الترحيب */}
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-ink">
          أهلاً بك في عائلة حدوتة، يا {parentName}! ❤️
        </h2>
        <p className="text-sm font-bold text-ink-muted leading-relaxed">
          سعداء جداً بانضمامك إلينا. دعنا نجهز حساب طفلك في خطوات بسيطة لنصنع له رحلة تعليمية وتفاعلية ساحرة تناسب اهتماماته وعمره.
        </p>
      </div>

      {/* بطاقة توضيحية سريعة للخطوات */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-right space-y-2">
        <h4 className="text-xs font-black text-primary">ماذا سنفعل الآن؟</h4>
        <ul className="text-xs font-bold text-ink space-y-1.5 list-disc list-inside pr-1">
          <li>إضافة اسم وعمر طفلك لتخصيص المحتوى.</li>
          <li>تحديد المواضيع المفضلة له (مغامرات، علوم، قيم..).</li>
          <li>ضبط وقت الشاشة اليومي المناسب لك.</li>
        </ul>
      </div>

      {/* زرار الانتقال للخطوة التالية */}
      <div className="pt-4">
        <Button 
          type="button" 
          variant="primary" 
          fullWidth={true} 
          onClick={onNext}
          className="!py-4 text-base font-black shadow-lg shadow-primary/20"
        >
          يلا بينا نبدأ! 🚀
        </Button>
      </div>
    </div>
  );
}