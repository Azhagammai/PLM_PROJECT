// ============================================================
//  API Service — connects the React frontend to Spring Boot backend
//  Base URL: http://localhost:8080/api  (proxied via Vite → /api)
// ============================================================

const BASE = "/api";

// ── Types matching PartResponse.java ────────────────────────
export interface Part {
  id: number;
  partNumber: string;
  description: string;
  category: string;
  subcategory: string;
  material: string;
  plant: string;
  revision: string;
  status: "IN_REVIEW" | "RELEASED" | "OBSOLETE";
  owner: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

// ── Types matching GeneratePartRequest.java ──────────────────
export interface GeneratePartRequest {
  category: string;
  subcategory: string;
  material: string;
  plant: string;
  revision?: string;
  description: string;
  owner?: string;
}

// ── Backend wrapper shape: ApiResponse<T> ───────────────────
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Spring Page<T> shape ─────────────────────────────────────
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ── Analytics shape (from /api/analytics) ───────────────────
export interface Analytics {
  total: number;
  released: number;
  inReview: number;
  obsolete: number;
  currentSerial: number;
  byCategory: Record<string, number>;
  recent: Part[];
}

// ── Generic fetch helper ─────────────────────────────────────
async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }

  const json: ApiResponse<T> = await res.json();
  return json.data;
}

// ── API methods ──────────────────────────────────────────────

/** Health check */
export const healthCheck = () =>
  request<{ status: string; service: string; version: string }>("/health");

/** Generate + save a new part number */
export const generatePart = (body: GeneratePartRequest) =>
  request<Part>("/parts/generate", {
    method: "POST",
    body: JSON.stringify(body),
  });

/** Paginated list of all parts */
export const getParts = (page = 0, size = 20) =>
  request<Page<Part>>(`/parts?page=${page}&size=${size}`);

/** Get a single part by database ID */
export const getPartById = (id: number) =>
  request<Part>(`/parts/${id}`);

/** Get a single part by its part-number string */
export const getPartByNumber = (partNumber: string) =>
  request<Part>(`/parts/number/${encodeURIComponent(partNumber)}`);

/** Search + filter parts */
export const searchParts = (
  q = "",
  status = "",
  category = "",
  page = 0,
  size = 20
) =>
  request<Page<Part>>(
    `/parts/search?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&category=${encodeURIComponent(category)}&page=${page}&size=${size}`
  );

/** Last 10 recently created parts */
export const getRecentParts = () =>
  request<Part[]>("/parts/recent");

/** Update the status of a part */
export const updatePartStatus = (id: number, status: string) =>
  request<Part>(`/parts/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

/** Delete a part */
export const deletePart = (id: number) =>
  request<void>(`/parts/${id}`, { method: "DELETE" });

/** Dashboard analytics */
export const getAnalytics = () =>
  request<Analytics>("/analytics");
