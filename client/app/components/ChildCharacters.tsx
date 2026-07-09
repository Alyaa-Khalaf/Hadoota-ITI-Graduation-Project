"use client"

import { motion } from "framer-motion"
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-primary font-bold text-lg animate-pulse">
          جاري التحميل...
        </p>
      </div>
    )
  }

  return (
    <div
      className="story-background min-h-screen p-4 sm:p-6"
      style={
        {
          "--bg-image": 'url("/assets/story night.jpg")',
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          اختر شخصيتك
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground font-medium">
          كل حدوتة تبدأ بشخصية ✨
        </p>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-12">
        {characters.map((c) => {
          const active = selected?.id === c.id

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: active ? 1.05 : 1,
              }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring" }}
              onClick={() => setSelected(c)}
            >
              <Card
                className={`h-full cursor-pointer border-2 transition-all ${
                  active
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border hover:border-primary/50 hover:shadow-md"
                }`}
              >
                <CardContent className="pt-4 pb-4 flex flex-col items-center gap-3">
                  {/* Character Animation */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 sm:w-24 sm:h-24"
                  >
                    <Lottie
                      key={c.id}
                      animationData={c.animation}
                      loop
                      autoplay
                      className="w-full h-full"
                    />
                  </motion.div>

                  {/* Character Name */}
                  <span className={`font-bold text-sm sm:text-base text-center ${
                    active ? "text-primary" : "text-foreground"
                  }`}>
                    {c.name}
                  </span>

                  {/* Selected Badge */}
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg"
                    >
                      ✓
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Selection Details */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-2 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold mb-3">
                شخصيتك المختارة
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
                {selected.name}
              </h2>

              {/* Selected Character Animation */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6"
              >
                <Lottie
                  key={`selected-${selected.id}`}
                  animationData={selected.animation}
                  loop
                  autoplay
                  className="w-full h-full"
                />
              </motion.div>

              {/* Start Button */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="rounded-xl font-bold text-base sm:text-lg"
                >
                  ابدأ الحدوتة ✨
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}