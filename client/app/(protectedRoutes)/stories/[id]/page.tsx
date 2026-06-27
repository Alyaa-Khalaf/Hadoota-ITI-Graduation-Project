"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function StoryPage() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التأكد من وجود الـ id قبل محاولة الجلب
    if (!id || !accessToken) return;

    const fetchStory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (data.success) {
          setStory(data.data);
        }
      } catch (err) {
        console.error("Error fetching story:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id, accessToken]);

  if (loading) return <div className="text-center py-10">جاري تحميل القصة... 📖</div>;
  if (!story) return <div className="text-center py-10">عذراً، لم يتم العثور على القصة.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* عنوان القصة */}
      <h1 className="text-4xl font-bold text-primary text-center">{story.title}</h1>
      
      {/* الموضوع */}
      <p className="text-lg text-gray-600 text-center italic">{story.topic}</p>
      
      <hr />

      {/* محتوى القصة (هنا التعديل الأساسي) */}
      <div className="prose prose-lg max-w-none text-ink leading-relaxed whitespace-pre-line">
        {/* استبدلي story.content باسم الحقل الصحيح القادم من الـ API */}
        {story.content || "لا يوجد نص متاح لهذه القصة حالياً."}
      </div>
      
      {/* الدرس المستفاد */}
      {story.moralLesson && (
        <div className="bg-sunny/20 p-6 rounded-2xl border-2 border-sunny">
          <h2 className="font-bold text-xl mb-2">💡 الدرس المستفاد:</h2>
          <p className="text-ink">{story.moralLesson}</p>
        </div>
      )}
    </div>
  );
}