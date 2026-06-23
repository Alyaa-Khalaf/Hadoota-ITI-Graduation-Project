import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "sunny" | "dreamy" | "sky" | "dark";
}

export default function Badge({ children, variant = "sunny" }: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black font-sans select-none";
  
  const variants = {
    sunny: "bg-sunny/20 text-ink",
    dreamy: "bg-page-dreamy/80 text-magic",
    sky: "bg-page-sky text-sky",
    dark: "bg-black/15 text-white/95",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </div>
  );
}