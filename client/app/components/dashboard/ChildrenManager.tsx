"use client";
<<<<<<< HEAD
=======

>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

<<<<<<< HEAD
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
=======

interface Child {
  _id: string;
  parentId?: string;
  schoolId?: string | null;
  classId?: string | null;

  name: string;
  age: number;
  gender: "male" | "female";

  avatar: string;
  interests: string[];

  learningLevel: "beginner" | "intermediate" | "advanced";

  settings?: {
    allowedTopics: string[];
    screenTimeLimit: number;
    difficultyLevel: string;
  };

  screenTime?: {
    today: number;
    lastReset: string;
  };

  createdAt?: string;
  updatedAt?: string;
}

/* تعليق: قالب الاستقبال القياسي للـ API المعمول به */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

export default function ChildrenManager() {
  /* تعليق: الـ States الخاصة بالتحكم في مصفوفة وعمليات الحذف والتعديل */
  const [children, setChildren] = useState<Child[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

<<<<<<< HEAD
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
=======
  /* تعليق: الحالات والـ الـ States لحفظ القيم المدخلة في فورم الإضافة الحية */
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const [newChildGender, setNewChildGender] = useState<"male" | "female">("male");
  const [newLearningLevel, setNewLearningLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [newInterests, setNewInterests] = useState<string[]>([]);


  /* تعليق: قائمة الاهتمامات باللغة العربية المسموح بها والمطابقة للـ Enum */
  const availableInterests = ["فضاء", "حيوانات", "مغامرات", "تاريخ", "علوم", "دين", "طبيعة", "رياضة"];

  // ========================================================
  // 1️⃣ جلب قائمة الأطفال عند فتح الصفحة (GET Request)
  // ========================================================
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
        const res = await fetch("http://localhost:5000/api/children", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
<<<<<<< HEAD
          },
        });

        const result = await res.json();

        if (res.ok && result.success) {
          // نورهان ترجع البيانات داخل result.data
          setChildren(result.data || []);
        } else {
=======
            "Content-Type": "application/json"
          },
        });

        const result: ApiResponse<Child[]> = await res.json();

        if ( res.ok && result.success && Array.isArray(result.data) ) {
          setChildren(result.data);
        }
        else {
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
          setError(result.message || "فشل في تحميل قائمة الأطفال.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء الاتصال بالسيرفر لجلب الأطفال.");
      } finally {
        setIsFetching(false);
      }
    };

