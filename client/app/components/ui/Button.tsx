import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "sky" | "story-bg" | "outline" | "danger";
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  variant = "primary", 
  fullWidth = false,
  className = "", 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center rounded-full font-sans font-black text-base tracking-wide transition duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none py-4 px-10";
  
  const variants = {
    primary: "bg-primary text-white shadow-button hover:bg-primary/90",
    sky: "bg-sky text-white shadow-md hover:bg-sky/90",
    "story-bg": "bg-story-bg text-ink shadow-button hover:bg-page-warm",
    outline: "border-2 border-border-warm bg-transparent text-ink hover:bg-page-warm",
    danger: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-sm",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}