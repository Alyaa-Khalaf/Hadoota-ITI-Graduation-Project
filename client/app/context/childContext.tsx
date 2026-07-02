"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
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

  // 🛡️ requestId بيتزود كل مرة الـ effect يشتغل فيها، عشان لو حصل أكتر
  // من تشغيل متتالي (مثلاً بسبب تغيّر authLoading من true->false->true
  // بسرعة وقت الـ refresh)، نتأكد إن بس آخر نتيجة هي اللي بتتكتب في الـ
  // state، ونتجاهل أي نتيجة "قديمة" وصلت متأخرة.
  const requestIdRef = useRef(0);

  // 📥 عند تحميل أي صفحة (بما فيها بعد الـ refresh)، نسأل السيرفر مباشرة
  // "مين الطفل النشط للأب ده؟" بدل ما نعتمد على أي تخزين في المتصفح.
  useEffect(() => {
    // ⏳ لسه الـ auth بيحمّل (يعني لسه بيقرأ التوكن من التخزين/الكوكيز)،
    // متعملش أي حاجة خالص. الأهم هنا إن AuthContext يضمن إن authLoading
    // يفضل true لحد ما accessToken يوصل لقيمته النهائية الحقيقية
    // (مش قيمة مؤقتة/ابتدائية)، وإلا المشكلة هتفضل موجودة مهما عدّلنا هنا.
    if (authLoading) return;

    const currentRequestId = ++requestIdRef.current;

    const fetchActiveChild = async () => {
      if (!accessToken) {
        // ⚠️ لو وصلنا هنا وaccessToken لسه null بعد ما authLoading
        // بقى false، يبقى فعلاً مفيش مستخدم مسجل دخول (مش مجرد تأخير
        // في القراءة). نتأكد إن مفيش طلب أحدث اتبعت بعدنا قبل ما نكتب.
        if (currentRequestId !== requestIdRef.current) return;
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

        // 🚫 لو فيه طلب أحدث بدأ بعدنا (يعني الـ accessToken اتغيّر
        // تاني قبل ما الطلب القديم ده يخلص)، نتجاهل النتيجة القديمة
        // دي تمامًا عشان ميحصلش overwrite غلط.
        if (currentRequestId !== requestIdRef.current) return;

        if (res.ok && data?.success && data?.data) {
          setSelectedChildState(data.data);
        } else {
          setSelectedChildState(null);
        }
      } catch (err) {
        if (currentRequestId !== requestIdRef.current) return;
        console.error("Failed to fetch active child:", err);
        setSelectedChildState(null);
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoadingSelectedChild(false);
          setHasFetchedActive(true);
        }
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