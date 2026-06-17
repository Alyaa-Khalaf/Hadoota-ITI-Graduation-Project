"use client";

interface RevenueData {
  totalRevenue: number;
  monthlyEarnings: number;
  activeSubscribers: number;
  churnRate: number;
}

interface RevenueMetricsProps {
  data: RevenueData;
}

export default function RevenueMetrics({ data }: RevenueMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right" dir="rtl">
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-3xl border border-green-100 shadow-sm">
        <span className="text-2xl">💰</span>
        <h5 className="text-xs font-black text-gray-500 mt-2">إجمالي الإيرادات</h5>
        <p className="text-2xl font-black text-emerald-700 mt-1">${data.totalRevenue.toLocaleString()}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-3xl border border-blue-100 shadow-sm">
        <span className="text-2xl">📈</span>
        <h5 className="text-xs font-black text-gray-500 mt-2">الأرباح الشهرية</h5>
        <p className="text-2xl font-black text-indigo-700 mt-1">${data.monthlyEarnings.toLocaleString()}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-fuchsia-100 p-6 rounded-3xl border border-purple-100 shadow-sm">
        <span className="text-2xl">👥</span>
        <h5 className="text-xs font-black text-gray-500 mt-2">المشتركون النشطون</h5>
        <p className="text-2xl font-black text-purple-700 mt-1">{data.activeSubscribers} مدرسة / أب</p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-orange-100 p-6 rounded-3xl border border-red-100 shadow-sm">
        <span className="text-2xl">📉</span>
        <h5 className="text-xs font-black text-gray-500 mt-2">معدل الإلغاء (Churn)</h5>
        <p className="text-2xl font-black text-red-700 mt-1">%{data.churnRate}</p>
      </div>
    </div>
  );
}