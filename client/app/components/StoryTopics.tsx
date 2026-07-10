"use client"

import { StoryTopics } from "@/types/childStory"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useSelectedChild } from "@/context/childContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket } from "lucide-react"

const topics: StoryTopics[] = [
  { id: 1, title: "الفضاء", emoji: "🚀" },
  { id: 2, title: "مصر الجميلة", emoji: "🕌" },
  { id: 3, title: "العائلة", emoji: "👨‍👩‍👧" },
  { id: 4, title: "الألوان", emoji: "🎨" },
  { id: 5, title: "الأرقام", emoji: "🔢" },
  { id: 6, title: "النباتات", emoji: "🌱" },
  { id: 7, title: "الأنبياء", emoji: "🕌" },
  { id: 8, title: "البحر", emoji: "🌊" },
]

export default function StoryTitles() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { selectedChild } = useSelectedChild()
  const character = searchParams.get("character") || ""
  const [selectedTopic, setSelectedTopic] = useState<StoryTopics | null>(null)

  const handleStart = () => {
    if (!selectedChild?._id || !selectedTopic || !character) return
    router.push(
      `/stories?childId=${selectedChild._id}&character=${encodeURIComponent(character)}&topic=${encodeURIComponent(selectedTopic.title)}`
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background p-6 relative overflow-hidden bg-primary/10">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative max-w-5xl mx-auto pb-32">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 text-primary">مواضيع سحرية </h1>
          <p className="text-lg text-muted-foreground">اختار موضوع الحدوتة اللي نفسك تسمعها</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topics.map((topic) => {
            const isSelected = selectedTopic?.id === topic.id
            return (
              <motion.div
                key={topic.id}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTopic(topic)}
              >
                <Card className={`h-full cursor-pointer  transition-all duration-300 ${
                  isSelected ? "border-primary bg-primary/10 shadow-lg" : "border-border hover:border-primary/50"
                }`}>
                  <CardContent className="p-6 flex flex-col items-center gap-3">
                    <span className="text-5xl">{topic.emoji}</span>
                    <span className="font-bold text-lg text-foreground">{topic.title}</span>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed  inset-x-4 z-50 flex justify-center"
          >
            <div className="w-full max-w-md rounded-3xl border border-border bg-background/80 backdrop-blur-2xl shadow-2xl p-4 flex items-center gap-4">
              <div className="text-4xl">{selectedTopic.emoji}</div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted-foreground">الموضوع المختار</p>
                <p className="text-xl font-extrabold text-foreground">{selectedTopic.title}</p>
              </div>
               <Button
                onClick={handleStart}
                className="gap-2 rounded-xl px-5 py-5 text-base font-semibold"
              >
                <Rocket className="h-4 w-4" />
                ابدأ الحدوتة
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}