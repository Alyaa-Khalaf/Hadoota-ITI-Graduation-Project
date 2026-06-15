"use client"

import { StoryTopics } from "@/types/childStory"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

const topics: StoryTopics[] = [
  {id: 1,title: "الفضاء",emoji: "🚀",color: "bg-sky",shadowColor: "0  15px 4px rgba(38, 127, 253, 0.8)", }
  ,{id: 2,title: "مصر الجميلة",emoji: "🕌",color: "bg-sunny",shadowColor: "0 15px  4px rgba(231, 195, 54, 0.8)",      },
    {id: 3,title: "العائلة",emoji: "👨‍👩‍👧",color: "bg-blossom",shadowColor: "0 15px  4px rgba(255, 107, 157, 0.8)",      },
  {id: 4,title: "الألوان",emoji: "🎨",color: "bg-magic",shadowColor: "0 15px  4px rgba(199, 125, 255, 0.8)",   },
  { id: 5, title: "الأرقام", emoji: "🔢", color: "bg-rose", shadowColor: "0 15px  4px rgba(255, 77, 141, 0.8)",       },
  { id: 6, title: "النباتات", emoji: "🌱", color: "bg-meadow", shadowColor: "0 15px  4px rgba(107, 203, 119, 0.8)", },
  {id: 7,title: "الأنبياء",emoji: "🕌",color: "bg-primary",shadowColor: "4px 15px  4px rgba(224, 94, 55, 0.8)",  },
  { id: 8, title: "البحر", emoji: "🌊", color: "bg-sky", shadowColor: "4px 15px  2px rgba(9, 104, 236, 0.8)", },
]


export default function StoryTitles() {

  const [selectedTopic, setSelectedTopics] =
    useState<StoryTopics | null>(null)

  return (
<div
  className="story-background min-h-screen p-6"
  style={{
    "--bg-image": 'url("/assets/kidsStory.jpg")',
  } as React.CSSProperties}
>
      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: -40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
         transition={{
          duration: 0.6,
        }}>
        <h1 className="text-4xl font-bold text-center text-primary-wash">
          مواضيع سحرية 
        </h1>
        <p className="text-center text-primary-wash mt-2 mb-8">
          اختر موضوع الحدوتة
        </p>
      </motion.div>

      {/* Topics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-5xl mx-auto">

        {topics.map((topic) => {

          const selected =
            selectedTopic?.id === topic.id

          return (

            <motion.button
              key={topic.id}
              onClick={() =>
                setSelectedTopics(topic)
              }
              initial={{
                opacity: 0,
                y: 60,
                scale: 0.7,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: selected ? 1.12 : 1,
                rotate: selected
                  ? [-2, 2, -2, 0]
                  : 0,
              }}
              whileHover={{
                scale: 1.08,
                y: -12,
                rotate: [-1, 1, -1],
              }}

              whileTap={{
                scale: 0.92,
              }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 180,
              }}
   style={{ boxShadow: topic.shadowColor,borderColor:topic.shadowColor }}
          className={` p-6 rounded-3xl flex flex-col items-center gap-4 relative overflow-hidden
            ${selected
           ? "bg-primary-light border-primary text-white"
           : "bg-white border-border-warm text-ink" }`}>
              {/* Floating Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className={`
                  absolute w-24 h-24 rounded-full blur-2xl opacity-40
                  ${topic.color}
                `}  />
              {/* Emoji */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 3, -3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className=" text-5xl relative z-10">
                {topic.emoji}
              </motion.div>

              {/* Title */}
              <motion.h2
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className=" font-bold text-lg relative z-10" >
                {topic.title}
              </motion.h2>
            </motion.button>

          )
        })}
      </div>

      {/* Selected Topic */}
      {selectedTopic && (

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: [0.95, 1.03, 1],
          }}
          transition={{
            duration: 0.5,
          }}
            style={{borderColor:selectedTopic.color,boxShadow: selectedTopic.shadowColor }}
          className="mt-24 max-w-xl mx-auto bg-white  rounded-3xl p-8  text-center ">
          {/* Emoji */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}

            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-6xl"  >
            {selectedTopic.emoji}
          </motion.div>
          <p className="text-sm text-ink-muted mt-4">
            الموضوع المختار
          </p>
          <motion.h2
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-4xl font-bold text-primary mt-2">
            {selectedTopic.title}
          </motion.h2>

          {/* Start Button */}
          <motion.div

            animate={{
              y: [0, -12, 0],
              scale: [1, 1.12, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mt-10">
            <Link href="/stories" className=" bg-primary text-white px-8 py-4 rounded-2xl shadow-button shadow-[0_0_30px_rgba(255,112,67,0.45)] font-bold inline-block text-lg hover:bg-primary-light hover:text-ink">
              ابدأ الحدوتة 
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}