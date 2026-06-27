"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/utils/api";
import type { ListParams, Paginated } from "@/services/adminService";

interface UseCrudArgs<T> {
  fetcher: (params: ListParams) => Promise<Paginated<T>>;
  remover?: (id: string) => Promise<unknown>;
}

export function useCrudSection<T>({ fetcher, remover }: UseCrudArgs<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFiltersState] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const setFilter = useCallback((key: string, value: string) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: ListParams = { page, search: search || undefined };
      for (const [key, value] of Object.entries(filters)) {
        if (value) params[key] = value;
      }
      const data = await fetcher(params);
      setRows(data.items);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError(getApiErrorMessage(err, "تعذر تحميل البيانات"));
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, search, filters]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = useCallback(
    async (id: string) => {
      if (!remover) return;
      await remover(id);
      await load();
    },
    [remover, load]
  );

  return {
    rows,
    page,
    totalPages,
    total,
    loading,
    error,
    filters,
    setPage,
    setSearch,
    setFilter,
    reload: load,
    remove,
  };
}
