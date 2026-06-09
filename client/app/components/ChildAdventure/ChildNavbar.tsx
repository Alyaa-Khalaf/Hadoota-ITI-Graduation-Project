import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChild } from "@/hooks/useChild";

function ChildNavbar() {
    const { child } = useChild();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { label: "الرئيسية", icon: "🏠", href: "#" },
        { label: "المغامرات", icon: "🗺️", href: "#" },
        { label: "الإنجازات", icon: "🏆", href: "#" },
        { label: "الإعدادات", icon: "⚙️", href: "#" },
    ];

    return (
        <>
            <header
                dir="rtl"
                className="
                    fixed top-3 left-1/2 -translate-x-1/2
                    w-[95%] max-w-7xl
                    z-50
                    px-5 py-3
                    rounded-3xl md:rounded-full
                    bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400
                    backdrop-blur-md
                    shadow-[0_6px_0px_rgba(109,40,217,0.35),0_10px_28px_rgba(99,102,241,0.3)]
                "
            >
                {/* Floating Stars */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                    {["⭐", "✨", "⭐"].map((star, index) => (
                        <span
                            key={index}
                            className="text-sm animate-bounce"
                            style={{
                                animationDelay: `${index * 0.25}s`,
                            }}
                        >
                            {star}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a
                        href="#"
                        className="flex items-center gap-2 no-underline shrink-0"
                    >
                        <span
                            className="
                                flex items-center justify-center
                                w-11 h-11
                                rounded-full
                                bg-yellow-300
                                text-2xl
                                shadow-[0_4px_0_#ca8a04]
                                animate-wiggle
                            "
                        >
                            🛡️
                        </span>

                        <span
                            className="
                                text-2xl
                                font-extrabold
                                text-white
                                drop-shadow-[0_2px_0_rgba(109,40,217,0.6)]
                            "
                        >
                            بطل
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map(({ label, icon, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="
                                    flex items-center gap-2
                                    px-4 py-2
                                    rounded-full
                                    font-bold
                                    text-white
                                    bg-white/20
                                    border-2 border-white/30
                                    transition-all duration-200
                                    hover:bg-white/35
                                    hover:-translate-y-1
                                    hover:scale-105
                                    hover:shadow-[0_6px_0_rgba(109,40,217,0.3)]
                                "
                            >
                                <span className="text-xl">{icon}</span>
                                <span>{label}</span>
                            </a>
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
                                    className="
                                        flex items-center justify-center
                                        w-11 h-11
                                        rounded-full
                                        bg-white
                                        border-[3px]
                                        border-yellow-300
                                        text-2xl
                                        shadow-[0_4px_0_#ca8a04]
                                    "
                                >
                                    🦸
                                </div>

                                <div
                                    className="
                                        absolute bottom-0.5 right-0.5
                                        w-3 h-3
                                        rounded-full
                                        bg-green-400
                                        border-2 border-white
                                        animate-ping
                                        opacity-75
                                    "
                                />

                                <div
                                    className="
                                        absolute bottom-0.5 right-0.5
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
                                flex items-center justify-center
                                w-10 h-10
                                rounded-full
                                bg-white/20
                                border-2 border-white/40
                                text-white
                                text-xl
                                font-bold
                                transition-all
                                hover:bg-white/35
                                hover:scale-110
                            "
                        >
                            {isOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 z-30 md:hidden"
                        />

                        <motion.div
                            dir="rtl"
                            initial={{
                                opacity: 0,
                                y: -16,
                                scale: 0.95,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -16,
                                scale: 0.95,
                            }}
                            transition={{
                                duration: 0.22,
                                ease: "easeOut",
                            }}
                            className="
                                fixed top-24 left-1/2 -translate-x-1/2
                                w-[92%]
                                z-40
                                md:hidden
                                rounded-[28px]
                                bg-white
                                overflow-hidden
                                border-2 border-violet-200
                                shadow-[0_8px_0_rgba(109,40,217,0.2),0_12px_36px_rgba(99,102,241,0.2)]
                            "
                        >
                            <div className="flex flex-col p-3">
                                {navItems.map(({ label, icon, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        onClick={() => setIsOpen(false)}
                                        className="
                                            flex items-center gap-3
                                            px-4 py-3.5
                                            rounded-2xl
                                            font-bold
                                            text-violet-900
                                            text-base
                                            transition-all duration-150
                                            hover:bg-gradient-to-r
                                            hover:from-violet-50
                                            hover:to-blue-50
                                            hover:-translate-x-1
                                        "
                                    >
                                        <span className="text-2xl">
                                            {icon}
                                        </span>

                                        <span>{label}</span>
                                    </a>
                                ))}

                                {/* Footer */}
                                <div
                                    className="
                                        mt-2 pt-3
                                        border-t-2
                                        border-dashed
                                        border-violet-200
                                        flex items-center gap-3
                                        pr-2
                                    "
                                >
                                    <div
                                        className="
                                            flex items-center justify-center
                                            w-12 h-12
                                            rounded-full
                                            bg-violet-100
                                            border-[3px]
                                            border-yellow-300
                                            text-2xl
                                        "
                                    >
                                        🦸
                                    </div>

                                    <div>
                                        <p className="font-extrabold text-violet-900">
                                            {child?.name || "بطلنا!"}
                                        </p>

                                        <p className="text-sm text-violet-500">
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