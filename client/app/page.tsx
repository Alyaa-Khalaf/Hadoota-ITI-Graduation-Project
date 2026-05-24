'use client'

import Link from 'next/link'
import { APP_NAME, APP_DESCRIPTION, ROUTES } from '@/utils/constants'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
          {APP_NAME} 🌟
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          {APP_DESCRIPTION}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href={ROUTES.STORIES}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            استكشف القصص
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
          >
            إنشاء حساب
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">مميزات التطبيق</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-semibold mb-2">قصص متنوعة</h3>
              <p className="text-gray-600">
                مجموعة واسعة من القصص المشوقة والتعليمية للأطفال
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">تعلم ممتع</h3>
              <p className="text-gray-600">
                تجربة تعليمية تفاعلية تجعل التعلم ممتعاً وسهلاً
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">👨‍👧‍👦</div>
              <h3 className="text-xl font-semibold mb-2">للعائلة</h3>
              <p className="text-gray-600">
                منصة آمنة وموثوقة للعائلات والأطفال
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">ابدأ رحلتك اليوم</h2>
        <p className="text-gray-600 mb-8">
          انضم إلى آلاف الأطفال والعائلات الذين يستمتعون بقصص حدوتة
        </p>
        <Link
          href={ROUTES.REGISTER}
          className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
        >
          إنشاء حساب مجاني
        </Link>
      </section>
    </div>
  )
}

