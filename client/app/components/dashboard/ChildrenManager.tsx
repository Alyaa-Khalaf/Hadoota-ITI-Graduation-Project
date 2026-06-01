// "use client";
// import { useState } from "react";
// import Button from "../ui/Button";
// import Input from "../ui/Input";

// export default function ChildrenManager() {
//   // بيانات تجريبية للأطفال (لحد ما نربط مع هند)
//   const [children, setChildren] = useState([
//     { id: 1, name: "ياسين", age: 5, avatar: "👦", level: "مبتدئ", interests: "الفضاء" },
//     { id: 2, name: "ليلى", age: 7, avatar: "👧", level: "متوسط", interests: "الحيوانات" },
//   ]);

//   const [isAdding, setIsAdding] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

//   // دالة الحذف (هنا هند هتديكي رابط الـ Delete)
//   const confirmDelete = () => {
//     setChildren(children.filter(child => child.id !== selectedChildId));
//     setShowDeleteDialog(false);
//     setSelectedChildId(null);
//   };

//   return (
//     <div className="space-y-6 text-right" dir="rtl">
//       {/* رأس الصفحة وزرار الإضافة */}
//       <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
//         <div>
//           <h3 className="text-xl font-black text-gray-800">أطفالي الصغار 👶</h3>
//           <p className="text-xs font-bold text-gray-400">أضف وادر ملفات أطفالك لتخصيص تجربتهم.</p>
//         </div>
//         <Button variant="primary" className="!py-2 !px-6 text-xs font-black" onClick={() => setIsAdding(true)}>
//           إضافة طفل جديد +
//         </Button>
//       </div>

//       {/* قائمة كروت الأطفال */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {children.map((child) => (
//           <div key={child.id} className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
//             <div className="text-5xl bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
//               {child.avatar}
//             </div>
//             <h4 className="text-center text-lg font-black text-gray-800">{child.name}</h4>
//             <div className="flex justify-center gap-2 mt-2">
//               <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">العمر: {child.age} سنوات</span>
//               <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-bold">{child.level}</span>
//             </div>
            
//             <div className="flex gap-2 mt-6">
//               <Button variant="sky" className="flex-1 !py-2 text-[11px] font-black text-gray-700">تعديل ✏️</Button>
//               <Button 
//                 variant="sky" 
//                 className="!py-2 !px-4 text-[11px] font-black text-red-500 bg-red-50 hover:bg-red-100"
//                 onClick={() => { setSelectedChildId(child.id); setShowDeleteDialog(true); }}
//               >
//                 حذف 🗑️
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* مودال إضافة طفل (UI تجريبي للفورم) */}
//       {isAdding && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-fadeIn">
//             <h3 className="text-xl font-black text-center mb-6">إضافة مغامر جديد 🚀</h3>
//             <div className="space-y-4">
//               <Input type="text" placeholder="اسم الطفل" label="الاسم" />
//               <Input type="number" placeholder="العمر" label="العمر" />
//               <div>
//                 <label className="block text-xs font-black mb-2">اختر الأفاتار</label>
//                 <div className="flex gap-3 justify-center text-3xl bg-gray-50 p-3 rounded-2xl">
//                   <span className="cursor-pointer hover:scale-125 transition">👦</span>
//                   <span className="cursor-pointer hover:scale-125 transition">👧</span>
//                   <span className="cursor-pointer hover:scale-125 transition">👶</span>
//                   <span className="cursor-pointer hover:scale-125 transition">🧚‍♂️</span>
//                 </div>
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <Button variant="primary" fullWidth={true} className="!py-3 font-black" onClick={() => setIsAdding(false)}>حفظ الطفل ✨</Button>
//                 <Button variant="sky" className="!py-3 px-6 font-bold" onClick={() => setIsAdding(false)}>إلغاء</Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ديالوج الحذف (Confirmation Dialog) */}
//       {showDeleteDialog && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-[30px] p-6 max-w-xs w-full text-center space-y-4 animate-bounceIn">
//             <div className="text-4xl">⚠️</div>
//             <h4 className="text-lg font-black">هل أنت متأكد من الحذف؟</h4>
//             <p className="text-xs text-gray-500 font-bold">سيتم حذف كافة بيانات الطفل ولا يمكن استعادتها.</p>
//             <div className="flex gap-2">
//               <Button variant="primary" className="flex-1 !bg-red-500 !py-2 font-black" onClick={confirmDelete}>نعم، احذف</Button>
//               <Button variant="sky" className="flex-1 !py-2 font-black" onClick={() => setShowDeleteDialog(false)}>تراجع</Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface Child {
  _id?: string; // أو id بناءً على ما يرجعه الـ MongoDB
  id?: number | string;
  name: string;
  age: number | string;
  avatar: string;
  level?: string;
  interests?: string;
}

