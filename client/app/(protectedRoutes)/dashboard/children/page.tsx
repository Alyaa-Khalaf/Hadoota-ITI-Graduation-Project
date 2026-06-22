"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";


/* تعليق: هيكل بيانات الطفل المطابق تماماً للـ Response القادم من قاعدة البيانات */
interface Child {
  _id: string;
  name: string;
  age: number;
  avatar: string;
  interests: string[];
  learningLevel: "beginner" | "intermediate" | "advanced";
}

/* تعليق: الهيكل العام الموحد لاستقبال رد الـ API */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

export default function ChildrenPage() {
  /* تعليق: الـ States الخاصة بحفظ المصفوفة وحالات تحميل وفتح النوافذ المنبثقة */
  const [children, setChildren] = useState<Child[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  /* تعليق: الحالات الخاصة ببيانات الطفل الجديد داخل حقول الإدخال والفورم */
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("6");
  const [childGender, setChildGender] = useState<"male" | "female">("male");
  const [learningLevel, setLearningLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  /* تعليق: مصفوفة الاهتمامات المعتمدة باللغة العربية داخل الـ Enum الخاص بالباك إيند */
  const availableInterests = ["فضاء", "حيوانات", "مغامرات", "تاريخ", "علوم", "دين", "طبيعة", "رياضة"];

  // ========================================================
  // 📥 دالة الـ GET: جلب مصفوفة الأطفال الحقيقية بناءً على توكن الأب
  // ========================================================
  const fetchChildren = async () => {
    try {
      let token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/children", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        const result: ApiResponse<Child[]> = await res.json();
        /* ملاحظة ذهبية: يتم قراءة المصفوفة مباشرة من result.data */
        if (result.success && Array.isArray(result.data)) {
          console.log("Children API:", result.data);
          setChildren(result.data);
        }
      } else {
        console.error("السيرفر رفض جلب الأطفال كود:", res.status);
      }
    } catch (err) {
      console.error("خطأ في جلب قائمة الأطفال", err);
    }
  };

  /* تعليق: استدعاء دالة جلب البيانات فور تحميل الصفحة لأول مرة */
  useEffect(() => {
    fetchChildren();
  }, []);

  // ========================================================
  // 🎛️ دالة مساعدة لإدارة تفعيل وإلغاء اختيار الاهتمامات (Checkboxes)
  // ========================================================
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  // ========================================================
  // 📤 دالة الـ POST: إرسال الكائن الحقيقي بالبيانات الصحيحة هندسياً للسيرفر
  // ========================================================
  const handleAddChild = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!childName || !childAge) return;

  try {
    // to read tokens
    let token = localStorage.getItem("accessToken") || localStorage.getItem("token");

    const bodyPayload = {
      name: childName,
      age: Number(childAge),
      avatar: childGender === "male" ? "👦" : "👧",
      interests: selectedInterests,
      learningLevel: learningLevel
    };

    const res = await fetch("http://localhost:5000/api/children", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(bodyPayload),
    });

    if (res.ok) {
      const result: ApiResponse<Child> = await res.json();

      if (result.success) {
        await fetchChildren(); // 👈 أهم تعديل
      }

      setIsAdding(false);
      setChildName("");
      setChildAge("6");
      setChildGender("male");
      setLearningLevel("beginner");
      setSelectedInterests([]);
    } else {
      console.error("فشلت إضافة الطفل، كود الاستجابة:", res.status);
    }
  } catch (err) {
    console.error("خطأ في إضافة الطفل", err);
  }
};

  // ========================================================
  // 🗑️ دالة الـ DELETE: حذف ملف الطفل نهائياً وتحديث الواجهة
  // ========================================================
  const confirmDelete = async () => {
    if (!selectedChildId) return;

    try {
      let token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const cleanId = String(selectedChildId).trim();
      
      let res = await fetch(`http://localhost:5000/api/children/${cleanId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      const result = await res.json();
      
      if (res.ok && result.success) {
        setShowDeleteDialog(false);
        setChildren((prevChildren) => 
          prevChildren.filter((child) => String(child._id) !== cleanId)
        );
        setSelectedChildId(null);
      } else {
        alert(`فشل الحذف، كود حالة السيرفر: ${res.status}`);
      }
    } catch (err) {
      console.error("خطأ في حذف الطفل", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-secondary">إدارة أطفالك 👦👧</h1>
        <Button variant="primary" onClick={() => setIsAdding(true)}>إضافة طفل جديد +</Button>
      </div>

      {/* واجهة عرض كروت ومصفوفة الأطفال الحقيقية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {children.length === 0 ? (
          <p className="text-sm font-bold text-gray-400 col-span-full text-center py-8">لا يوجد أطفال مضافين حالياً ✨</p>
        ) : (
          children.map((child, index) => {
            const childId = child._id;
            return (
              <div key={childId || `child-${index}`} className="bg-white p-5 rounded-[25px] shadow-sm border border-gray-100 flex flex-col justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl"> {child.avatar} </span>
                  <div>
                    <h3 className="font-bold text-base text-secondary">{child.name}</h3>
                    <p className="text-xs text-gray-500 font-bold">العمر: {child.age} سنوات</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 space-y-2">
                  <div className="text-[11px] font-bold text-gray-600">
                    <span className="text-gray-400">مستوى التعلم:</span>{" "}
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[10px] font-mono">
                      {child.learningLevel}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {child.interests && child.interests.map((interest, i) => (
                      <span key={i} className="bg-orange-50 text-[#FF7043] text-[9px] font-black px-2 py-0.5 rounded-md">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    variant="sky" 
                    className="!p-2 !bg-red-50 !text-red-500 hover:!bg-red-100 border-none text-xs"
                    onClick={() => {
                      if (childId) {
                        setSelectedChildId(childId);
                        setShowDeleteDialog(true);
                      }
                    }}
                  >
                    🗑️ حذف الملف
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* مودال النوافذ المنبثقة لإضافة طفل جديد برمجياً */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddChild} className="bg-white rounded-[30px] p-6 max-w-md w-full space-y-4 shadow-xl max-h-[90vh] overflow-y-auto text-right">
            <h3 className="text-xl font-black text-secondary text-center">إضافة طفل جديد ✨</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">اسم الطفل بالكامل</label>
                <Input 
                  type="text"
                  placeholder="أدخل اسم الطفل هنا..."
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  required
                  label=""
                /> 
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">العمر</label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none font-bold bg-gray-50 text-xs text-secondary"
                    required
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <option key={num} value={num}>{num} سنوات</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1">الجنس</label>
                  <select
                    value={childGender}
                    onChange={(e) => setChildGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none font-bold bg-gray-50 text-xs text-secondary"
                    required
                  >
                    <option value="male">ذكر (👦)</option>
                    <option value="female">أنثى (👧)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">مستوى التعلم الحالي</label>
                <select
                  value={learningLevel}
                  onChange={(e) => setLearningLevel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none font-bold bg-gray-50 text-xs text-secondary"
                  required
                >
                  <option value="beginner">مبتدئ (Beginner)</option>
                  <option value="intermediate">متوسط (Intermediate)</option>
                  <option value="advanced">متقدم (Advanced)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">شغف واهتمامات الطفل (محدد من السكيما)</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                  {availableInterests.map((interest) => (
                    <label key={interest} className="flex items-center gap-2 font-bold text-gray-600 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedInterests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                        className="rounded text-primary focus:ring-primary w-4 h-4"
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" fullWidth={true} className="!py-3 font-black">حفظ الطفل ✨</Button>
                <Button type="button" variant="sky" className="!py-3 px-6 font-bold" onClick={() => setIsAdding(false)}>إلغاء</Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ديالوج لتأكيد مسح البيانات من السيرفر */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-6 max-w-xs w-full text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h4 className="text-lg font-black">هل أنت متأكد من الحذف؟</h4>
            <p className="text-xs text-gray-500 font-bold">سيتم حذف كافة بيانات الطفل نهائياً.</p>
            <div className="flex gap-2">
              <Button variant="primary" className="flex-1 !bg-red-500 !py-2 font-black" onClick={confirmDelete}>نعم، احذف</Button>
              <Button variant="sky" className="flex-1 !py-2 font-bold" onClick={() => { setShowDeleteDialog(false); setSelectedChildId(null); }}>إلغاء</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}