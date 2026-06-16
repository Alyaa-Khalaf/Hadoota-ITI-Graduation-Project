import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChild } from "@/hooks/useChild";
import Link from "next/link";

function ChildNavbar() {
    const { child } = useChild();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { label: "الرئيسية", icon: "🏠", href: "#" },
        { label: "المغامرات", icon: "🗺️", href: "#" },
        { label: "الألعاب", icon: "🏆", href: "/games/GamesHub" },
        { label: "الإعدادات", icon: "⚙️", href: "#" },
    ];

    return (
        <>
  <header
  dir="rtl"
  className="fixed top-3 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 px-5 py-3 rounded-3xl md:rounded-full bg-primary shadow-button"
>              

                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a
                        href="#"
                        className="flex items-center gap-2 no-underline shrink-0"
                    >
                        <span
                            className=" flex items-center justify-center w-11 h-11 rounded-full bg-yellow-300 text-2xl shadow-[0_4px_0_#ca8a04] animate-wiggle "
                        >
                            🛡️
                        </span>

                        <span
                            className=" text-2xl font-extrabold text-white drop-shadow-md "
                        >
                            بطل
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map(({ label, icon, href }) => (
                            <Link
                                key={label}
                                href={href}
                               className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white bg-white/15 border border-white/20 transition-all duration-200 hover:bg-white/25 hover:-translate-y-1 hover:scale-105"
                            >
                                <span className="text-xl">{icon}</span>
                                <span>{label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Avatar + Mobile Button */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="font-bold text-white text-sm drop-shadow">
                                {child?.name || "بطلنا!"}
                            </span>

                            <div className="relative">
                                <div
                                    className=" flex items-center justify-center w-11 h-11 rounded-full bg-white border-[3px] border-yellow-300 text-2xl shadow-[0_4px_0_#ca8a04] "
                                >
                                    🦸
                                </div>

                                <div
                                    className=" absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white animate-ping opacity-75 "
                                />

                                <div
                                    className="absolute bottom-0.5 right-0.5  w-3 h-3  rounded-full  bg-green-400  border-2 border-white "
                                />
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen((prev) => !prev)}
                           className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/15 border border-white/20 text-white text-xl font-bold transition-all hover:bg-white/25 hover:scale-110"
                        >
                            {isOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
           {/* Mobile Menu */}
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/40 z-30 md:hidden"
      />

      <motion.div
        dir="rtl"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25 }}
        className="fixed top-20 left-50 -translate-x-1/2 w-[92%] z-40 md:hidden bg-white rounded-3xl shadow-2xl border border-primary overflow-hidden"
      >
        <div className="p-4">
          {navItems.map(({ label, icon, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-4 rounded-2xl text-ink font-bold transition-all duration-200 hover:bg-primary hover:text-white"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-base">{label}</span>
            </a>
          ))}

          <div className="mt-3 pt-4 border-t border-gray-200 flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 border-2 border-yellow-400 text-2xl">
              🦸
            </div>

            <div>
              <p className="font-extrabold text-gray-900">
                {child?.name || "بطلنا!"}
              </p>

              <p className="text-sm text-gray-500">
                جاهز للمغامرة! 🚀
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
        </>
    );
}

export default ChildNavbar;