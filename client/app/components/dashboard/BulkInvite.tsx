"use client";

import { useState } from "react";
import Button from "../ui/Button";

interface BulkInviteProps {
  schoolId: string;
  onSuccess: () => void;
}

export default function BulkInvite({ schoolId, onSuccess }: BulkInviteProps) {
  const [emailsText, setEmailsText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailsText.trim()) return;

    setIsLoading(true);
    setMessage("");

    // تحويل النص المدخل والمفصول بفاصلة أو سطر جديد إلى مصفوفة إيميلات نظيفة
    const emailsArray = emailsText
      .split(/[\n,]/)
      .map(email => email.trim())
      .filter(email => email.includes("@"));

    try {
      const token = localStorage.getItem("accessToken");
      // 3️⃣ رابط إضافة جماعية للطلاب (Bulk Invite API) قادم من الباك إيند
      const res = await fetch(`http://localhost:5000/api/schools/${schoolId}/invite`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ emails: emailsArray })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setMessage("🎉 تم إرسال الدعوات وإنشاء الحسابات بنجاح!");
        setEmailsText("");
        onSuccess();
      } else {
        setMessage(`❌ فشل: ${result.message}`);
      }
    } catch (err) {
      setMessage("❌ حدث خطأ غير متوقع أثناء الاتصال بالسيرفر.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm text-right" dir="rtl">
      <h4 className="text-base font-black text-gray-800">دعوة جماعية للطلاب (Bulk Invite) ✉️</h4>
      <p className="text-xs font-bold text-gray-400 mb-3">اكتب بريد أولياء الأمور مفصولاً بأسطر أو فواصل لإنشاء الحسابات فوراُ.</p>
      
      <form onSubmit={handleInviteSubmit} className="space-y-3">
        <textarea
          value={emailsText}
          onChange={(e) => setEmailsText(e.target.value)}
          placeholder="example1@mail.com&#10;example2@mail.com"
          rows={4}
          disabled={isLoading}
          className="w-full p-3 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-primary text-left"
          dir="ltr"
          required
        />
        {message && (
          <div className={`p-2.5 rounded-xl text-center text-xs font-black ${message.startsWith("❌") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {message}
          </div>
        )}
        <Button type="submit" variant="primary" className="w-full !py-2.5 text-xs font-black" disabled={isLoading}>
          {isLoading ? "جاري توليد الحسابات والدعوات... ⏳" : "إرسال الدعوات الجماعية 🚀"}
        </Button>
      </form>
    </div>
  );
}