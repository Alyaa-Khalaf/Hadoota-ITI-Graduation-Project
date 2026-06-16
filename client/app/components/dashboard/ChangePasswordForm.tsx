<<<<<<< HEAD
// "use client";
// import { useState } from "react";
// import Button from "../ui/Button";
// import Input from "../ui/Input";

// export default function ChangePasswordForm() {
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handlePasswordSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage("");

//     if (newPassword !== confirmPassword) {
//       setMessage("❌ كلمتا المرور غير متطابقتين");
//       return;
//     }

//     setIsLoading(true);
//     await new Promise((res) => setTimeout(res, 1000));
    
//     setMessage("🔒 تم تغيير كلمة المرور بنجاح");
//     setOldPassword("");
//     setNewPassword("");
//     setConfirmPassword("");
//     setIsLoading(false);
//   };

//   return (
//     <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-right space-y-4" dir="rtl">
//       <h3 className="text-lg font-black text-gray-800">تغيير كلمة المرور</h3>

//       {message && (
//         <div className="p-3 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl text-center">
//           {message}
//         </div>
//       )}

//       <div>
//         <label className="block text-xs font-black text-gray-700 mb-1">كلمة المرور الحالية</label>
//         <Input type="password" placeholder="••••••••" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} label="" />
//       </div>

//       <div>
//         <label className="block text-xs font-black text-gray-700 mb-1">كلمة المرور الجديدة</label>
//         <Input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} label="" />
//       </div>

//       <div>
//         <label className="block text-xs font-black text-gray-700 mb-1">تأكيد كلمة المرور الجديدة</label>
//         <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} label="" />
//       </div>

//       <Button type="submit" variant="primary" fullWidth={true} className="!py-2.5 text-xs font-black">
//         {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور 🔒"}
//       </Button>
//     </form>
//   );
// }


=======
>>>>>>> 5331b85d6eda8fe92ab4e1780e50b8b369c4bfa6
"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("❌ كلمتا المرور غير متطابقتين");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword: newPassword
        })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setIsError(false);
        setMessage("🔒 تم تغيير كلمة المرور بنجاح");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setIsError(true);
        setMessage(result.message || "❌ فشل تغيير كلمة المرور، تأكد من كلمة المرور الحالية.");
      }
    } catch (err) {
      setIsError(true);
      setMessage("❌ حدث خطأ في السيرفر، يرجى المحاولة مرة أخرى لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-right space-y-4" dir="rtl">
      <h3 className="text-lg font-black text-gray-800">تغيير كلمة المرور</h3>

      {message && (
        <div className={`p-3 text-xs font-bold rounded-xl text-center ${isError ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
          {message}
        </div>
      )}

      <div>
        <label className="block text-xs font-black text-gray-700 mb-1">كلمة المرور الحالية</label>
        <Input type="password" placeholder="••••••••" value={oldPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)} label="" required disabled={isLoading} />
      </div>

      <div>
        <label className="block text-xs font-black text-gray-700 mb-1">كلمة المرور الجديدة</label>
        <Input type="password" placeholder="••••••••" value={newPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} label="" required disabled={isLoading} />
      </div>

      <div>
        <label className="block text-xs font-black text-gray-700 mb-1">تأكيد كلمة المرور الجديدة</label>
        <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} label="" required disabled={isLoading} />
      </div>

      <Button type="submit" variant="primary" fullWidth={true} className="!py-2.5 text-xs font-black" disabled={isLoading}>
        {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور 🔒"}
      </Button>
    </form>
  );
}