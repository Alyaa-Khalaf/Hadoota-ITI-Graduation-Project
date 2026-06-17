'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'

export default function StoriesPage() {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold">القصص</h1>
        <Link
          href={ROUTES.STORIES_CREATE}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark text-center"
        >
          ✨ إنشاء حدوتة جديدة
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
        <p className="mb-4">ابدأ بإنشاء حدوتة تفاعلية مخصصة لطفلك.</p>
        <Link href={ROUTES.STORIES_CREATE} className="text-primary hover:underline font-medium">
          اذهب إلى صفحة الإنشاء
        </Link>
      </div>
    </div>
  )
}
