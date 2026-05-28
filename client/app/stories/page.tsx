'use client'

import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'
import Link from 'next/link'

export default function StoriesPage() {
  const { user } = useAuth()

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
      <h1 className="text-4xl font-bold mb-8">القصص</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for stories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">قصة 1</h2>
          <p className="text-gray-600 mb-4">وصف القصة</p>
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
            اقرأ القصة
          </button>
        </div>
      </div>
    </div>
  )
}