<<<<<<< HEAD
    fetchChildren();
  }, []);

  // 2️⃣ إضافة طفل جديد وإرساله للسيرفر (POST)
  const handleAddChildSubmit = async (e: React.FormEvent) => {
=======
  

    fetchChildren();
  }, []);


  // ========================================================
  // 🎛️ دالة مساعدة لإدارة مصفوفة الاهتمامات المختارة ديناميكياً
  // ========================================================
  const handleInterestCheckbox = (interest: string) => {
    if (newInterests.includes(interest)) {
      setNewInterests(prev => prev.filter(i => i !== interest));
    } else {
      setNewInterests(prev => [...prev, interest]);
    }
  };

  // ========================================================
  // 2️⃣ إضافة طفل جديد وإرساله للسيرفر (POST Request)
  // ========================================================
  const handleAddChildSubmit = async (e: React.FormEvent) => {
    alert("submit fired");
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
    e.preventDefault();
    if (!newChildName || !newChildAge) return;

    setIsLoading(true);
    setError("");

    try {
<<<<<<< HEAD
      const token = localStorage.getItem("token");
=======
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      /* تعليق: تجهيز البيانات وإعداد المتغيرات لإرسالها بالشكل الهندسي الصحيح */
      const requestPayload = {
        name: newChildName,
        age: Number(newChildAge),
        gender: newChildGender,
        interests: newInterests,
        learningLevel: newLearningLevel,
      };

      console.log("Sending:", requestPayload);
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
      const res = await fetch("http://localhost:5000/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
<<<<<<< HEAD
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
=======
        body: JSON.stringify(requestPayload),
      });

      const result: ApiResponse<Child> = await res.json();

      if (res.ok && result.success) {
        console.log(result.data);
        /* ملاحظة ذهبية: الباك إيند يرجع كائن مستقل، مدمج بالـ State لتجنب الريفرش */
        if (result.data) {
          setChildren(prev => [...prev, result.data]);
        }
        
        // تصفير الخانات
        setNewChildName("");
        setNewChildAge("");
        setNewChildGender("male");
        setNewLearningLevel("beginner");
        setNewInterests([]);
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
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

<<<<<<< HEAD
  // 3️⃣ تأكيد حذف الطفل من السيرفر وقاعدة البيانات
  const confirmDelete = async () => {
    if (!selectedChildId) return;
    setError("");

    try {
      const token = localStorage.getItem("token");
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
        setChildren(children.filter((child) => (child._id || child.id) !== selectedChildId));
        setShowDeleteDialog(false);
        setSelectedChildId(null);
      }
    } catch (err) {
      setChildren(children.filter((child) => (child._id || child.id) !== selectedChildId));
      setShowDeleteDialog(false);
      setSelectedChildId(null);
    }
  };

  if (isFetching) {
    return <div className="text-center py-12 font-bold text-gray-500" dir="rtl">جاري تحميل ملفات الأبطال الصغار... ⏳</div>;
  }

=======
  // ========================================================
  // 3️⃣ تأكيد وتنفيذ عملية الحذف من السيرفر وقاعدة البيانات
  // ========================================================
  const confirmDelete = async () => {
    if (!selectedChildId) return;

    try {
      let token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const cleanId = String(selectedChildId).trim();
      
      const res = await fetch(`http://localhost:5000/api/children/${cleanId}`, {
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
      console.error("خطأ في دالة حذف الطفل بالفرونت:", err);
    }
  };

>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
  return (
    <div className="space-y-6 text-right" dir="rtl">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">
          {error}
        </div>
      )}

<<<<<<< HEAD
      {/* رأس الصفحة وزرار الإضافة */}
=======
      {/* شريط التحكم وزر فتح المودال لإضافة مغامر جديد */}
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-gray-800">أطفالي الصغار 👶</h3>
          <p className="text-xs font-bold text-gray-400">أضف وادر ملفات أطفالك لتخصيص تجربتهم.</p>
        </div>
<<<<<<< HEAD
        <Button variant="primary" className="!py-2 !px-6 text-xs font-black" onClick={() => setIsAdding(true)}>
=======
        <Button
          variant="primary"
          onClick={() => setIsAdding(true)}
        >
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
          إضافة طفل جديد +
        </Button>
      </div>

<<<<<<< HEAD
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

      {/* مودال إضافة طفل */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-fadeIn">
=======
      {/* معالجة وبناء الكروت الحقيقية للمستخدمين الصغار */}
      {isFetching ? (
        <div className="text-center py-8 text-xs font-bold text-gray-400 animate-pulse">جاري جلب ملفات الأطفال الحية...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.length === 0 ? (
            <div className="col-span-full text-center py-8 text-sm font-bold text-gray-400 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              لا يوجد أطفال مضافون حالياً. ابدأ بإضافة طفلك الأول! 🚀
            </div>
          ) : (
            children.map((child) => {
              const childId = child._id;
              return (
                <div key={childId} className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="text-5xl bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    {/* {child.gender === "male" ? "👦" : "👧"} */}
                    <div>
  {child.gender}
</div>
                  </div>
                  <h4 className="text-center text-lg font-black text-gray-800">{child.name}</h4>
                  <div className="flex justify-center gap-2 mt-2">
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">العمر: {child.age} سنوات</span>
                    <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-bold">{child.learningLevel}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center mt-3">
                    {child.interests && child.interests.map((interest, i) => (
                      <span key={i} className="bg-gray-50 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-md border">
                        {interest}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-5">
                    <Button
                      variant="danger"
                      className="flex-1 !py-2 !px-4 text-[11px] font-black"
                      onClick={() => {
                        setSelectedChildId(childId);
                        setShowDeleteDialog(true);
                      }}
                    >
                      حذف 🗑️
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* نافذة تعبئة وإدخال البيانات لإرسالها بالـ POST */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-right">
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
            <h3 className="text-xl font-black text-center mb-6">إضافة مغامر جديد 🚀</h3>
            <form onSubmit={handleAddChildSubmit} className="space-y-4">
              <Input type="text" placeholder="اسم الطفل" label="الاسم" value={newChildName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChildName(e.target.value)} required disabled={isLoading} />
              
<<<<<<< HEAD
              {/* جزء العمر الذي طلبتيه تماماً مدمج بالـ state الصحيحة للملف */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">عمر الطفل (سنوات)</label>
                <select
                  required
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  disabled={isLoading}
                  className="w-full p-3.5 rounded-xl border border-border-warm bg-white text-ink font-bold text-sm focus:outline-none focus:border-primary transition"
                >
                  <option value="" disabled hidden>اختر العمر</option>
                  {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} سنوات
                    </option>
                  ))}
=======
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">العمر (سنوات)</label>
                  <select
                    required
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:outline-none"
                  >
                    <option value="" disabled hidden>اختر العمر</option>
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <option key={num} value={num}>{num} سنوات</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">الجنس</label>
                  <select
                    required
                    value={newChildGender}
                    onChange={(e) => setNewChildGender(e.target.value as any)}
                    disabled={isLoading}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:outline-none"
                  >
                    <option value="male">ذكر (👦)</option>
                    <option value="female">أنثى (👧)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">مستوى التعلم</label>
                <select
                  required
                  value={newLearningLevel}
                  onChange={(e) => setNewLearningLevel(e.target.value as any)}
                  disabled={isLoading}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:outline-none"
                >
                  <option value="beginner">مبتدئ (Beginner)</option>
                  <option value="intermediate">متوسط (Intermediate)</option>
                  <option value="advanced">متقدم (Advanced)</option>
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
                </select>
              </div>

              <div>
<<<<<<< HEAD
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
=======
                <label className="block text-xs font-black mb-2">اهتمامات وشغف الطفل:</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                  {availableInterests.map((interest) => (
                    <label key={interest} className="flex items-center gap-2 font-bold text-gray-600 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={newInterests.includes(interest)}
                        onChange={() => handleInterestCheckbox(interest)}
                        className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                        disabled={isLoading}
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
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

<<<<<<< HEAD
      {/* ديالوج الحذف (Confirmation Dialog) */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-6 max-w-xs w-full text-center space-y-4 animate-bounceIn">
=======
      {/* ديالوج تأكيد عملية الحذف */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-6 max-w-xs w-full text-center space-y-4">
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
            <div className="text-4xl">⚠️</div>
            <h4 className="text-lg font-black">هل أنت متأكد من الحذف؟</h4>
            <p className="text-xs text-gray-500 font-bold">سيتم حذف كافة بيانات الطفل ولا يمكن استعادتها.</p>
            <div className="flex gap-2">
<<<<<<< HEAD
              <Button variant="primary" className="flex-1 !bg-red-500 !py-2 font-black" onClick={confirmDelete}>نعم، احذف</Button>
=======
              <Button variant="danger" className="flex-1 !py-2 font-black" onClick={confirmDelete}>  نعم، احذف </Button>
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
              <Button variant="sky" className="flex-1 !py-2 font-black" onClick={() => setShowDeleteDialog(false)}>تراجع</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}