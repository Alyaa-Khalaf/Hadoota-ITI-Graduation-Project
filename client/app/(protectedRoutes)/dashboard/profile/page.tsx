"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ParentInfoForm from "@/components/dashboard/ParentInfoForm"; 

export default function ProfilePage() {
  // حالات التحميل والباسورد
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("❌ يرجى ملء جميع حقول كلمة المرور");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("❌ كلمتا المرور غير متطابقتين");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setPasswordMessage("🔒 تم تغيير كلمة المرور بنجاح");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage(result.message || "❌ كلمة المرور الحالية غير صحيحة");
      }
    } catch (err) {
      setPasswordMessage("❌ حدث خطأ في السيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6 text-right" dir="rtl">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-black text-gray-800">إعدادات الحساب 👤</h2>
        <p className="text-xs font-bold text-gray-400 mt-1">تعديل بيانات ملفك الشخصي وكلمة المرور.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* كارت البيانات الأساسية الذكي (يستدعى من المكون المنفصل مباشرة) */}
        <div className="md:col-span-2">
          <ParentInfoForm />
        </div>

        {/* كارت تغيير الباسورد */}
        <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <h3 className="text-lg font-black text-gray-800">تغيير كلمة المرور</h3>
          {passwordMessage && <div className="p-3 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl text-center">{passwordMessage}</div>}
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">كلمة المرور الحالية</label>
            <Input type="password" placeholder="••••••••" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} label="" required disabled={isLoading} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">كلمة المرور الجديدة</label>
            <Input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} label="" required disabled={isLoading} />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">تأكيد كلمة المرور الجديدة</label>
            <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} label="" required disabled={isLoading} />
          </div>
          <Button type="submit" variant="primary" fullWidth={true} className="!py-2.5 text-xs font-black" disabled={isLoading}>{isLoading ? "جاري التحديث..." : "تحديث كلمة المرور 🔒"}</Button>
        </form>
      </div>
    </div>
  );
}