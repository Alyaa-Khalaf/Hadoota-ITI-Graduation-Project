<<<<<<< HEAD
// "use client";
// import { useState } from "react";
// import Button from "../ui/Button";
// import Input from "../ui/Input";

// export default function ParentInfoForm() {
//   const [name, setName] = useState("ريهام أحمد");
//   const [email, setEmail] = useState("reham@gmail.com");
//   const [avatar, setAvatar] = useState("👩‍🦰");
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     await new Promise((res) => setTimeout(res, 1000));
//     setIsEditing(false);
//     setIsLoading(false);
//   };

//   return (
//     <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-right" dir="rtl">
//       <h3 className="text-lg font-black text-gray-800 mb-4">البيانات الأساسية</h3>

//       {!isEditing ? (
//         <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-2xl">
//           <div className="text-4xl bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm">
//             {avatar}
//           </div>
//           <div className="space-y-1">
//             <h4 className="font-black text-gray-800 text-sm">{name}</h4>
//             <p className="text-xs text-gray-500">{email}</p>
//           </div>
//           <Button 
//             type="button" 
//             variant="sky" 
//             className="mr-auto !py-1.5 !px-4 text-xs font-bold" 
//             onClick={() => setIsEditing(true)}
//           >
//             تعديل ✏️
//           </Button>
//         </div>
//       ) : (
//         <form onSubmit={handleSave} className="space-y-4">
//           <div>
//             <label className="block text-xs font-black text-gray-700 mb-1">الاسم بالكامل</label>
//             <Input type="text" value={name} onChange={(e) => setName(e.target.value)} label="" />
//           </div>
//           <div>
//             <label className="block text-xs font-black text-gray-700 mb-1">اختر أفاتار</label>
//             <select 
//               value={avatar} 
//               onChange={(e) => setAvatar(e.target.value)}
//               className="w-full p-2.5 border border-gray-200 rounded-xl text-xl bg-white"
//             >
//               <option value="👩">👩</option>
//               <option value="👨‍💼">👨‍💼</option>
//               <option value="🧕">🧕</option>
//               <option value="🧔">🧔</option>
//               <option value="👵">👵</option>
//               <option value="👴">👴</option>
//             </select>
//           </div>
//           <div className="flex gap-2 justify-end pt-2">
//             <Button type="submit" variant="primary" className="!py-2 !px-6 text-xs font-black">
//               {isLoading ? "جاري الحفظ..." : "حفظ التغييرات ✅"}
//             </Button>
//             <Button type="button" variant="sky" className="!py-2 !px-4 text-xs font-bold" onClick={() => setIsEditing(false)}>
//               إلغاء
//             </Button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }

=======
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
"use client";
import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ParentInfoForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("👩");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

<<<<<<< HEAD
  // 1️⃣ جلب بيانات البروفايل (GET) باستخدام accessToken
=======
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
  
  // 1️⃣ جلب بيانات البروفايل (GET) - نسخة مطورة لالتقاط التوكن تلقائياً
  useEffect(() => {
    const fetchParentData = async () => {
      try {
        // 1. محاولة جلب التوكن بالأسماء القياسية
        let token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        
        // 2. إذا لم يجده، يبحث في الـ localStorage عن أي حقل يحتوي على توكن الـ JWT (الذي يبدأ بـ ey)
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
        
        const res = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          },
        });

        const result = await res.json();
        console.log("رد السيرفر بالكامل داخل الفورم:", result);

        if (res.ok && result.success) {
          setName(result.data.name || "");
          setEmail(result.data.email || "");
<<<<<<< HEAD
          setAvatar(result.data.avatar || "👩");
=======
          const serverAvatar = result.data.avatar;
          if (!serverAvatar || serverAvatar === "default-avatar.png") {
            setAvatar("👩"); // الأفاتار الافتراضي للحسابات الجديدة
          } else {
            setAvatar(serverAvatar);
          }
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
          setError(""); // مسح الأخطاء عند النجاح
        } else {
          setError(result.message || "فشل في جلب بيانات الحساب.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء جلب البيانات من السيرفر.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchParentData();
  }, []);

  // 2️⃣ تحديث بيانات البروفايل (PUT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          email: email,
          avatar: avatar
        })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSuccessMessage("تم حفظ التغييرات بنجاح! ✅");
        setIsEditing(false);
      } else {
        setError(result.message || "فشل تحديث البيانات.");
      }
    } catch (err) {
      setError("حدث خطأ في السيرفر، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center py-12 font-bold text-gray-400" dir="rtl">
        جاري تحميل البيانات الأساسية... ⏳
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-right" dir="rtl">
      <h3 className="text-lg font-black text-gray-800 mb-4">البيانات الأساسية</h3>

      {error && <div className="p-3 mb-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">{error}</div>}
      {successMessage && <div className="p-3 mb-3 bg-green-50 text-green-600 text-xs font-bold rounded-xl text-center">{successMessage}</div>}

      {!isEditing ? (
        <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-2xl">
          <div className="text-4xl bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm">
            {avatar}
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-gray-800 text-sm">{name || "لم يتم تحديد اسم"}</h4>
            <p className="text-xs text-gray-500">{email || "لا يوجد بريد إلكتروني"}</p>
          </div>
          <Button 
            type="button" 
            variant="sky" 
            className="mr-auto !py-1.5 !px-4 text-xs font-bold" 
            onClick={() => setIsEditing(true)}
          >
            تعديل ✏️
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">الاسم بالكامل</label>
            <Input type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} label="" required disabled={isLoading} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">البريد الإلكتروني</label>
            <Input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} label="" required disabled={isLoading} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">اختر أفاتار</label>
            <select 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl text-xl bg-white focus:outline-none focus:border-primary"
              disabled={isLoading}
            >
              <option value="👩">👩</option>
              <option value="👨‍💼">👨‍💼</option>
              <option value="🧕">🧕</option>
              <option value="🧔">🧔</option>
              <option value="👵">👵</option>
              <option value="👴">👴</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="submit" variant="primary" className="!py-2 !px-6 text-xs font-black" disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات ✅"}
            </Button>
            <Button type="button" variant="sky" className="!py-2 !px-4 text-xs font-bold" onClick={() => setIsEditing(false)} disabled={isLoading}>
              إلغاء
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}