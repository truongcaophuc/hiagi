"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ToolCard from "./ToolCard";
import { extractList, extractTotal, getTools, Tool } from "../lib/api";

type UiTool = {
  id?: string | number;
  name?: string;
  desc?: string;
  tags?: string[];
  thumb?: string;
  views?: number;
  url?: string;
  pricing?: string;
  favCount?: number;
  updatedAt?: string;
  useCases?: string[];
};

export default function ToolsGrid({ query, pricing, form, activeTag, thumbShape = "rect" }: { query: string; pricing: string; form: string; activeTag?: string; thumbShape?: "rect" | "circle" }) {
  const [items, setItems] = useState<UiTool[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const prevFilterKey = useRef("");
  useEffect(() => {
    const key = JSON.stringify({ query, pricing, form, activeTag });
    if (prevFilterKey.current !== key) {
      prevFilterKey.current = key;
      //setItems([]);
      setPage(1);
      setHasMore(true);
    }
  }, [query, pricing, form, activeTag]);
  // Tag dùng cho API: giữ nguyên chữ hoa, chỉ thay '-' thành khoảng trắng
  const apiTag = (activeTag || "").replace(/-/g, " ").trim() || undefined;
  const fetchLimit = activeTag ? 100 : limit;
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["tools", { page, limit: fetchLimit, query, tags: apiTag }],
    queryFn: () => {
      const params = {
        page,
        limit: fetchLimit,
        // Fallback: nếu không nhập tìm kiếm, dùng giá trị tag cho search
        search: (query && query.trim()) ? query : apiTag,
        tags: apiTag,
        sortBy: "createdAt" as const,
        sortOrder: "desc" as const,
      };
      return getTools(params);
    },
    staleTime: 30_000,
  });

  useEffect(() => {
    setLoading(isLoading || isFetching);
    setErr(error ? (error as any).message || "Fetch failed" : "");
    const list = extractList<Tool>(data || {});
    const mapped: UiTool[] = list.map((t: any) => ({
      id: t._id || t.id || t.slug,
      name: t.name,
      desc: t.description,
      // Ensure tags is an array; support string or comma-separated values
      tags: Array.isArray(t.tags)
        ? t.tags
        : typeof t.tags === "string"
        ? t.tags
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      thumb: t.imageUrl,
      views: t.viewCount,
      url: t.url,
      pricing: t.pricing,
      favCount: t.favCount,
      updatedAt: t.updatedAt,
      useCases: Array.isArray(t.useCases) ? t.useCases : undefined,
    }));
    setItems((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
    const total = extractTotal(data || {});
    if (activeTag) {
      setHasMore(false);
    } else {
      if (typeof total === "number") {
        const loaded = (page - 1) * limit + list.length;
        setHasMore(loaded < total);
      } else {
        setHasMore(list.length === limit);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isLoading, isFetching]);

  const filtered = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const q = (query || "").toLowerCase().trim();
    const actTag = (activeTag || "").toLowerCase().trim();
    return items.filter((it) => {
      const name = it.name || "";
      const desc = it.desc || "";
      const tags = Array.isArray(it.tags) ? it.tags : [];
      const matchText = !q || name.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || tags.some((t: any) => String(t).toLowerCase().includes(q));
      const priceStr = (it.pricing || "").toString().toLowerCase();
      const matchPrice = !pricing || pricing === "All Pricing" ? true : priceStr.includes(pricing.toLowerCase());
      const matchForm = !form || form === "All Forms" ? true : tags.some((t: any) => String(t).toLowerCase() === form.toLowerCase());
      // When activeTag is set, we already filtered via API, so don't over-filter locally
      const matchTag = !actTag ? true : true;
      return matchText && matchPrice && matchForm && matchTag;
    });
  }, [items, query, pricing, form, activeTag]);
  return (
    <section className="py-6">
      {err && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">Lỗi tải tools: {err}</div>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item: UiTool, idx: number) => (
          <ToolCard
            key={item.id || idx}
            item={{
              id: item.id as any,
              name: item.name as any,
              desc: item.desc as any,
              tags: item.tags as any,
              thumb: item.thumb as any,
              views: item.views as any,
              url: item.url as any,
              pricing: item.pricing as any,
              favCount: item.favCount as any,
              updatedAt: item.updatedAt as any,
              useCases: item.useCases as any,
            }}
            thumbShape={thumbShape}
          />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        {hasMore && !loading && (
          <button onClick={() => setPage((v) => v + 1)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Load More Tools
          </button>
        )}
        {loading && <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">Đang tải…</div>}
      </div>
    </section>
  );
}