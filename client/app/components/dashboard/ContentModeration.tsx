"use client";

import { useState } from "react";
import Button from "../ui/Button";

interface FlaggedStory {
  _id: string;
  title: string;
  reportedBy: string;
  reason: string;
}

interface ContentModerationProps {
  initialStories: FlaggedStory[];
}

export default function ContentModeration({ initialStories }: ContentModerationProps) {
  const [stories, setStories] = useState<FlaggedStory[]>(initialStories);

  const handleAction = async (id: string, action: "approve" | "delete") => {
    try {
      const token = localStorage.getItem("accessToken");
      // الرابط الافتراضي لإدارة المحتوى المشكوك فيه
      const res = await fetch(`http://localhost:5000/api/admin/moderation/${id}`, {
        method: action === "delete" ? "DELETE" : "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        setStories(prev => prev.filter(story => story._id !== id));
      }
    } catch (err) {
      console.error("خطأ في معالجة البلاغ:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm text-right" dir="rtl">
      <h4 className="text-lg font-black text-gray-800 mb-4">قصص وحكايات تحت المراجعة 🚨</h4>
      {stories.length === 0 ? (
        <p className="text-xs font-bold text-gray-400 text-center py-4">المحتوى نظيف تماماً ولا توجد بلاغات حالياً! ✨</p>
      ) : (
        <div className="space-y-3">
          {stories.map(story => (
            <div key={story._id} className="p-4 bg-gray-50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border">
              <div>
                <h6 className="text-sm font-black text-gray-800">{story.title}</h6>
                <p className="text-xs font-bold text-red-500 mt-0.5">السبب: {story.reason}</p>
                <p className="text-[10px] text-gray-400 font-medium">المُبلغ: {story.reportedBy}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button className="flex-1 sm:flex-initial !py-1.5 !px-4 text-xs font-black !text-emerald-600 !bg-emerald-50 hover:!bg-emerald-100 border border-emerald-200" onClick={() => handleAction(story._id, "approve")}>إبقاء ✅</Button>
                <Button className="flex-1 sm:flex-initial !py-1.5 !px-4 text-xs font-black !text-red-600 !bg-red-50 hover:!bg-red-100 border border-red-200" onClick={() => handleAction(story._id, "delete")}>حذف 🗑️</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}