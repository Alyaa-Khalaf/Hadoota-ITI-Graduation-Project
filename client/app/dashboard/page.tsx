'use client'

import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isHydrated, isLoading } = useAuth()

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول أولاً</h1>
          <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
            اذهب إلى صفحة الدخول
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">معلومات الحساب</h2>
          <p className="text-gray-600">الاسم: {user.name}</p>
          <p className="text-gray-600">البريد: {user.email}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">القصص المقروءة</h2>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">المفضلة</h2>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">الإجراءات السريعة</h2>
        <div className="flex gap-4 flex-wrap">
          <Link
            href={ROUTES.STORIES_CREATE}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            إنشاء حدوتة
          </Link>
          <Link
            href={ROUTES.STORIES}
            className="px-6 py-2 border-2 border-primary text-primary rounded hover:bg-primary hover:text-white"
          >
            استكشف القصص
          </Link>
        </div>
      </div>
    </div>
  )
}
