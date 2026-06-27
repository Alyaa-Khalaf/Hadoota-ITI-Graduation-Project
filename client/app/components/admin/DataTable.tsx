"use client";

import { useState } from "react";
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, Plus, Eye } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableFilter {
  key: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onSearch?: (q: string) => void;
  filters?: TableFilter[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCreate?: () => void;
  createLabel?: string;
  rowKey: (row: T) => string;
  emptyText?: string;
}

export default function DataTable<T>(props: DataTableProps<T>) {
  const {
    columns, rows, loading = false, page, totalPages, total,
    onPageChange, onSearch, filters = [], onView, onEdit, onDelete, onCreate,
    createLabel = "إضافة جديد", rowKey, emptyText = "لا توجد بيانات حالياً",
  } = props;
  const [query, setQuery] = useState("");
  const hasActions = Boolean(onView || onEdit || onDelete);
  const colSpan = columns.length + (hasActions ? 1 : 0);
  const prevDisabled = page < 2;
  const nextDisabled = page === totalPages || page > totalPages;

  return (
    <div className="bg-white rounded-3xl border border-[#E8DED4] shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 p-4 border-b border-[#E8DED4]">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {onSearch && (
            <form onSubmit={(e) => { e.preventDefault(); onSearch(query); }} className="relative flex-1 max-w-xs">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6552]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث..." className="w-full pr-9 pl-3 py-2 rounded-2xl border border-[#E8DED4] text-sm bg-[#FFFBF0] focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40" />
            </form>
          )}
          {onCreate && (
            <button onClick={onCreate} className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FF7043] text-white font-bold text-sm hover:bg-[#E65F33] transition shrink-0">
              <Plus size={16} /> {createLabel}
            </button>
          )}
        </div>

        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <div key={filter.key} className="flex items-center gap-2">
                <label className="text-xs font-bold text-[#7A6552] whitespace-nowrap">
                  {filter.label}:
                </label>
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#E8DED4] text-xs font-bold bg-[#FFFBF0] text-[#3D2C1E] focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40"
                >
                  <option value="">الكل</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-[#FFF5E6] text-[#7A6552]">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-xs font-black whitespace-nowrap">{col.header}</th>
              ))}
              {hasActions && <th className="px-4 py-3 text-xs font-black">إجراءات</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0E9E0]">
            {loading ? (
              <tr><td colSpan={colSpan} className="px-4 py-12 text-center text-[#7A6552] text-sm font-bold animate-pulse">جاري التحميل...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={colSpan} className="px-4 py-12 text-center text-[#7A6552] text-sm font-bold">{emptyText}</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="hover:bg-[#FFFBF0] transition">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-[#3D2C1E] whitespace-nowrap">{col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "—")}</td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {onView && (
                          <button onClick={() => onView(row)} className="p-1.5 rounded-lg text-[#7A6552] hover:bg-[#FFF5E6] transition" title="التفاصيل">
                            <Eye size={16} />
                          </button>
                        )}
                        {onEdit && <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition" title="تعديل"><Pencil size={16} /></button>}
                        {onDelete && <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition" title="حذف"><Trash2 size={16} /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-[#E8DED4] text-xs text-[#7A6552]">
        <span className="font-bold">الإجمالي: {total}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onPageChange(page - 1)} disabled={prevDisabled} className="p-1.5 rounded-lg border border-[#E8DED4] disabled:opacity-40 hover:bg-[#FFF5E6] transition"><ChevronRight size={16} /></button>
          <span className="font-black">{page} / {totalPages}</span>
          <button onClick={() => onPageChange(page + 1)} disabled={nextDisabled} className="p-1.5 rounded-lg border border-[#E8DED4] disabled:opacity-40 hover:bg-[#FFF5E6] transition"><ChevronLeft size={16} /></button>
        </div>
      </div>
    </div>
  );
}
