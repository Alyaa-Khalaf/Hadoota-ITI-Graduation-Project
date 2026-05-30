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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("❌ كلمتا المرور غير متطابقتين");
      return;
    }

    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    
    setMessage("🔒 تم تغيير كلمة المرور بنجاح");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsLoading(false);
  };

  return (
    <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-right space-y-4" dir="rtl">
      <h3 className="text-lg font-black text-gray-800">تغيير كلمة المرور</h3>

      {message && (
        <div className="p-3 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl text-center">
          {message}
        </div>
      )}

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

      <Button type="submit" variant="primary" fullWidth={true} className="!py-2.5 text-xs font-black">
        {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور 🔒"}
      </Button>
    </form>
  );
}