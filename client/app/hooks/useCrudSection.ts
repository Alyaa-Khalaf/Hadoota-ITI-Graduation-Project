"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/utils/api";
import type { Paginated } from "@/services/adminService";

interface UseCrudArgs<T> {
  fetcher: (params: { page: number; search?: string }) => Promise<Paginated<T>>;
  remover?: (id: string) => Promise<unknown>;
}

export function useCrudSection<T>({ fetcher, remover }: UseCrudArgs<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetcher({ page, search: search || undefined });
      setRows(data.items);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError(getApiErrorMessage(err, "تعذر تحميل البيانات"));
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, search]);

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
    rows, page, totalPages, total, loading, error,
    setPage, setSearch, reload: load, remove,
  };
}
