'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={ROUTES.HOME} className="text-2xl font-bold text-primary">
          حدوتة
        </Link>

        <div className="flex gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link href={ROUTES.LOGIN} className="px-4 py-2 text-primary hover:underline">
                دخول
              </Link>
              <Link href={ROUTES.REGISTER} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
