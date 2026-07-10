"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Characters } from "@/types/childStory"
import { useSelectedChild } from "@/context/childContext"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import Lottie from "lottie-react"
import lion from "@/animation/Lion.json"
import princess from "@/animation/Creative Women.json"
import knight from "@/animation/Shield of wings.json"
import robot from "@/animation/robot.json"
import dragon from "@/animation/dragon.json"
import astronaut from "@/animation/astronaut.json"
import superman from "@/animation/superman.json"
import cat from "@/animation/cat.json"
import { Sparkles, Check, ArrowLeft } from "lucide-react"

const characters: (Characters & { value: string })[] = [
  { id: 1, name: "أسد", animation: lion, value: "أسد" },
  { id: 2, name: "أميرة", animation: princess, value: "أميرة" },
  { id: 3, name: "رحالة", animation: knight, value: "رحالة" },
  { id: 4, name: "روبوت", animation: robot, value: "روبوت" },
  { id: 5, name: "التنين", animation: dragon, value: "تنين" },
  { id: 6, name: "رائد الفضاء", animation: astronaut, value: "رائد فضاء" },
  { id: 7, name: "البطل الخارق", animation: superman, value: "البطل الخارق" },
  { id: 8, name: "قطة لطيفة", animation: cat, value: "قطة لطيفة" },
]

export default function ChildCharactres() {
  const router = useRouter()
  const { selectedChild, loadingSelectedChild } = useSelectedChild()
  const [selected, setSelected] = useState<(Characters & { value: string }) | null>(null)

  useEffect(() => {
    if (loadingSelectedChild) return
    if (!selectedChild) {
      router.push("/childSelect")
    }
  }, [selectedChild, loadingSelectedChild, router])

  const handleStart = () => {
    if (!selected || !selectedChild) return
    router.push(`/childTopics?character=${encodeURIComponent(selected.value)}`)
  }

  if (loadingSelectedChild || !selectedChild) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
          <p className="text-slate-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen relative overflow-hidden bg-primary/10"
    >
      {/* Decorative blobs - باستخدام ألوانك */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 pb-40">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight text-primary">
            مين بطل الحكاية النهاردة؟ 🌟
          </h1>
          <p className="mt-4 text-muted-foreground text-lg sm:text-xl">
            اختار شخصيتك المفضلة وابدأ المغامرة
          </p>
        </motion.div>

        {/* Characters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {characters.map((c, i) => {
            const active = selected?.id === c.id;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(c)}
                className="cursor-pointer"
              >
                <Card
                  className={`group relative h-full   transition-all duration-300 ${
                    active
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <CardContent className="p-6 flex flex-col items-center gap-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-muted/50 flex items-center justify-center">
                      <Lottie animationData={c.animation} loop className="w-full h-full" />
                    </div>
                    <p className={`font-bold text-lg ${active ? "text-primary" : "text-foreground"}`}>
                      {c.name}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Floating Action Bar */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 inset-x-4 z-50 flex justify-center"
            >
              <div className="w-full max-w-lg rounded-3xl border border-border bg-background/80 backdrop-blur-2xl shadow-2xl p-3 sm:p-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
                  <Lottie animationData={selected.animation} loop className="w-10 h-10" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-muted-foreground">البطل المختار</p>
                  <p className="text-xl font-extrabold text-foreground">{selected.name}</p>
                </div>
                <Button
                  onClick={handleStart}
                  size="lg"
                  variant={"default"}
                  className="gap-2 rounded-xl px-5 py-5 text-base font-semibold"
                >
                  ابدأ الآن 🚀
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
