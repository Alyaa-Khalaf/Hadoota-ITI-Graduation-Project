"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Bell, Settings, LogOut, LayoutDashboard, Sparkles, ArrowRight, Subscript, SubscriptIcon, LucideSubscript, CreditCard, ArrowLeft } from "lucide-react";
import type { DashboardTab } from "@/(protectedRoutes)/ParentDashboard/page"; // عدّل المسار لو الصفحة في مكان مختلف
import SubscriptionPage from "@/(protectedRoutes)/dashboard/subscription/page";

type Props = {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
};

export default function ParentHeader({ activeTab, setActiveTab }: Props) {
  const { setAccessToken, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setAccessToken(null);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
      setAccessToken(null);
      router.push("/auth/login");
    }
  };

  const navItems: { tab: DashboardTab; label: string; icon: typeof LayoutDashboard }[] = [
    { tab: "overview", label: "نظرة عامة", icon: LayoutDashboard },
    { tab: "reports", label: "تقارير الذكاء الاصطناعي", icon: Sparkles },
  ];

  return (
    <header
      dir="rtl"
      className="w-full bg-white/90 backdrop-blur-md border-b border-border-warm sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-2.5 md:py-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3 md:gap-4">

        {/* LEFT - Back button + Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary-wash flex items-center justify-center text-lg sm:text-xl shrink-0">
            🧸
          </div>
          <div className="text-right min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-ink leading-tight truncate">
              لوحة تحكم الوالدين
            </h1>
            <p className="hidden sm:block text-xs text-ink-muted truncate">
              إدارة الأطفال، التحليلات وتقارير الذكاء الاصطناعي
            </p>
          </div>
        </div>

        {/* CENTER - NAVIGATION (Desktop only) */}
        <nav className="hidden md:flex items-center gap-1 bg-primary-wash p-1 rounded-2xl">
          {navItems.map(({ tab, label, icon: Icon }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary text-white shadow-button"
                      : "text-ink-muted hover:bg-white hover:text-ink"
                  }`}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          <button
            onClick={() => router.push("/ParentDashboard/ParentSubscribtion")}
            className="p-1.5 sm:p-2 rounded-xl text-ink-muted hover:bg-page-warm hover:text-ink transition-colors"
            aria-label="الإعدادات"
          >
            <CreditCard size={18} />
          </button>

          <button
            onClick={handleLogout}
            className="px-2 sm:px-3 py-1.5 text-xs font-bold bg-rose text-white rounded-xl
                       hover:bg-rose/90 active:scale-95 transition-all duration-200
                       flex items-center gap-1.5"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>


          <button
            onClick={() => router.push("/childAdventure")}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-2 rounded-xl text-ink-muted
                       hover:bg-primary hover:text-white transition-colors shrink-0"
            aria-label="الرجوع لصفحة الطفل"
          >
            <span className="hidden sm:inline text-md font-bold">رجوع</span>
            <ArrowLeft size={15} />
          </button>
        </div>
      </div>

      {/* MOBILE NAV - يظهر تحت الهيدر في الشاشات الصغيرة بدل الاختفاء التام */}
      <nav className="md:hidden flex flex-nowrap items-center gap-1 bg-page-warm p-1 mx-3 sm:mx-4 mb-3 rounded-2xl overflow-x-auto">
        {navItems.map(({ tab, label, icon: Icon }) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-2 py-1.5 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1
                whitespace-nowrap transition-all duration-200
                ${
                  isActive
                    ? "bg-primary text-white shadow-button"
                    : "text-ink-muted"
                }`}
            >
              <Icon size={12} />
              {label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}