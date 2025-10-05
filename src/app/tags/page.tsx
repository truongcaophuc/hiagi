"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SectionShell from "../../components/SectionShell";
import PageDot from "../../components/PageDot";
import TagChip from "../../components/TagChip";
import { FiTag } from "react-icons/fi";
import { fetchJSON, extractList } from "../../lib/api";
import TagCard from "../../components/TagCard"; 

type TagStat = { name: string; count: number };

export default function TagsPage() {
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState(q);
  useEffect(() => setQInput(q), [q]);
  useEffect(() => {
    const id = setTimeout(() => setQ(qInput), 300);
    return () => clearTimeout(id);
  }, [qInput]);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, isError } = useQuery<TagStat[], Error>({
    queryKey: ["all-tools-for-tags"],
    queryFn: async () => {
      // Only call tags endpoint
      const q = new URLSearchParams();
      q.set("limit", "100");
      const url = `/api/tags?${q.toString()}`;
      console.log("[tags] fetching URL", url);
      const resTags = await fetchJSON<any>(url);
      console.log("[tags] raw response", resTags);
      const list = extractList<any>(resTags);
      const tags: TagStat[] = Array.isArray(list)
        ? list.map((t: any) => ({
            name: t?.name ?? t?.slug ?? "Unknown",
            count: Number(t?.toolCount ?? t?.usageCount ?? t?.count ?? 0),
          }))
        : [];
      return tags;
    },
    staleTime: 60_000,
  });
  console.log("dữ liệu tags",data)
  const allTags: TagStat[] = useMemo(() => {
    const tags = Array.isArray(data) ? (data as TagStat[]) : [];
    return tags.sort((a, b) => b.count - a.count);
  }, [data]);

  const popularTags = useMemo(() => allTags.slice(0, 8), [allTags]);

  const filtered = useMemo(() => {
    if (!q.trim()) return allTags;
    const k = q.toLowerCase();
    return allTags.filter((t) => t.name.toLowerCase().includes(k));
  }, [q, allTags]);

  const list = filtered.slice(0, limit);
  const remain = Math.max(filtered.length - limit, 0);

  return (
    <div className="relative min-h-screen mt-14">  
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />
      <section className="pt-10 pb-6">
        <SectionShell>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-[34px] sm:text-[60px] font-[600] tracking-tight text-slate-900">
              Browse by Tags
            </h1>
            <p className="mt-2 text-slate-600">Discover AI tools organized by categories and use cases.</p>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-600"><FiTag className="h-4 w-4" /></span>
              <div className="font-[600] text-[30px] text-slate-900">Popular Tags</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className="inline-flex h-[34px] w-[110px] rounded-full bg-slate-100 animate-pulse" />
                  ))
                : popularTags.map((t) => <TagChip key={t.name} name={t.name} count={t.count} />)}
            </div>
            {isError && <div className="text-sm text-slate-500 mt-2">Không tải được dữ liệu tags từ API.</div>}
          </div>

          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-xl relative">
              <input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 pl-10 text-[15px] outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-300"
                placeholder="Search tags..."
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </SectionShell>
      </section>

      <section className="pb-16">
        <SectionShell>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-[110px] rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
                ))
              : list.map((t) => <TagCard key={t.name} name={t.name} count={t.count} />)}
          </div>

          {remain > 0 && (
            <div className="flex justify-center mt-6">
              <button onClick={() => setLimit((n) => n + 20)} className="px-4 py-2 text-[13px] rounded-full border border-slate-200 bg-white font-bold text-slate-700 hover:border-rose-200 hover:bg-rose-50 transition">
                Load More Tags
                <span className="ml-2 text-slate-500 font-medium">{remain} remaining</span>
              </button>
            </div>
          )}
        </SectionShell>
      </section>
    </div>
  );
}

