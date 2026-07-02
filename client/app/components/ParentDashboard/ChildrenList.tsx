"use client";

import { useState } from "react";
import { useChildren } from "@/hooks/useChildren";
import AddingChildForm from "./AddingChildForm";
import { Plus, Sparkles } from "lucide-react";
import { useSelectedChild } from "@/context/childContext";

type Child = {
  _id: string;
  name: string;
  age: number;
  gender: number;
  avatar: string;
};

type Props = {
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
};

export default function ChildrenList() {
   const { selectedChild, setSelectedChild } = useSelectedChild();

  const { children, loading, refetch } = useChildren();
  const [showAddForm, setShowAddForm] = useState(false);

  // بعد إضافة الطفل بنجاح: نقفل المودال، نختاره، ونعيد جلب القائمة
  const handleChildAdded = async (id: string) => {
  await refetch();

  const newChild = children.find((c) => c._id === id);

  if (newChild) {
    setSelectedChild(newChild);
  }

  setShowAddForm(false);
};

  if (loading) {
    return (
      <div dir="rtl" className="space-y-4">
        <div className="h-12 rounded-2xl bg-primary-wash animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white border border-border-warm animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-5">

      {/* Header row: title + small add button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-ink">الأطفال</h2>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-full
                     shadow-button hover:bg-primary/90 active:scale-95
                     transition-all duration-200 font-bold text-xs"
        >
          <Plus size={14} />
          إضافة طفل
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full max-h-[26rem] overflow-y-auto shadow-story">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-ink">إضافة طفل جديد</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-ink-muted hover:bg-page-warm hover:text-ink transition-colors"
              >
                ✕
              </button>
            </div>
            <AddingChildForm onAdded={handleChildAdded} />
          </div>
        </div>
      )}

      {!children.length ? (
        <div className="rounded-2xl border border-dashed border-border-warm bg-page-warm p-8 text-center">
          <p className="text-sm text-ink-muted">لا يوجد أطفال بعد</p>
          <p className="text-xs text-ink-muted/70 mt-1">
           ` اضغط على إضافة طفل جديد للبدء`
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {children.map((child: Child) => {
           const isActive = selectedChild?._id === child._id;
            const isBoy = child.gender === 1;

            // ألوان لطيفة بتتغير حسب جنس الطفل، متسقة مع الباليتة الأساسية
            const accentBg = isBoy ? "bg-sky" : "bg-blossom";
            const accentBgSoft = isBoy ? "bg-cat-adventure" : "bg-cat-family";

            return (
              <button
                key={child._id}
                type="button"
                onClick={() => setSelectedChild(child)}
                className={`
                  relative text-right rounded-2xl p-5 transition-all duration-300
                  border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light
                  ${
                    isActive
                      ? "bg-primary-wash border-primary-light shadow-card -translate-y-0.5"
                      : "bg-white border-border-warm shadow-sm hover:shadow-card hover:-translate-y-0.5"
                  }
                `}
              >
                {/* Header */}
                <div className="flex items-center gap-3">

                  {/* Avatar */}
                  <div
                    className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0
                      transition-colors duration-300
                      ${isActive ? accentBg : accentBgSoft}
                    `}
                  >
                    {child.avatar || "👶"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-ink truncate">
                      {child.name}
                    </h3>

                    <p className="text-xs text-ink-muted mt-0.5">
                      {child.age} سنوات • {isBoy ? "ولد" : "بنت"}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-primary text-white font-bold shrink-0">
                      <Sparkles size={10} />
                      مختار
                    </span>
                  )}
                </div>

                {/* Bottom hint */}
                <div className="mt-4 flex justify-between items-center border-t border-border-warm pt-3">
                  <span className="text-[11px] text-ink-muted">
                    اضغط لعرض التحليلات
                  </span>

                  <div
                    className={`
                      w-2 h-2 rounded-full transition-colors duration-300
                      ${isActive ? "bg-primary" : "bg-border-warm"}
                    `}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}