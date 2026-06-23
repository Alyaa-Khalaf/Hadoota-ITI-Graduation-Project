"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface FormField {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "select" | "textarea" | "password";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface FormModalProps {
  open: boolean;
  title: string;
  fields: FormField[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading?: boolean;
  submitLabel?: string;
  errorMessage?: string;
}

export default function FormModal({
  open,
  title,
  fields,
  values,
  onChange,
  onSubmit,
  onClose,
  loading = false,
  submitLabel = "حفظ",
  errorMessage,
}: FormModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-xl border border-[#E8DED4] max-w-lg w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b border-[#E8DED4] sticky top-0 bg-white">
              <h3 className="text-lg font-black text-[#3D2C1E]">{title}</h3>
              <button onClick={onClose} className="text-[#7A6552] hover:text-[#3D2C1E] transition">
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              className="p-5 space-y-4"
            >
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-black text-[#3D2C1E] mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-400"> *</span>}
                  </label>
                  {field.type === "select" ? (
                    <select
                      value={values[field.name] ?? ""}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full p-2.5 rounded-2xl border border-[#E8DED4] text-sm bg-[#FFFBF0] focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40"
                    >
                      <option value="">— اختر —</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={values[field.name] ?? ""}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      required={field.required}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full p-2.5 rounded-2xl border border-[#E8DED4] text-sm bg-[#FFFBF0] focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 resize-none"
                    />
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      value={values[field.name] ?? ""}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="w-full p-2.5 rounded-2xl border border-[#E8DED4] text-sm bg-[#FFFBF0] focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40"
                    />
                  )}
                </div>
              ))}

              {errorMessage && (
                <p className="text-red-500 text-xs font-bold text-center">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-[#FF7043] text-white font-black text-sm hover:bg-[#E65F33] transition disabled:opacity-50 mt-2"
              >
                {loading ? "جاري الحفظ..." : submitLabel}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

