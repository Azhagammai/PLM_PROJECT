// ============================================================
//  React-Query hooks — wrap every API call with caching,
//  loading states and error handling automatically.
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAnalytics,
  getRecentParts,
  getParts,
  searchParts,
  generatePart,
  deletePart,
  updatePartStatus,
  GeneratePartRequest,
} from "@/lib/api";

// ── Query keys ───────────────────────────────────────────────
export const KEYS = {
  analytics: ["analytics"] as const,
  recent:    ["parts", "recent"] as const,
  parts:     (page: number, size: number) => ["parts", page, size] as const,
  search:    (q: string, status: string, category: string, page: number) =>
               ["parts", "search", q, status, category, page] as const,
};

// ── Dashboard ────────────────────────────────────────────────
export function useAnalytics() {
  return useQuery({
    queryKey: KEYS.analytics,
    queryFn: getAnalytics,
    staleTime: 30_000,
  });
}

export function useRecentParts() {
  return useQuery({
    queryKey: KEYS.recent,
    queryFn: getRecentParts,
    staleTime: 15_000,
  });
}

// ── Parts list (paginated) ────────────────────────────────────
export function useParts(page = 0, size = 20) {
  return useQuery({
    queryKey: KEYS.parts(page, size),
    queryFn: () => getParts(page, size),
    staleTime: 15_000,
  });
}

// ── Search & filter ───────────────────────────────────────────
export function useSearchParts(
  q: string,
  status: string,
  category: string,
  page = 0
) {
  return useQuery({
    queryKey: KEYS.search(q, status, category, page),
    queryFn: () => searchParts(q, status, category, page),
    staleTime: 10_000,
  });
}

// ── Generate mutation ─────────────────────────────────────────
export function useGeneratePart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: GeneratePartRequest) => generatePart(req),
    onSuccess: () => {
      // Invalidate cached lists so they refresh
      qc.invalidateQueries({ queryKey: ["parts"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

// ── Delete mutation ───────────────────────────────────────────
export function useDeletePart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePart(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parts"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

// ── Status update mutation ────────────────────────────────────
export function useUpdatePartStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updatePartStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parts"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
