"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface DetailField {
  label: string;
  value: React.ReactNode;
}

interface DetailModalProps {
  open: boolean;
  title: string;
  fields: DetailField[];
  loading?: boolean;
  onClose: () => void;
}

export default function DetailModal({
  open,
  title,
  fields,
  loading = false,
  onClose,
}: DetailModalProps) {
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
            <div className="flex items-center justify-between p-5 border-b border-[#E8DED4] sticky top-0 bg-white z-10">
              <h3 className="text-lg font-black text-[#3D2C1E]">{title}</h3>
              <button onClick={onClose} className="text-[#7A6552] hover:text-[#3D2C1E] transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              {loading ? (
                <p className="text-center text-[#7A6552] text-sm font-bold animate-pulse py-8">
                  جاري تحميل التفاصيل...
                </p>
              ) : (
                <dl className="space-y-3">
                  {fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-[#F0E9E0] last:border-0"
                    >
                      <dt className="text-xs font-black text-[#7A6552] sm:w-32 shrink-0">
                        {field.label}
                      </dt>
                      <dd className="text-sm text-[#3D2C1E] font-medium break-words flex-1">
                        {field.value ?? "—"}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