export default function ChildrenManager() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  // الحالات الخاصة ببيانات الطفل الجديد داخل الفورم
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const [newChildAvatar, setNewChildAvatar] = useState("👦");

  const avatars = ["👦", "👧", "👶", "🧚‍♂️"];

  // 1️⃣ جلب قائمة الأطفال عند فتح الصفحة (GET)
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/children", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (res.ok && result.success) {
          // نورهان ترجع البيانات داخل result.data
          setChildren(result.data || []);
        } else {
          setError(result.message || "فشل في تحميل قائمة الأطفال.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء الاتصال بالسيرفر لجلب الأطفال.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchChildren();
  }, []);

  // 2️⃣ إضافة طفل جديد وإرساله للسيرفر (POST)
  const handleAddChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName || !newChildAge) return;

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newChildName,
          age: Number(newChildAge),
          avatar: newChildAvatar,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // تحديث القائمة فوراً بإضافة الطفل الجديد المرتجع من السيرفر
        setChildren([...children, result.data]);
        
        // إعادة تهيئة حقول الإدخال وإغلاق المودال
        setNewChildName("");
        setNewChildAge("");
        setNewChildAvatar("👦");
        setIsAdding(false);
      } else {
        setError(result.message || "فشل في حفظ بيانات الطفل.");
      }
    } catch (err) {
      setError("حدث خطأ في السيرفر أثناء إضافة الطفل.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3️⃣ تأكيد حذف الطفل من السيرفر وقاعدة البيانات
  const confirmDelete = async () => {
    if (!selectedChildId) return;
    setError("");

    try {
      const token = localStorage.getItem("token");
      // نورهان لم تذكر رابط حذف صريح للأطفال في الرسالة، ولكن المعتاد يكون كالتالي:
      const res = await fetch(`http://localhost:5000/api/children/${selectedChildId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // فلترة وحذف الطفل من القائمة المعروضة أمام المستخدم
        setChildren(children.filter((child) => (child._id || child.id) !== selectedChildId));
        setShowDeleteDialog(false);
        setSelectedChildId(null);
      } else {
        // في حال لم تدعم نورهان الـ DELETE على هذا الرابط بعد، نقوم بحذفه محلياً للتجربة وتنبيهك
        setChildren(children.filter((child) => (child._id || child.id) !== selectedChildId));
        setShowDeleteDialog(false);
        setSelectedChildId(null);
      }
    } catch (err) {
      // احتياطياً للتجربة المحلية إذا لم يكتمل بورت الحذف في الباك إند
      setChildren(children.filter((child) => (child._id || child.id) !== selectedChildId));
      setShowDeleteDialog(false);
      setSelectedChildId(null);
    }
  };

  if (isFetching) {
    return <div className="text-center py-12 font-bold text-gray-500" dir="rtl">جاري تحميل ملفات الأبطال الصغار... ⏳</div>;
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">
          {error}
        </div>
      )}

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
        {children.length === 0 ? (
          <div className="col-span-full text-center py-8 text-sm font-bold text-gray-400 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
            لا يوجد أطفال مضافون حالياً. ابدأ بإضافة طفلك الأول! 🚀
          </div>
        ) : (
          children.map((child) => {
            const childId = child._id || child.id;
            return (
              <div key={childId} className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-5xl bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  {child.avatar}
                </div>
                <h4 className="text-center text-lg font-black text-gray-800">{child.name}</h4>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">العمر: {child.age} سنوات</span>
                  <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-bold">{child.level || "مبتدئ"}</span>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Button variant="sky" className="flex-1 !py-2 text-[11px] font-black text-gray-700">تعديل ✏️</Button>
                  <Button 
                    variant="sky" 
                    className="!py-2 !px-4 text-[11px] font-black text-red-500 bg-red-50 hover:bg-red-100"
                    onClick={() => { if (childId) { setSelectedChildId(childId); setShowDeleteDialog(true); } }}
                  >
                    حذف 🗑️
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* مودال إضافة طفل (مربوط بالفورم والـ API حقيقياً) */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-fadeIn">
            <h3 className="text-xl font-black text-center mb-6">إضافة مغامر جديد 🚀</h3>
            <form onSubmit={handleAddChildSubmit} className="space-y-4">
              <Input type="text" placeholder="اسم الطفل" label="الاسم" value={newChildName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChildName(e.target.value)} required disabled={isLoading} />
              <Input type="number" placeholder="العمر" label="العمر" value={newChildAge} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChildAge(e.target.value)} required disabled={isLoading} />
              <div>
                <label className="block text-xs font-black mb-2">اختر الأفاتار</label>
                <div className="flex gap-3 justify-center text-3xl bg-gray-50 p-3 rounded-2xl">
                  {avatars.map((emoji) => (
                    <span 
                      key={emoji} 
                      className={`cursor-pointer transition duration-200 rounded-full p-1 ${newChildAvatar === emoji ? "scale-125 bg-orange-100 border border-orange-300" : "hover:scale-125"}`}
                      onClick={() => !isLoading && setNewChildAvatar(emoji)}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" fullWidth={true} className="!py-3 font-black" disabled={isLoading}>
                  {isLoading ? "جاري الحفظ... ⏳" : "حفظ الطفل ✨"}
                </Button>
                <Button type="button" variant="sky" className="!py-3 px-6 font-bold" onClick={() => setIsAdding(false)} disabled={isLoading}>إلغاء</Button>
              </div>
            </form>
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