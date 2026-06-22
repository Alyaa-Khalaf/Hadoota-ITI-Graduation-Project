"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChild } from "@/hooks/useChild";
import Link from "next/link";

import {
    Home,
    Compass,
    Gamepad2,
    Settings,
    Menu,
    X,
    Shield,
} from "lucide-react";

export default function ChildNavbar() {
    const { child } = useChild();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        {
            label: "الرئيسية",
            icon: Home,
            href: "/childAdventure",
        },
        {
            label: "المغامرات",
            icon: Compass,
            href: "/childAdventure",
        },
        {
            label: "الألعاب",
            icon: Gamepad2,
            href: "/games/GamesHub",
        },
        {
            label: "الإعدادات",
            icon: Settings,
            href: "/dashboard",
        },
    ];

    return (
        <>
            <header
                dir="rtl"
                className="
fixed top-4 left-1/2 -translate-x-1/2
z-50
w-[95%] max-w-7xl

      rounded-full
      border border-white/20

      bg-gradient-to-r
      from-primary/95
      via-primary
      to-primary/95

      backdrop-blur-xl
      shadow-[0_10px_35px_rgba(0,0,0,0.18)]

      px-5 py-3
    "
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/childAdventure"
                        className="flex items-center gap-3 shrink-0"
                    >
                        <motion.div
                            whileHover={{
                                rotate: 10,
                                scale: 1.08,
                            }}
                            className="
            w-12 h-12
            rounded-full
            flex items-center justify-center

            bg-gradient-to-br
            from-yellow-300
            via-yellow-400
            to-orange-400

            shadow-lg
          "
                        >
                            <Shield
                                size={24}
                                className="text-white"
                                strokeWidth={2.5}
                            />
                        </motion.div>

                        <div className="hidden sm:block">
                            <h2 className="text-white text-2xl font-black">
                                بطل
                            </h2>

                            <p className="text-white/70 text-xs">
                                عالم المغامرات
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="
                group

                flex items-center gap-2

                px-5 py-3

                rounded-full

                text-white/90
                font-bold

                transition-all duration-300

                hover:bg-white/15
                hover:text-white
                hover:-translate-y-1
              "
                                >
                                    <Icon
                                        size={18}
                                        className="transition-transform group-hover:scale-110"
                                    />

                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Area */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="text-right">
                                <p className="font-black text-white">
                                    {child?.name || "بطلنا"}
                                </p>

                                <p className="text-xs text-white/70">
                                    جاهز للمغامرة 🚀
                                </p>
                            </div>

                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="
                w-12 h-12
                rounded-full

                bg-gradient-to-br
                from-yellow-300
                to-orange-400

                flex items-center justify-center

                text-xl
                shadow-lg
              "
                                >
                                    🦸
                                </motion.div>

                                <span
                                    className="
                absolute bottom-0 right-0

                w-3 h-3
                rounded-full

                bg-green-400
                border-2 border-white
              "
                                />
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="
            md:hidden

            w-11 h-11
            rounded-full

            bg-white/10
            border border-white/20

            flex items-center justify-center

            text-white
          "
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="
            fixed inset-0
            bg-black/40
            backdrop-blur-sm
            z-40
            md:hidden
          "
                        />

                        <motion.div
                            dir="rtl"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                duration: 0.3,
                            }}
                            className="
            fixed top-0 right-0

            h-screen
            w-[300px]

            bg-white

            z-50

            shadow-2xl

            p-6
          "
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div
                                    className="
                w-14 h-14
                rounded-full

                bg-gradient-to-br
                from-yellow-300
                to-orange-400

                flex items-center justify-center

                text-3xl
              "
                                >
                                    🦸
                                </div>

                                <div>
                                    <h3 className="font-black text-lg">
                                        {child?.name || "بطلنا"}
                                    </h3>

                                    <p className="text-gray-500 text-sm">
                                        جاهز للمغامرة 🚀
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="
                    flex items-center gap-3

                    px-4 py-4

                    rounded-2xl

                    font-bold

                    text-gray-700

                    transition-all duration-200

                    hover:bg-primary
                    hover:text-white
                  "
                                        >
                                            <Icon size={20} />

                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>

    );
}