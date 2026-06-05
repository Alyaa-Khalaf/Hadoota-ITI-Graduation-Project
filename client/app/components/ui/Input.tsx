import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = "", id, ...props }: InputProps) {
  return (
    <div className="w-full text-right font-sans">
      {/* الـ Label العلوي باللون الدافئ */}
      <label htmlFor={id} className="block text-sm font-black text-ink mb-2">
        {label}
      </label>
      
      {/* حقل الإدخال بتنسيق ناعم ومتناسق */}
      <input
        id={id}
        className={`w-full rounded-2xl border bg-story-bg/40 px-5 py-3.5 text-sm font-bold text-ink outline-none transition duration-200 placeholder:text-ink-muted/50 focus:bg-white ${
          error 
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
            : "border-border-warm focus:border-primary focus:ring-1 focus:ring-primary"
          } ${className}`}
        {...props}
      />
      
      {/* رسالة الخطأ إن وُجدت */}
      {error && (
        <p className="mt-1.5 text-xs font-black text-red-500 animate-fadeIn">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}