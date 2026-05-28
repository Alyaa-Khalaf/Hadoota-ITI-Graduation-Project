import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function Card({ children, className = "", hoverEffect = true }: CardProps) {
  return (
    <div 
      className={`rounded-3xl bg-white p-8 border border-border-warm/30 shadow-sm transition duration-300 ${
        hoverEffect ? "hover:-translate-y-1.5 hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}