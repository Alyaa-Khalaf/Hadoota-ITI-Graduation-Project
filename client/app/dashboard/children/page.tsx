"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Child {
  id?: string;
  _id?: string
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
  const [childAge, setChildAge] = useState("3");
  const [childAvatar, setChildAvatar] = useState("👦");

  const fetchChildren = async () => {
    try {
      let token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/children", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const result = await res.json();
        // ضمان التقاط البيانات بالشكل الصحيح من السيرفر
        const fetchedList = result.data?.children || result.data || [];
        setChildren(fetchedList); 
      } else {
        console.error("السيرفر رفض جلب الأطفال كود:", res.status);
      }
    } catch (err) {
      console.error("خطأ في جلب قائمة الأطفال", err);
    }
  };


  // 2️⃣ إضافة طفل جديد وإرساله للسيرفر (نسخة مطورة لالتقاط التوكن)
  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !childAge) return;

    try {
      let token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      if (!token) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key);
            if (value && value.startsWith("eyJ")) {
              token = value;
              break;
            }
          }
        }
      }
      
      const determinedGender = childAvatar === "👧" ? "female" : "male";

      const res = await fetch("http://localhost:5000/api/children", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: childName, 
          age: Number(childAge), 
          avatar: childAvatar,
        }),
      });

      if (res.ok) {
        setIsAdding(false);
        setChildName("");
        setChildAge("3");
        setChildAvatar("👦");
        fetchChildren(); 
      } else {
        console.error("فشلت إضافة الطفل، كود الاستجابة:", res.status);
      }
    } catch (err) {
      console.error("خطأ في إضافة الطفل", err);
    }
  };


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
          prevChildren.filter((child) => String(child._id || child.id) !== cleanId)
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

      {/* عرض كروت الأطفال المجلوبة من السيرفر */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {children.length === 0 ? (
          <p className="text-sm font-bold text-gray-400 col-span-full text-center py-8">لا يوجد أطفال مضافين حالياً ✨</p>
        ) : (
          children.map((child, index) => {
            // التقاط المعرف المتاح بشكل مضمون وآمن لحل المشكلة الأساسية
            const childId = child._id || child.id || null;
            
            return (
              <div key={childId || `child-${index}`} className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{child.avatar}</span>
                  <div>
                    <h3 className="font-bold text-lg text-secondary">{child.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">العمر: {child.age} سنوات</p>
                  </div>
                </div>
                <Button 
                  variant="sky" 
                  className="!p-2 !bg-red-50 text-red-500 hover:!bg-red-100 border-none"
                  onClick={() => {
                    const currentId = child._id || child.id || null;
                    if (currentId) {
                      setSelectedChildId(currentId);
                      setShowDeleteDialog(true);
                    }
                  }}
                >
                  🗑️
                </Button>
              </div>
            );
          })
        )}
      </div>

      {/* مودال إضافة طفل جديد */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddChild} className="bg-white rounded-[30px] p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-black text-secondary text-center">إضافة طفل جديد ✨</h3>
            
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-700">اسم الطفل</label>
                <Input 
                  type="text"
                  placeholder="أدخل اسم الطفل هنا..."
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  required
                  label=""
                /> 

              <label className="block text-sm font-bold text-gray-700">عمر الطفل</label>
              <select
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary font-bold bg-gray-50 text-secondary"
                required
              >
                <option value="" disabled>اختر عمر الطفل</option>
                {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} سنوات
                  </option>
                ))}
              </select>

              <label className="block text-sm font-bold text-gray-700 text-center pt-2">اختر الأفاتار</label>
              <div className="flex justify-center gap-4 text-3xl p-2 bg-gray-50 rounded-xl">
                {["👦", "👧", "👶", "🧚‍♂️"].map((emoji) => (
                  <span 
                    key={emoji} 
                    className={`cursor-pointer p-1 rounded-lg transition ${childAvatar === emoji ? "scale-125 bg-white shadow-sm ring-2 ring-primary" : "opacity-60"}`} 
                    onClick={() => setChildAvatar(emoji)}
                  >
                    {emoji}
                  </span>
                ))}
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
              <Button variant="sky" className="flex-1 !py-2 font-bold" onClick={() => { setShowDeleteDialog(false); setSelectedChildId(null); }}>إلغاء</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}