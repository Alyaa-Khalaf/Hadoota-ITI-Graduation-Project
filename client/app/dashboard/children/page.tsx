"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // بيانات الطفل الجديد للفورم
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childAvatar, setChildAvatar] = useState("👦");

  // 1️⃣ جلب قائمة الأطفال من السيرفر (API هند)
  const fetchChildren = async () => {
    try {
      const res = await fetch("ضع_رابط_هند_لجلب_قائمة_الأطفال_هنا");
      if (res.ok) {
        const data = await res.json();
        setChildren(data);
      }
    } catch (err) {
      console.error("خطأ في جلب قائمة الأطفال", err);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  // 2️⃣ إضافة طفل جديد وإرساله للسيرفر (API هند)
  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("ضع_رابط_هند_لإضافة_طفل_جديد_هنا", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: childName, age: Number(childAge), avatar: childAvatar }),
      });

      if (res.ok) {
        setIsAdding(false);
        setChildName("");
        setChildAge("");
        fetchChildren(); // تحديث القائمة فوراً
      }
    } catch (err) {
      console.error("خطأ في إضافة الطفل", err);
    }
  };

  // 3️⃣ تأكيد حذف الطفل من السيرفر (API هند)
  const confirmDelete = async () => {
    if (!selectedChildId) return;
    try {
      const res = await fetch(`ضع_رابط_هند_لحذف_الطفل_هنا/${selectedChildId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShowDeleteDialog(false);
        setSelectedChildId(null);
        fetchChildren(); // تحديث القائمة فوراً
      }
    } catch (err) {
      console.error("خطأ في حذف الطفل", err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 text-right" dir="rtl">
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-800">إدارة الأطفال 👧👦</h2>
          <p className="text-xs font-bold text-gray-400 mt-1">هنا يمكنك التحكم في حسابات أطفالك وتعديل بياناتهم.</p>
        </div>
        <Button variant="primary" className="!py-2 !px-6 text-xs font-black" onClick={() => setIsAdding(true)}>إضافة طفل جديد +</Button>
      </div>

      {/* قائمة الأطفال */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map((child) => (
          <div key={child.id} className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm">
            <div className="text-5xl bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">{child.avatar}</div>
            <h4 className="text-center text-lg font-black text-gray-800">{child.name}</h4>
            <p className="text-center text-xs text-gray-400 font-bold mt-1">العمر: {child.age} سنوات</p>
            <div className="flex gap-2 mt-6">
              <Button variant="sky" className="flex-1 !py-2 text-[11px] font-black text-gray-700">تعديل ✏️</Button>
              <Button variant="sky" className="!py-2 !px-4 text-[11px] font-black text-red-500 bg-red-50" onClick={() => { setSelectedChildId(child.id); setShowDeleteDialog(true); }}>حذف 🗑️</Button>
            </div>
          </div>
        ))}
      </div>

      {/* مودال إضافة طفل */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddChild} className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl">
            <h3 className="text-xl font-black text-center mb-6">إضافة مغامر جديد 🚀</h3>
            <div className="space-y-4">
              <Input type="text" placeholder="اسم الطفل" value={childName} onChange={(e) => setChildName(e.target.value)} required label="الاسم" />
              <Input type="number" placeholder="العمر" value={childAge} onChange={(e) => setChildAge(e.target.value)} required label="العمر" />
              <div>
                <label className="block text-xs font-black mb-2">اختر الأفاتار</label>
                <div className="flex gap-3 justify-center text-3xl bg-gray-50 p-3 rounded-2xl">
                  {["👦", "👧", "👶", "🧚‍♂️"].map((emoji) => (
                    <span key={emoji} className={`cursor-pointer transition ${childAvatar === emoji ? "scale-125 border-b-2 border-primary" : ""}`} onClick={() => setChildAvatar(emoji)}>{emoji}</span>
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

      {/* ديالوج تأكيد الحذف */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-6 max-w-xs w-full text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h4 className="text-lg font-black">هل أنت متأكد من الحذف؟</h4>
            <p className="text-xs text-gray-500 font-bold">سيتم حذف كافة بيانات الطفل نهائياً.</p>
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