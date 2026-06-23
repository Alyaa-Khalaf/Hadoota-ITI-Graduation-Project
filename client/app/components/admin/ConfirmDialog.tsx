"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "تأكيد الحذف",
  message,
  confirmLabel = "احذف نهائياً",
  cancelLabel = "إلغاء",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-xl border border-[#E8DED4] max-w-sm w-full p-6 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-lg font-black text-[#3D2C1E] mb-2">{title}</h3>
            <p className="text-sm text-[#7A6552] mb-6 leading-relaxed">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-2.5 rounded-2xl border border-[#E8DED4] text-[#7A6552] font-bold text-sm hover:bg-gray-50 transition disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-2.5 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition disabled:opacity-50"
              >
                {loading ? "..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
