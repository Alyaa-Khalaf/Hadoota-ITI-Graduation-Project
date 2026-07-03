"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Characters } from "@/types/childStory"
import { useSelectedChild } from "@/context/childContext"
import Lottie from "lottie-react"
import lion from "@/animation/Lion.json"
import princess from "@/animation/Creative Women.json"
import knight from "@/animation/Shield of wings.json"
import robot from "@/animation/robot.json"
import dragon from "@/animation/dragon.json"
import astronaut from "@/animation/astronaut.json"
import superman from "@/animation/superman.json"
import cat from "@/animation/cat.json"

/* الشخصيات المسموحة */
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

  const [selected, setSelected] =
    useState<(Characters & { value: string }) | null>(null)

  // 🛡️ لازم يكون فيه طفل مختار قبل ما نسيب المستخدم يختار شخصية،
  // وإلا صفحة الحدوتة اللي جاية مش هتعرف تحفظ الحدوتة على مين.
  // بنستنى لحد ما الـ context يخلص تحميله الأول عشان منحولش
  // بالغلط قبل ما يوصل الرد الحقيقي من السيرفر.
  useEffect(() => {
    if (loadingSelectedChild) return
    if (!selectedChild) {
      router.push("/childSelect")
    }
  }, [selectedChild, loadingSelectedChild, router])

  const handleStart = () => {
    if (!selected || !selectedChild) return

    router.push(
      `/childTopics?character=${encodeURIComponent(selected.value)}`
    )
  }

  // ⏳ لحد ما نتأكد مين الطفل المختار، منعرضش الشخصيات عشان
  // منسيبش المستخدم يختار حاجة هنضطر نلغيها بعد شوية
  if (loadingSelectedChild || !selectedChild) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-primary font-bold text-lg animate-pulse">
          جاري التحميل...
        </p>
      </div>
    )
  }

  return (
    <div
      className="story-background min-h-screen p-6"
      style={
        {
          "--bg-image": 'url("/assets/story night.jpg")',
        } as React.CSSProperties
      }
    >
      <h1 className="text-4xl text-center font-bold text-page-warm">
        اختر شخصيتك
      </h1>

      <p className="text-center text-primary mt-2 mb-8 font-bold">
        كل حدوتة تبدأ بشخصية
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {characters.map((c) => {
          const active = selected?.id === c.id

          return (
            <motion.button
              key={c.id}
              onClick={() => setSelected(c)}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: active ? 1.1 : 1,
                rotate: active ? [-2, 2, -2, 0] : 0,
              }}
              whileHover={{ scale: 1.08, y: -8 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 180 }}
              className={`
                p-4 rounded-3xl
                flex flex-col items-center gap-4
                shadow-card backdrop-blur-sm
                border-[3px]
                ${
                  active
                    ? "border-white bg-primary"
                    : "border-border-warm bg-page-sky"
                }
              `}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-28 h-28"
              >
                <Lottie
                  key={c.id}
                  animationData={c.animation}
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </motion.div>

              <span
                className={`font-bold text-base ${
                  active ? "text-white" : "text-ink"
                }`}
              >
                {c.name}
              </span>
            </motion.button>
          )
        })}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl mx-auto bg-page-sky p-5 rounded-3xl text-center shadow-story"
        >
          <p className="text-ink-muted text-2xl font-bold">اخترت:</p>

          <div className="text-xl font-bold text-ink text-center">
            {selected.name}
          </div>

          <div className="w-32 h-32 mx-auto mt-2">
            <Lottie
              key={`selected-${selected.id}`}
              animationData={selected.animation}
              loop
              autoplay
              className="w-full h-full"
            />
          </div>

          <motion.div
            animate={{ y: [0, -8, 0], scale: [1, 1.08, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="m-auto mt-4"
          >
            <button
              onClick={handleStart}
              disabled={!selected}
              className="bg-primary text-white px-8 py-4 rounded-2xl shadow-button text-lg font-bold disabled:opacity-50"
            >
              ابدأ الحدوتة
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}