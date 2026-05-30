"use client";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProfilePage() {
  // بيانات ولي الأمر
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("👩‍🦰");
  
  // حالات الفورم والتحميل
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // حالات الباسورد
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // 1️⃣ جلب بيانات ولي الأمر أول ما الصفحة تفتح (API نورهان)
  useEffect(() => {
    async function fetchParentData() {
      try {
        const res = await fetch("ضع_رابط_نورهان_لجلب_بيانات_ولي_الأمر_هنا");
        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setEmail(data.email);
          setAvatar(data.avatar || "👩‍🦰");
        }
      } catch (err) {
        console.error("خطأ في جلب البيانات", err);
      }
    }
    fetchParentData();
  }, []);

  // 2️⃣ حفظ تعديل الاسم والأفاتار (API نورهان)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProfileMessage("");

    try {
      const res = await fetch("ضع_رابط_نورهان_لتعديل_البيانات_هنا", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar }),
      });

      if (res.ok) {
        setProfileMessage("✅ تم تحديث البيانات بنجاح");
        setIsEditing(false);
      } else {
        setProfileMessage("❌ فشل تحديث البيانات");
      }
    } catch (err) {
      setProfileMessage("❌ حدث خطأ في السيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  // 3️⃣ تغيير الباسورد (API نورهان)
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordMessage("❌ كلمتا المرور غير متطابقتين");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("ضع_رابط_نورهان_لتغيير_الباسورد_هنا", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (res.ok) {
        setPasswordMessage("🔒 تم تغيير كلمة المرور بنجاح");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage("❌ كلمة المرور الحالية غير صحيحة");
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
        {/* كارت البيانات الأساسية */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-800 mb-4">البيانات الأساسية</h3>
          {profileMessage && <div className="p-3 mb-3 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl text-center">{profileMessage}</div>}

          {!isEditing ? (
            <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-2xl">
              <div className="text-4xl bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm">{avatar}</div>
              <div className="space-y-1">
                <h4 className="font-black text-gray-800 text-sm">{name || "جاري التحميل..."}</h4>
                <p className="text-xs text-gray-500">{email}</p>
              </div>
              <Button type="button" variant="sky" className="mr-auto !py-1.5 !px-4 text-xs font-bold" onClick={() => setIsEditing(true)}>تعديل ✏️</Button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">الاسم بالكامل</label>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} label="" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1">اختر أفاتار</label>
                <select value={avatar} onChange={(e) => setAvatar(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl text-xl bg-white">
                  <option value="👩‍🦰">👩‍🦰</option>
                  <option value="👨‍🦱">👨‍🦱</option>
                  <option value="🧕">🧕</option>
                  <option value="🧔">🧔</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="submit" variant="primary" className="!py-2 !px-6 text-xs font-black">{isLoading ? "جاري الحفظ..." : "حفظ التغييرات ✅"}</Button>
                <Button type="button" variant="sky" className="!py-2 !px-4 text-xs font-bold" onClick={() => setIsEditing(false)}>إلغاء</Button>
              </div>
            </form>
          )}
        </div>

        {/* كارت تغيير الباسورد */}
        <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-gray-800">تغيير كلمة المرور</h3>
          {passwordMessage && <div className="p-3 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl text-center">{passwordMessage}</div>}
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">كلمة المرور الحالية</label>
            <Input type="password" placeholder="••••••••" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} label="" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">كلمة المرور الجديدة</label>
            <Input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} label="" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">تأكيد كلمة المرور الجديدة</label>
            <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} label="" />
          </div>
          <Button type="submit" variant="primary" fullWidth={true} className="!py-2.5 text-xs font-black">{isLoading ? "جاري التحديث..." : "تحديث كلمة المرور 🔒"}</Button>
        </form>
      </div>
    </div>
  );
}