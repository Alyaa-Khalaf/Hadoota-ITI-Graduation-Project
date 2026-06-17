'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'
import { childService } from '@/services/childService'
import { storyService } from '@/services/storyService'
import { Child } from '@/types'
import { getApiErrorMessage } from '@/utils/api'

export default function CreateStoryPage() {
  const router = useRouter()
  const { user, isHydrated, isLoading: authLoading } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    childId: '',
    childName: '',
    childAge: '6',
    topic: '',
    character: '',
    sceneCount: '2',
  })

  useEffect(() => {
    if (!user) return

    const loadChildren = async () => {
      setLoadingChildren(true)
      try {
        const response = await childService.getChildren()
        if (response.success && response.data) {
          setChildren(response.data)
          if (response.data.length > 0) {
            setForm((prev) => ({ ...prev, childId: response.data![0].id }))
          }
        }
      } catch (err) {
        setError(getApiErrorMessage(err, 'تعذر تحميل بيانات الأطفال'))
      } finally {
        setLoadingChildren(false)
      }
    }

    loadChildren()
  }, [user])

  if (!isHydrated || authLoading) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setGenerating(true)

    try {
      let childId = form.childId

      if (!childId) {
        if (!form.childName.trim()) {
          setError('اختر طفلاً أو أدخل اسم طفل جديد')
          setGenerating(false)
          return
        }
        const created = await childService.createChild({
          name: form.childName.trim(),
          age: Number(form.childAge) || 6,
        })
        if (!created.success || !created.data) {
          setError(created.message || 'تعذر إنشاء ملف الطفل')
          setGenerating(false)
          return
        }
        childId = created.data.id
      }

      const result = await storyService.generate({
        childId,
        topic: form.topic.trim(),
        character: form.character.trim(),
        sceneCount: Number(form.sceneCount) || 2,
        childAge: Number(form.childAge) || 6,
      })

      if (result.success && result.data?.id) {
        router.push(`/stories/${result.data.id}`)
        return
      }

      setError(result.message || 'فشل إنشاء القصة')
    } catch (err) {
      setError(getApiErrorMessage(err, 'فشل إنشاء القصة'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <h1 className="text-4xl font-bold mb-2">إنشاء حدوتة جديدة</h1>
      <p className="text-gray-600 mb-8">قد تستغرق العملية دقيقة أو أكثر.</p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {loadingChildren ? (
          <p className="text-gray-600">جاري تحميل الأطفال...</p>
        ) : children.length > 0 ? (
          <div>
            <label className="block text-sm font-medium mb-2">الطفل</label>
            <select
              value={form.childId}
              onChange={(e) => setForm({ ...form, childId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">اسم الطفل</label>
              <input
                type="text"
                value={form.childName}
                onChange={(e) => setForm({ ...form, childName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">عمر الطفل</label>
              <input
                type="number"
                min={3}
                max={12}
                value={form.childAge}
                onChange={(e) => setForm({ ...form, childAge: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">موضوع القصة</label>
          <input
            type="text"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            placeholder="مثال: الفضاء"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">البطل</label>
          <input
            type="text"
            value={form.character}
            onChange={(e) => setForm({ ...form, character: e.target.value })}
            placeholder="مثال: نور"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">عدد المشاهد</label>
          <select
            value={form.sceneCount}
            onChange={(e) => setForm({ ...form, sceneCount: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={generating}
          className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          {generating ? 'جاري إنشاء الحدوتة...' : 'إنشاء الحدوتة'}
        </button>
      </form>

      <Link href={ROUTES.STORIES} className="inline-block mt-6 text-primary hover:underline">
        ← العودة للقصص
      </Link>
    </div>
  )
}
