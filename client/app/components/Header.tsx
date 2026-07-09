'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'
import { Button } from '@/components/ui/Button'
import { LogOut, User } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-card">
      <nav className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <Link href={ROUTES.HOME} className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          حدوتة
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
                <User className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground hidden sm:inline">
                  {user.name}
                </span>
              </div>
              <Button
                onClick={logout}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href={ROUTES.LOGIN}>
                  دخول
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
              >
                <Link href={ROUTES.REGISTER}>
                  إنشاء حساب
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
