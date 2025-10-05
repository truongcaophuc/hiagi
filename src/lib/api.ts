export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export type Tool = {
  _id?: string;
  id?: string | number;
  name: string;
  slug?: string;
  description?: string;
  useCases?: string[];
  url?: string;
  pricing?: string;
  tags?: string[];
  imageUrl?: string;
  mostUsed?: number;
  favCount?: number;
  viewCount?: number;
  isPublic?: boolean;
  isFeatured?: boolean;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
};

type PaginatedResponse<T> = {
  success?: boolean;
  data?: T[] | { items?: T[]; docs?: T[] } | any;
  pagination?: { total?: number; totalPages?: number; currentPage?: number };
  total?: number;
  totalDocs?: number;
};

export function extractList<T>(json: any): T[] {
  if (Array.isArray(json)) return json as T[];
  const data = json?.data ?? json;
  if (Array.isArray(data)) return data as T[];
  const candidates = [
    "items",
    "docs",
    "results",
    "rows",
    "list",
    "tags",
    "tools",
    "courses",
    "prompts",
    "tutorials",
    "data",
  ];
  for (const k of candidates) {
    const vTop = (json as any)?.[k];
    if (Array.isArray(vTop)) return vTop as T[];
  }
  for (const k of candidates) {
    const vData = (data as any)?.[k];
    if (Array.isArray(vData)) return vData as T[];
  }
  if (Array.isArray((data as any)?.pagination?.items)) return (data as any).pagination.items as T[];
  if (Array.isArray((data as any)?.pagination?.docs)) return (data as any).pagination.docs as T[];
  return [];
}

export function extractTotal(json: any): number | undefined {
  const data = json?.data ?? json;
  const guesses = [
    (json as any)?.total,
    (json as any)?.totalDocs,
    (json as any)?.pagination?.total,
    (json as any)?.meta?.total,
    (data as any)?.total,
    (data as any)?.totalDocs,
    (data as any)?.pagination?.total,
    (data as any)?.meta?.total,
  ].filter((v) => typeof v === "number");
  return guesses.length ? (guesses[0] as number) : undefined;
}

// Courses
export type Course = {
  _id?: string;
  id?: string | number;
  title: string;
  slug?: string;
  description?: string;
  courseUrl?: string;
  thumbnailUrl?: string;
  instructor?: string;
  provider?: string;
  duration?: string | number;
  level?: string;
  price?: number | string;
  originalPrice?: number;
  isFree?: boolean;
  rating?: number;
  reviewCount?: number;
  enrollmentCount?: number;
  tags?: string[];
};

export async function getCourses(params: { page?: number; limit?: number; search?: string; level?: string; isFree?: boolean; tags?: string; isFeatured?: boolean }): Promise<PaginatedResponse<Course> | any> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  if (params.level && params.level !== "All Levels") q.set("level", params.level);
  if (typeof params.isFree === "boolean") q.set("isFree", String(params.isFree));
  if (params.tags) q.set("tags", params.tags);
  if (typeof params.isFeatured === "boolean") q.set("isFeatured", String(params.isFeatured));
  return fetchJSON(`/api/courses?${q.toString()}`);
}

// Prompts
export type Prompt = {
  _id?: string;
  id?: string | number;
  title: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  promptUrl?: string;
  promptContent?: string;
  fieldTags?: string[];
  toolTags?: string[];
  usageCount?: number;
  viewCount?: number;
  isPublic?: boolean;
  isFeatured?: boolean;
  source?: string;
  tool?: string;
};

export async function getPrompts(params: { page?: number; limit?: number; search?: string; category?: string; tags?: string; isFeatured?: boolean }): Promise<PaginatedResponse<Prompt> | any> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  if (params.category) q.set("category", params.category);
  if (params.tags) q.set("tags", params.tags);
  if (typeof params.isFeatured === "boolean") q.set("isFeatured", String(params.isFeatured));
  return fetchJSON(`/api/prompts?${q.toString()}`);
}

// Tutorials
export type Tutorial = {
  _id?: string;
  id?: string | number;
  title: string;
  slug?: string;
  description?: string;
  youtubeUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  toolUrl?: string;
  duration?: number; // seconds
  tags?: string[];
  viewCount?: number;
};

export async function getTutorials(params: { page?: number; limit?: number; search?: string; tags?: string; isFeatured?: boolean }): Promise<PaginatedResponse<Tutorial> | any> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  if (params.tags) q.set("tags", params.tags);
  if (typeof params.isFeatured === "boolean") q.set("isFeatured", String(params.isFeatured));
  return fetchJSON(`/api/tutorials?${q.toString()}`);
}

// Tools
export async function getTools(params: { page?: number; limit?: number; search?: string; tags?: string; sortBy?: string; sortOrder?: "asc" | "desc"; isFeatured?: boolean }): Promise<PaginatedResponse<Tool> | any> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.search) q.set("search", params.search);
  if (params.tags) q.set("tags", params.tags);
  if (params.tags) q.set("tag", params.tags); // compat
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortOrder) q.set("sortOrder", params.sortOrder);
  if (typeof params.isFeatured === "boolean") q.set("isFeatured", String(params.isFeatured));
  return fetchJSON(`/api/tools?${q.toString()}`);
}

// Favorites (local, non-auth)
export type FavItem = {
  id?: string | number;
  name?: string;
  desc?: string;
  url?: string;
  thumb?: string;
  tags?: string[];
  views?: number;
  pricing?: string;
  updatedAt?: string;
};

export async function getFavorites(): Promise<FavItem[]> {
  return fetchJSON<FavItem[]>(`/api/favorites`);
}

export async function addFavorite(item: FavItem): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function removeFavorite(id: string | number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/api/favorites?id=${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

// Backend JWT favorites via User collection
import { getAuthToken } from "./auth";

export async function getUserFavorites(): Promise<Tool[]> {
  const token = getAuthToken();
  if (!token) {
    console.warn("[getUserFavorites] No auth token found");
  } else {
    console.log("[getUserFavorites] Using auth token:", token);
  }
  const res = await fetch(`${API_BASE}/api/users/me/favorites`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const list = Array.isArray((json as any)?.favorites) ? (json as any).favorites : Array.isArray(json) ? (json as any) : [];
  return list as Tool[];
}

export async function addUserFavorite(toolId: string): Promise<{ success: boolean }> {
  const token = getAuthToken();
  if (!token) {
    console.warn("[addUserFavorite] No auth token found");
  } else {
    console.log("[addUserFavorite] Using auth token:", token, "toolId:", toolId);
  }
  const res = await fetch(`${API_BASE}/api/users/me/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ toolId }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function removeUserFavorite(toolId: string): Promise<{ success: boolean }> {
  const token = getAuthToken();
  if (!token) {
    console.warn("[removeUserFavorite] No auth token found");
  } else {
    console.log("[removeUserFavorite] Using auth token:", token, "toolId:", toolId);
  }
  const res = await fetch(`${API_BASE}/api/users/me/favorites/${encodeURIComponent(toolId)}` , {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}
