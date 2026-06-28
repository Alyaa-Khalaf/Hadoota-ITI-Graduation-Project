"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AdventureHeader from "./AdventureHeader";
import { useRecentStories } from "@/hooks/useRecentStories";

export default function RecentStories() {
  const router = useRouter();
  const { stories, loading } = useRecentStories();

  if (loading) {
    return (
      <div className="text-center py-6">
        ⏳ جاري تحميل الحواديت...
      </div>
    );
  }

  if (!stories.length) {
    return (
      <div className="text-center py-6">
        لا توجد حواديت بعد 📚
      </div>
    );
  }

  return (
    <section className="mt-8">
      <AdventureHeader
        header="حواديتك"
        subHeader="ارجع كمل مغامراتك 📚"
      />

      <div className="mt-6 space-y-4">
        {stories.map((story: any, index: number) => (
          <motion.div
            key={story._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="
              flex items-center justify-between
              rounded-3xl
              p-4
              bg-cat-adventure
              border-[3px]
              border-primary
              shadow-lg
            "
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">
                📖
              </span>

              <div>
                <h3 className="font-bold text-lg text-ink">
                  {story.title}
                </h3>

                <p className="text-sm text-ink-mute">
                  {story.topic}
                </p>

                <div className="w-36 h-2 rounded-full bg-white/50 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${story.progress ?? 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/stories/${story._id}`)}
              className="
                px-4 py-2
                rounded-2xl
                bg-sunny
                text-ink
                font-bold
                border-2
                border-white
                shadow-md
              "
            >
              قراءة
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}