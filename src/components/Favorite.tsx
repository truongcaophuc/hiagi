"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FiltersState } from "./FiltersModal";
import { fetchJSON, getUserFavorites, Tool } from "../lib/api";
import ToolCard from "./ToolCard";

type Item = {
  id?: string | number;
  name: string;
  desc?: string;
  url?: string;
  image?: string;
  thumb?: string;
  tags?: string[];
  views?: number;
  pricing?: string;
  favs?: number;
};

function Card({ item }: { item?: Item }) {
  if (!item) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-gray-100 h-[270px]">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.1s_infinite]" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent)" }} />
        <style>{`@keyframes shimmer { to { transform: translateX(100%); } }`}</style>
      </div>
    );
  }
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow overflow-hidden flex flex-col transition hover:-translate-y-[2px] hover:border-[#F6B2C3] hover:shadow-lg">
      <a href={item.url} target="_blank" rel="noreferrer">
        {item.image || item.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="h-40 w-full object-cover" src={item.image || item.thumb} alt={item.name} />
        ) : (
          <div className="h-40 grid place-items-center text-[#7e1f39] font-extrabold" style={{ background: "linear-gradient(135deg,#FDE7ED,#fff)" }}>No Image</div>
        )}
      </a>
      <div className="p-3">
        <h3 className="text-lg font-extrabold mb-1 text-[#0F172A]">{item.name}</h3>
        <p className="text-sm text-[#64748B] line-clamp-2">{item.desc}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {(item.tags || []).slice(0, 3).map((t) => (
            <Link key={t} href={`/tags/${encodeURIComponent(String(t))}`} className="px-2 py-1 text-xs rounded-full border border-[#E5E7EB] bg-white text-[#334155]">#{t}</Link>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-3 pb-3 text-sm text-[#64748B]">
        <span> {(item.favs || 0).toLocaleString("en-US")}</span>
        <a href={item.url} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg border border-[#E5E7EB] bg-white font-semibold hover:bg-[#FDE7ED] text-[#C13B5D]">Visit</a>
      </div>
    </div>
  );
}

export default function FavoriteSection({ filters, mode = "global", query }: { filters?: FiltersState; mode?: "global" | "user"; query?: string }) {
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data, isLoading, isError } = useQuery<Item[] | Tool[], Error>({
    queryKey: [mode === "user" ? "user-favorites" : "global-favorites"],
    queryFn: async () => {
      if (mode === "user") {
        const tools = await getUserFavorites();
        return (Array.isArray(tools) ? tools : []).map((t: any) => ({
          id: t._id || t.id,
          name: t.name,
          desc: t.description || t.desc,
          url: t.url,
          thumb: t.imageUrl || t.thumb,
          tags: Array.isArray(t.tags) ? t.tags : [],
          pricing: t.pricing,
          favs: (t as any).favCount ?? 0,
        }));
      }
      const params = new URLSearchParams({ sortBy: "favCount", sortOrder: "desc", limit: "100" });
      const json = await fetchJSON<any>(`/api/tools?${params.toString()}`);
      const raw = Array.isArray(json) ? json : (json?.data?.tools ?? json?.data?.items ?? json?.items ?? json?.data ?? []);
      return (raw as Tool[]).map((t) => ({
        id: (t as any)._id ?? (t as any).id,
        name: t.name,
        desc: (t as any).description,
        url: t.url,
        image: (t as any).imageUrl,
        thumb: (t as any).imageUrl,
        tags: t.tags,
        pricing: (t as any).pricing,
        favs: (t as any).favCount ?? 0,
      }));
    },
    staleTime: 60_000,
  });

  const applyFilters = (items: Item[]): Item[] => {
    if (!filters) return items;
    let out = items;
    if (filters.pricing && filters.pricing.size) {
      const keys = Array.from(filters.pricing).map((s) => s.toLowerCase());
      out = out.filter((it) => keys.some((k) => String((it as any).pricing || "").toLowerCase().includes(k)));
    }
    if (filters.form && filters.form.size) {
      const keys = Array.from(filters.form).map((s) => s.toLowerCase());
      out = out.filter((it) => (it.tags || []).some((tag) => keys.includes(String(tag).toLowerCase())));
    }
    return out;
  };

  const items = useMemo(() => {
    const base = applyFilters(Array.isArray(data) ? (data as Item[]) : []);
    const q = (query || "").toLowerCase().trim();
    if (!q) return base;
    return base.filter((it) => {
      const name = it.name || "";
      const desc = it.desc || "";
      const tags = Array.isArray(it.tags) ? it.tags : [];
      return (
        name.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        tags.some((t) => String(t).toLowerCase().includes(q))
      );
    });
  }, [data, filters, query]);

  const visible = items.slice(0, page * pageSize);
  const hasMore = page * pageSize < items.length;

  return (
    <section className="px-5">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between my-8">
          <h2 className="text-[30px] font-extrabold">Favorite Tools</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Total: {items.length}</span>
          </div>
        </div>
        <div className="grid gap-4 w-full max-w-[1200px] mx-auto [grid-template-columns:repeat(4,minmax(0,1fr))] max-[1100px]:[grid-template-columns:repeat(3,1fr)] max-[860px]:[grid-template-columns:repeat(2,1fr)] max-[560px]:[grid-template-columns:1fr]">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <Card key={i} />)
            : visible.map((it, i) => (
                <ToolCard
                  key={String((it as any).id ?? i)}
                  item={{
                    id: (it as any).id,
                    name: (it as any).name,
                    desc: (it as any).desc,
                    url: (it as any).url,
                    tags: Array.isArray((it as any).tags) ? (it as any).tags : [],
                    pricing: (it as any).pricing,
                    thumb: (it as any).thumb || (it as any).image,
                    favCount: (it as any).favs,
                  }}
                  thumbShape="rect"
                />
              ))}
          {isError && (
            <div className="col-span-full text-center text-sm text-slate-500">Không tải được dữ liệu Most Favorite từ API.</div>
          )}
          {!isLoading && !items.length && (
            <div className="col-span-full text-center text-sm text-slate-500">Chưa có tool yêu thích nào.</div>
          )}
        </div>
        {hasMore && (
          <div className="text-center mt-4">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-3 rounded-xl font-extrabold text-[#2a0a14] shadow-[0_8px_24px_rgba(193,59,93,.25)] hover:shadow-[0_14px_34px_rgba(193,59,93,.35)] transition"
              style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
