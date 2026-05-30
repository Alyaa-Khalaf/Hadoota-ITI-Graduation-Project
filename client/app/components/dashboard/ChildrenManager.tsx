"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ChildrenManager() {
  // بيانات تجريبية للأطفال (لحد ما نربط مع هند)
  const [children, setChildren] = useState([
    { id: 1, name: "ياسين", age: 5, avatar: "👦", level: "مبتدئ", interests: "الفضاء" },
    { id: 2, name: "ليلى", age: 7, avatar: "👧", level: "متوسط", interests: "الحيوانات" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  // دالة الحذف (هنا هند هتديكي رابط الـ Delete)
  const confirmDelete = () => {
    setChildren(children.filter(child => child.id !== selectedChildId));
    setShowDeleteDialog(false);
    setSelectedChildId(null);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* رأس الصفحة وزرار الإضافة */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-gray-800">أطفالي الصغار 👶</h3>
          <p className="text-xs font-bold text-gray-400">أضف وادر ملفات أطفالك لتخصيص تجربتهم.</p>
        </div>
        <Button variant="primary" className="!py-2 !px-6 text-xs font-black" onClick={() => setIsAdding(true)}>
          إضافة طفل جديد +
        </Button>
      </div>

      {/* قائمة كروت الأطفال */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map((child) => (
          <div key={child.id} className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="text-5xl bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              {child.avatar}
            </div>
            <h4 className="text-center text-lg font-black text-gray-800">{child.name}</h4>
            <div className="flex justify-center gap-2 mt-2">
              <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">العمر: {child.age} سنوات</span>
              <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-bold">{child.level}</span>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button variant="sky" className="flex-1 !py-2 text-[11px] font-black text-gray-700">تعديل ✏️</Button>
              <Button 
                variant="sky" 
                className="!py-2 !px-4 text-[11px] font-black text-red-500 bg-red-50 hover:bg-red-100"
                onClick={() => { setSelectedChildId(child.id); setShowDeleteDialog(true); }}
              >
                حذف 🗑️
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* مودال إضافة طفل (UI تجريبي للفورم) */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-fadeIn">
            <h3 className="text-xl font-black text-center mb-6">إضافة مغامر جديد 🚀</h3>
            <div className="space-y-4">
              <Input type="text" placeholder="اسم الطفل" label="الاسم" />
              <Input type="number" placeholder="العمر" label="العمر" />
              <div>
                <label className="block text-xs font-black mb-2">اختر الأفاتار</label>
                <div className="flex gap-3 justify-center text-3xl bg-gray-50 p-3 rounded-2xl">
                  <span className="cursor-pointer hover:scale-125 transition">👦</span>
                  <span className="cursor-pointer hover:scale-125 transition">👧</span>
                  <span className="cursor-pointer hover:scale-125 transition">👶</span>
                  <span className="cursor-pointer hover:scale-125 transition">🧚‍♂️</span>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="primary" fullWidth={true} className="!py-3 font-black" onClick={() => setIsAdding(false)}>حفظ الطفل ✨</Button>
                <Button variant="sky" className="!py-3 px-6 font-bold" onClick={() => setIsAdding(false)}>إلغاء</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ديالوج الحذف (Confirmation Dialog) */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-6 max-w-xs w-full text-center space-y-4 animate-bounceIn">
            <div className="text-4xl">⚠️</div>
            <h4 className="text-lg font-black">هل أنت متأكد من الحذف؟</h4>
            <p className="text-xs text-gray-500 font-bold">سيتم حذف كافة بيانات الطفل ولا يمكن استعادتها.</p>
            <div className="flex gap-2">
              <Button variant="primary" className="flex-1 !bg-red-500 !py-2 font-black" onClick={confirmDelete}>نعم، احذف</Button>
              <Button variant="sky" className="flex-1 !py-2 font-black" onClick={() => setShowDeleteDialog(false)}>تراجع</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}