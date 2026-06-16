"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import StoryPlayer from "@/components/story-player/StoryPlayer"

export default function Page() {
  const searchParams = useSearchParams()
  const [childId, setChildId] = useState<string>("")

  const character = searchParams.get("character") || ""
  const topic = searchParams.get("topic") || ""

  useEffect(() => {
    const fromQuery = searchParams.get("childId")
    const fromStorage = localStorage.getItem("activeChildId")
    setChildId(fromQuery || fromStorage || "")
  }, [searchParams])

  if (!childId || !character || !topic) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-red-500 font-bold">
          بيانات الحدوتة غير مكتملة. لازم تحدد الطفل، الشخصية، والموضوع أولاً.
        </p>
      </div>
    )
  }

  return <StoryPlayer childId={childId} character={character} topic={topic} />
}