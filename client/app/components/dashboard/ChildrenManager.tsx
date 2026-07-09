"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Plus, LogIn } from "lucide-react";

interface Child {
  _id: string;
  parentId?: string;
  schoolId?: string | null;
  classId?: string | null;
  name: string;
  age: number;
  gender: "male" | "female";
  avatar: string;
  interests: string[];
  learningLevel: "beginner" | "intermediate" | "advanced";
  settings?: {
    allowedTopics: string[];
    screenTimeLimit: number;
    difficultyLevel: string;
  };
  screenTime?: {
    today: number;
    lastReset: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

export default function ChildrenManager() {
  const router = useRouter();

  const [children, setChildren] = useState<Child[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const [newChildGender, setNewChildGender] = useState<"male" | "female">("male");
  const [newLearningLevel, setNewLearningLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [newInterests, setNewInterests] = useState<string[]>([]);

  const availableInterests = [
    "adventures",
    "animals",
    "science",
    "morals",
    "history",
    "mysteries",
    "space",
    "religion",
    "nature",
    "sports",
  ];

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/children", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result: ApiResponse<Child[]> = await res.json();

        if (res.ok && result.success && Array.isArray(result.data)) {
          setChildren(result.data);
        } else {
          setError(result.message || "فشل في تحميل قائمة الأطفال.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء الاتصال بالسيرفر لجلب الأطفال.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchChildren();
  }, []);

  const enterChildWorld = (childId: string) => {
    localStorage.setItem("activeChildId", childId);
    router.push("/childAdventure");
  };

  const handleInterestCheckbox = (interest: string) => {
    if (newInterests.includes(interest)) {
      setNewInterests((prev) => prev.filter((i) => i !== interest));
    } else {
      setNewInterests((prev) => [...prev, interest]);
    }
  };

  const handleAddChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName || !newChildAge) return;

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

      const requestPayload = {
        name: newChildName,
        age: Number(newChildAge),
        gender: newChildGender,
        interests: newInterests,
        learningLevel: newLearningLevel,
      };

      const res = await fetch("http://localhost:5000/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestPayload),
      });

      const result: ApiResponse<Child> = await res.json();

      if (res.ok && result.success) {
        if (result.data) {
          setChildren((prev) => [...prev, result.data]);
        }

        setNewChildName("");
        setNewChildAge("");
        setNewChildGender("male");
        setNewLearningLevel("beginner");
        setNewInterests([]);
        setIsAdding(false);
      } else {
        setError(result.message || "فشل في حفظ بيانات الطفل.");
      }
    } catch (err) {
      setError("حدث خطأ في السيرفر أثناء إضافة الطفل.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedChildId) return;

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const cleanId = String(selectedChildId).trim();

      const res = await fetch(`http://localhost:5000/api/children/${cleanId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setShowDeleteDialog(false);
        setChildren((prevChildren) =>
          prevChildren.filter((child) => String(child._id) !== cleanId)
        );
        setSelectedChildId(null);
      } else {
        alert(`فشل الحذف، كود حالة السيرفر: ${res.status}`);
      }
    } catch (err) {
      console.error("خطأ في دالة حذف الطفل بالفرونت:", err);
    }
  };

  return (
    <div className="space-y-6 w-full" dir="rtl">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-2 bg-destructive/10">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header Card */}
      <Card className="border-2 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-primary">
                أطفالي الصغار 👶
              </h3>
              <p className="text-sm text-muted-foreground">
                أضف وأدر ملفات أطفالك لتخصيص تجربتهم
              </p>
            </div>
            <Button
              onClick={() => setIsAdding(true)}
              className="gap-2 w-full sm:w-auto"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              إضافة طفل جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Children Grid */}
      {isFetching ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3">
              <Card className="border-2 border-dashed bg-muted/50">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="text-5xl mb-4">👶</div>
                  <p className="text-lg font-semibold text-foreground mb-2">
                    لا يوجد أطفال مضافون حالياً
                  </p>
                  <p className="text-muted-foreground mb-6">
                    ابدأ بإضافة طفلك الأول لتشغيل تجربته الخاصة! 🚀
                  </p>
                  <Button onClick={() => setIsAdding(true)} size="lg">
                    إضافة أول طفل
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            children.map((child) => (
              <Card
                key={child._id}
                className="border-2 hover:shadow-md transition-all overflow-hidden"
              >
                <CardContent className="pt-6 pb-6">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3 inline-block">
                      {child.gender === "male" ? "👦" : "👧"}
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-foreground truncate">
                      {child.name}
                    </h4>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="secondary">العمر: {child.age}</Badge>
                      <Badge variant="secondary">
                        {child.learningLevel === "beginner"
                          ? "مبتدئ"
                          : child.learningLevel === "intermediate"
                          ? "متوسط"
                          : "متقدم"}
                      </Badge>
                    </div>

                    {child.interests && child.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {child.interests.slice(0, 3).map((interest, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {child.interests.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{child.interests.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => enterChildWorld(child._id)}
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      <LogIn className="w-4 h-4" />
                      دخول
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedChildId(child._id);
                        setShowDeleteDialog(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Add Child Modal */}
      {isAdding && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => !isLoading && setIsAdding(false)}
        >
          <Card
            className="w-full max-w-md border-2 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-center">إضافة مغامر جديد 🚀</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleAddChildSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label>الاسم</Label>
                  <Input
                    type="text"
                    placeholder="اكتب اسم الطفل"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Age and Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>العمر (سنوات)</Label>
                    <select
                      required
                      value={newChildAge}
                      onChange={(e) => setNewChildAge(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 rounded-lg border-2 border-border text-sm font-medium"
                    >
                      <option value="" disabled hidden>
                        اختر العمر
                      </option>
                      {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>الجنس</Label>
                    <select
                      required
                      value={newChildGender}
                      onChange={(e) => setNewChildGender(e.target.value as any)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 rounded-lg border-2 border-border text-sm font-medium"
                    >
                      <option value="male">ذكر 👦</option>
                      <option value="female">أنثى 👧</option>
                    </select>
                  </div>
                </div>

                {/* Learning Level */}
                <div className="space-y-2">
                  <Label>مستوى التعلم</Label>
                  <select
                    required
                    value={newLearningLevel}
                    onChange={(e) => setNewLearningLevel(e.target.value as any)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border text-sm font-medium"
                  >
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم</option>
                  </select>
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label>الاهتمامات</Label>
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted">
                    {availableInterests.map((interest) => (
                      <label
                        key={interest}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={newInterests.includes(interest)}
                          onChange={() => handleInterestCheckbox(interest)}
                          disabled={isLoading}
                          className="rounded border-border"
                        />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "جاري الحفظ..." : "حفظ الطفل"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAdding(false)}
                    disabled={isLoading}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm border-2">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h4 className="text-xl font-bold mb-2">هل أنت متأكد من الحذف؟</h4>
              <p className="text-muted-foreground text-sm mb-6">
                سيتم حذف كافة بيانات الطفل ولا يمكن استعادتها.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={confirmDelete}
                  variant="destructive"
                  className="flex-1"
                >
                  نعم، احذف
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  تراجع
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


interface Child {
  _id: string;
  parentId?: string;
  schoolId?: string | null;
  classId?: string | null;

  name: string;
  age: number;
  gender: "male" | "female";

  avatar: string;
  interests: string[];

  learningLevel: "beginner" | "intermediate" | "advanced";

  settings?: {
    allowedTopics: string[];
    screenTimeLimit: number;
    difficultyLevel: string;
  };

  screenTime?: {
    today: number;
    lastReset: string;
  };

  createdAt?: string;
  updatedAt?: string;
}

/* تعليق: قالب الاستقبال القياسي للـ API المعمول به */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

export default function ChildrenManager() {
  const router = useRouter();

  /* تعليق: الـ States الخاصة بالتحكم في مصفوفة وعمليات الحذف والتعديل */
  const [children, setChildren] = useState<Child[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  /* تعليق: الحالات والـ الـ States لحفظ القيم المدخلة في فورم الإضافة الحية */
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");
  const [newChildGender, setNewChildGender] = useState<"male" | "female">("male");
  const [newLearningLevel, setNewLearningLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [newInterests, setNewInterests] = useState<string[]>([]);

// ///////////////////////////////////////////////////
  /* تعليق: قائمة الاهتمامات باللغة العربية المسموح بها والمطابقة للـ Enum */
  const availableInterests = ['adventures', 'animals', 'science', 'morals', 'history', 'mysteries', 'space', 'religion', 'nature', 'sports'];

  // ========================================================
  // 1️⃣ جلب قائمة الأطفال عند فتح الصفحة (GET Request)
  // ========================================================
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/children", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        const result: ApiResponse<Child[]> = await res.json();

        if ( res.ok && result.success && Array.isArray(result.data) ) {
          setChildren(result.data);
        }
        else {
          setError(result.message || "فشل في تحميل قائمة الأطفال.");
        }
      } catch (err) {
        setError("حدث خطأ أثناء الاتصال بالسيرفر لجلب الأطفال.");
      } finally {
        setIsFetching(false);
      }
    };

  

    fetchChildren();
  }, []);

  // ========================================================
  // 🚀 الدخول لعالم الطفل (التطبيق الخاص بتجربة الطفل)
  // ========================================================
  const enterChildWorld = (childId: string) => {
    localStorage.setItem("activeChildId", childId);
    router.push("/childAdventure");
  };

  // ========================================================
  // 🎛️ دالة مساعدة لإدارة مصفوفة الاهتمامات المختارة ديناميكياً
  // ========================================================
  const handleInterestCheckbox = (interest: string) => {
    if (newInterests.includes(interest)) {
      setNewInterests(prev => prev.filter(i => i !== interest));
    } else {
      setNewInterests(prev => [...prev, interest]);
    }
  };

  // ========================================================
  // 2️⃣ إضافة طفل جديد وإرساله للسيرفر (POST Request)
  // ========================================================
  const handleAddChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName || !newChildAge) return;

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      
      /* تعليق: تجهيز البيانات وإعداد المتغيرات لإرسالها بالشكل الهندسي الصحيح */
      const requestPayload = {
        name: newChildName,
        age: Number(newChildAge),
        gender: newChildGender,
        interests: newInterests,
        learningLevel: newLearningLevel,
      };

      const res = await fetch("http://localhost:5000/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestPayload),
      });

      const result: ApiResponse<Child> = await res.json();

      if (res.ok && result.success) {
        /* ملاحظة ذهبية: الباك إيند يرجع كائن مستقل، مدمج بالـ State لتجنب الريفرش */
        if (result.data) {
          setChildren(prev => [...prev, result.data]);
        }
        
        // تصفير الخانات
        setNewChildName("");
        setNewChildAge("");
        setNewChildGender("male");
        setNewLearningLevel("beginner");
        setNewInterests([]);
        setIsAdding(false);
      } else {
        setError(result.message || "فشل في حفظ بيانات الطفل.");
      }
    } catch (err) {
      setError("حدث خطأ في السيرفر أثناء إضافة الطفل.");
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================================
  // 3️⃣ تأكيد وتنفيذ عملية الحذف من السيرفر وقاعدة البيانات
  // ========================================================
  const confirmDelete = async () => {
    if (!selectedChildId) return;

    try {
      let token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      const cleanId = String(selectedChildId).trim();
      
      const res = await fetch(`http://localhost:5000/api/children/${cleanId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      const result = await res.json();

      if (res.ok && result.success) {
        setShowDeleteDialog(false);
        setChildren((prevChildren) => 
          prevChildren.filter((child) => String(child._id) !== cleanId)
        );
        setSelectedChildId(null);
      } else {
        alert(`فشل الحذف، كود حالة السيرفر: ${res.status}`);
      }
    } catch (err) {
      console.error("خطأ في دالة حذف الطفل بالفرونت:", err);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">
          {error}
        </div>
      )}

      {/* شريط التحكم وزر فتح المودال لإضافة مغامر جديد */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-xl font-black text-gray-800">أطفالي الصغار 👶</h3>
          <p className="text-xs font-bold text-gray-400">أضف وادر ملفات أطفالك لتخصيص تجربتهم.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAdding(true)}
        >
          إضافة طفل جديد +
        </Button>
      </div>

      {/* معالجة وبناء الكروت الحقيقية للمستخدمين الصغار */}
      {isFetching ? (
        <div className="text-center py-8 text-xs font-bold text-gray-400 animate-pulse">جاري جلب ملفات الأطفال الحية...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.length === 0 ? (
            <div className="col-span-full text-center py-8 text-sm font-bold text-gray-400 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              لا يوجد أطفال مضافون حالياً. ابدأ بإضافة طفلك الأول! 🚀
            </div>
          ) : (
            children.map((child) => {
              const childId = child._id;
              return (
                <div key={childId} className="bg-white p-5 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="text-5xl bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    {/* {child.gender === "male" ? "👦" : "👧"} */}
                    <div>
  {child.gender}
</div>
                  </div>
                  <h4 className="text-center text-lg font-black text-gray-800">{child.name}</h4>
                  <div className="flex justify-center gap-2 mt-2">
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">العمر: {child.age} سنوات</span>
                    <span className="text-[10px] bg-purple-50 text-purple-600 px-3 py-1 rounded-full font-bold">{child.learningLevel}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center mt-3">
                    {child.interests && child.interests.map((interest, i) => (
                      <span key={i} className="bg-gray-50 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-md border">
                        {interest}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-5">
                    <Button
                      variant="primary"
                      className="flex-1 !py-2 !px-4 text-[11px] font-black"
                      onClick={() => enterChildWorld(childId)}
                    >
                      ادخل عالمه 🚀
                    </Button>
                    <Button
                      variant="danger"
                      className="flex-1 !py-2 !px-4 text-[11px] font-black"
                      onClick={() => {
                        setSelectedChildId(childId);
                        setShowDeleteDialog(true);
                      }}
                    >
                      حذف 🗑️
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* نافذة تعبئة وإدخال البيانات لإرسالها بالـ POST */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-right">
            <h3 className="text-xl font-black text-center mb-6">إضافة مغامر جديد 🚀</h3>
            <form onSubmit={handleAddChildSubmit} className="space-y-4">
              <Input type="text" placeholder="اسم الطفل" label="الاسم" value={newChildName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChildName(e.target.value)} required disabled={isLoading} />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">العمر (سنوات)</label>
                  <select
                    required
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:outline-none"
                  >
                    <option value="" disabled hidden>اختر العمر</option>
                    {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <option key={num} value={num}>{num} سنوات</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-1.5">الجنس</label>
                  <select
                    required
                    value={newChildGender}
                    onChange={(e) => setNewChildGender(e.target.value as any)}
                    disabled={isLoading}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:outline-none"
                  >
                    <option value="male">ذكر (👦)</option>
                    <option value="female">أنثى (👧)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-1.5">مستوى التعلم</label>
                <select
                  required
                  value={newLearningLevel}
                  onChange={(e) => setNewLearningLevel(e.target.value as any)}
                  disabled={isLoading}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:outline-none"
                >
                  <option value="beginner">مبتدئ (Beginner)</option>
                  <option value="intermediate">متوسط (Intermediate)</option>
                  <option value="advanced">متقدم (Advanced)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black mb-2">اهتمامات وشغف الطفل:</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                  {availableInterests.map((interest) => (
                    <label key={interest} className="flex items-center gap-2 font-bold text-gray-600 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={newInterests.includes(interest)}
                        onChange={() => handleInterestCheckbox(interest)}
                        className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                        disabled={isLoading}
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" fullWidth={true} className="!py-3 font-black" disabled={isLoading}>
                  {isLoading ? "جاري الحفظ... ⏳" : "حفظ الطفل ✨"}
                </Button>
                <Button type="button" variant="sky" className="!py-3 px-6 font-bold" onClick={() => setIsAdding(false)} disabled={isLoading}>إلغاء</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ديالوج تأكيد عملية الحذف */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-6 max-w-xs w-full text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h4 className="text-lg font-black">هل أنت متأكد من الحذف؟</h4>
            <p className="text-xs text-gray-500 font-bold">سيتم حذف كافة بيانات الطفل ولا يمكن استعادتها.</p>
            <div className="flex gap-2">
              <Button variant="danger" className="flex-1 !py-2 font-black" onClick={confirmDelete}>  نعم، احذف </Button>
              <Button variant="sky" className="flex-1 !py-2 font-black" onClick={() => setShowDeleteDialog(false)}>تراجع</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}