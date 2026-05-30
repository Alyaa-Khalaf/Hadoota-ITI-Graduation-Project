"use client";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ParentInfoForm() {
  const [name, setName] = useState("ريهام أحمد");
  const [email, setEmail] = useState("reham@gmail.com");
  const [avatar, setAvatar] = useState("👩‍🦰");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setIsEditing(false);
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-right" dir="rtl">
      <h3 className="text-lg font-black text-gray-800 mb-4">البيانات الأساسية</h3>

      {!isEditing ? (
        <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-2xl">
          <div className="text-4xl bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm">
            {avatar}
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-gray-800 text-sm">{name}</h4>
            <p className="text-xs text-gray-500">{email}</p>
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
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} label="" />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-700 mb-1">اختر أفاتار</label>
            <select 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl text-xl bg-white"
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
            <Button type="submit" variant="primary" className="!py-2 !px-6 text-xs font-black">
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات ✅"}
            </Button>
            <Button type="button" variant="sky" className="!py-2 !px-4 text-xs font-bold" onClick={() => setIsEditing(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}