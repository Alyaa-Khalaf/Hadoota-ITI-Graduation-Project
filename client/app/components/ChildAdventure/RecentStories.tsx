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
      <section className="mt-8">
        <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="
                flex items-center gap-4
                rounded-3xl p-4
                bg-cat-adventure/40
                border-[3px] border-primary/20
                animate-pulse
              "
            >
              <div className="w-12 h-12 rounded-2xl bg-white/50" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded-full bg-white/50" />
                <div className="h-3 w-1/3 rounded-full bg-white/40" />
                <div className="h-2 w-36 rounded-full bg-white/40" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!stories.length) {
    return (
      <section className="mt-8">
        <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            mt-6 flex flex-col items-center justify-center
            text-center gap-3
            rounded-3xl p-8
            bg-cat-adventure
            border-[3px] border-dashed border-primary
          "
        >
          <span className="text-5xl">📚</span>
          <h3 className="font-bold text-lg text-ink">
            لسه معملتش أي حدوتة
          </h3>
          <p className="text-sm text-ink-mute max-w-[220px]">
            ابدأ أول مغامرة وهنحطهالك هنا عشان ترجعلها في أي وقت
          </p>
   
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/characters")}
            className="
              mt-2 px-5 py-2.5
              rounded-2xl
              bg-primary text-white font-bold
              border-2 border-white
              shadow-md
            "
          >
            ابدأ حدوتة جديدة ✨
          </motion.button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <AdventureHeader header="حواديتك" subHeader="ارجع كمل مغامراتك 📚" />

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
              rounded-3xl p-4
              bg-cat-adventure
              border-[3px] border-primary
              shadow-lg
            "
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-4xl shrink-0">📖</span>

              <div className="min-w-0">
                <h3 className="font-bold text-lg text-ink truncate">
                  {story.title}
                </h3>

                <p className="text-sm text-ink-mute truncate">
                  {story.topic}
                </p>

                <div className="w-36 h-2 rounded-full bg-white/50 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${story.progress ?? 100}%` }}
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/stories/${story._id}`)}
              className="
                shrink-0 px-4 py-2
                rounded-2xl
                bg-sunny text-ink font-bold
                border-2 border-white
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