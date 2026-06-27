"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { useChildren } from "@/hooks/useChildren";
import { API_ORIGIN } from "@/lib/apiConfig";

export type Child = {
  _id: string;
  name: string;
  age: number;
  gender: number;
  avatar: string;
};

type ChildContextType = {
  selectedChild: Child | null;
  setSelectedChild: (child: Child | null) => void;
  loadingSelectedChild: boolean;
};

const ChildContext = createContext<ChildContextType | undefined>(undefined);

const API = API_ORIGIN;

export function ChildProvider({ children }: { children: ReactNode }) {
  const { accessToken, isLoading: authLoading } = useAuth();
  const { children: childrenList, loading: childrenLoading } = useChildren();

  const [selectedChild, setSelectedChildState] = useState<Child | null>(null);
  const [loadingSelectedChild, setLoadingSelectedChild] = useState(true);
  const [hasFetchedActive, setHasFetchedActive] = useState(false);

  // 📥 عند تحميل أي صفحة (بما فيها بعد الـ refresh)، نسأل السيرفر مباشرة
  // "مين الطفل النشط للأب ده؟" بدل ما نعتمد على أي تخزين في المتصفح.
  useEffect(() => {
    const fetchActiveChild = async () => {
      if (authLoading) return;

      if (!accessToken) {
        setSelectedChildState(null);
        setLoadingSelectedChild(false);
        setHasFetchedActive(true);
        return;
      }

      try {
        setLoadingSelectedChild(true);

        const res = await fetch(`${API}/api/children/active`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (res.ok && data?.success && data?.data) {
          setSelectedChildState(data.data);
        } else {
          setSelectedChildState(null);
        }
      } catch (err) {
        console.error("Failed to fetch active child:", err);
        setSelectedChildState(null);
      } finally {
        setLoadingSelectedChild(false);
        setHasFetchedActive(true);
      }
    };

    fetchActiveChild();
  }, [accessToken, authLoading]);

  // 🔄 شبكة أمان: لو سألنا السيرفر عن "الطفل النشط" ورجع null، لكن
  // فعليًا في قائمة الأطفال طفل واحد موجود (حالة شائعة جدًا مباشرة بعد
  // الـ register، حيث الأب لسه ماعندوش غير طفل واحد ومفيش خطوة اختيار
  // واضحة)، نختاره تلقائيًا كـ "نشط" فورًا بدل ما الأب يحتاج refresh.
  // هذا يعمل مرة واحدة فقط بعد أول fetch ناجح، لتجنب أي تكرار.
  useEffect(() => {
    if (!hasFetchedActive) return;
    if (selectedChild) return;
    if (childrenLoading) return;

    if (childrenList.length === 1) {
      setSelectedChild(childrenList[0]);
    }
    // لو فيه أكتر من طفل ومفيش active child محدد، نسيبها null فعلاً
    // لحد ما الأب يختار بنفسه من TheChildren (مفيش طريقة آمنة نخمّن
    // مين يقصد من بين أكتر من طفل).
  }, [hasFetchedActive, selectedChild, childrenLoading, childrenList]);

  // 💾 لما الأب يختار طفل جديد (من TheChildren مثلاً، أو تلقائيًا من
  // الشبكة الآمنة فوق)، نحدّث الـ state فورًا، وبالتوازي نخبر السيرفر
  // يحفظ الاختيار بشكل دائم في الداتابيز.
  const setSelectedChild = (child: Child | null) => {
    setSelectedChildState(child);

    if (!accessToken || !child) return;

    fetch(`${API}/api/children/active`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ childId: child._id }),
    }).catch((err) => {
      console.error("Failed to persist active child:", err);
    });
  };

  return (
    <ChildContext.Provider
      value={{ selectedChild, setSelectedChild, loadingSelectedChild }}
    >
      {children}
    </ChildContext.Provider>
  );
}

export function useSelectedChild() {
  const context = useContext(ChildContext);

  if (!context) {
    throw new Error("useSelectedChild must be used inside ChildProvider");
  }

  return context;
}