"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PromptCard from "./PromptCard";
import { extractList, extractTotal, getPrompts, Prompt } from "../lib/api";

type UiPrompt = {
  id?: string | number;
  image?: string;
  title?: string;
  desc?: string;
  uses?: number | string;
  views?: number | string;
  fieldTags?: string[];
  source?: string;
  tool?: string;
  prompt?: string;
  href?: string;
};

export default function PromptGrid({ query, activeField, activeTool }: { query: string; activeField: string; activeTool: string }) {
  const [items, setItems] = useState<UiPrompt[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const prevFilterKey = useRef("");
  useEffect(() => {
    const key = JSON.stringify({ query, activeField, activeTool });
    if (prevFilterKey.current !== key) {
      prevFilterKey.current = key;
      setPage(1);
      setHasMore(true);
    }
  }, [query, activeField, activeTool]);

  const tag = activeField && activeField !== "All fields" ? activeField : undefined;
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["prompts", { page, limit, query, tag }],
    queryFn: () =>
      getPrompts({
        page,
        limit,
        search: query || undefined,
        tags: tag,
      }),
    staleTime: 30_000,
    placeholderData: undefined,
  });

  useEffect(() => {
    setLoading(isLoading || isFetching);
    setErr(error ? (error as any).message || "Fetch failed" : "");
    const list = extractList<Prompt>(data || {});
    const mapped: UiPrompt[] = list.map((p: any) => ({
      id: p._id || p.id || p.slug,
      image: p.imageUrl || p.image,
      title: p.title || p.name,
      desc: p.description || p.desc,
      uses: p.usageCount ?? p.uses,
      views: p.viewCount ?? p.views,
      fieldTags: Array.isArray(p.fieldTags) ? p.fieldTags : Array.isArray(p.tags) ? p.tags : [],
      source: p.source,
      tool: p.tool,
      prompt: p.promptContent || p.prompt,
      href: p.promptUrl || p.url || "#",
    }));
    setItems((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
    const total = extractTotal(data || {});
    if (typeof total === "number") {
      const loaded = (page - 1) * limit + list.length;
      setHasMore(loaded < total);
    } else {
      setHasMore(list.length === limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isLoading, isFetching, activeField, activeTool, query]);

  const filtered = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const q = (query || "").toLowerCase().trim();
    return items.filter((p) => {
      const title = p.title || "";
      const desc = p.desc || "";
      const content = p.prompt || "";
      const fieldTags = Array.isArray(p.fieldTags) ? p.fieldTags : [];
      const toolStr = (p.tool || p.source || "").toString();

      const matchText =
        !q ||
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        content.toLowerCase().includes(q) ||
        fieldTags.some((t: any) => String(t).toLowerCase().includes(q));
      const matchField = !activeField || activeField === "All fields" ? true : fieldTags.some((t: any) => String(t).toLowerCase() === activeField.toLowerCase());
      const matchTool = !activeTool || activeTool === "All tools" ? true : toolStr.toLowerCase().includes(activeTool.toLowerCase());
      return matchText && matchField && matchTool;
    });
  }, [items, query, activeField, activeTool]);

  const list = filtered.slice(0, Math.max(9, limit));

  return (
    <section className="py-6 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      {err && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">Lỗi tải prompts: {err}</div>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((item: any, idx: number) => (
          <PromptCard key={item.id || idx} {...item} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        {hasMore && !loading && (
          <button onClick={() => setPage((v) => v + 1)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Load More Prompts
          </button>
        )}
        {loading && <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">Đang tải…</div>}
      </div>
    </section>
  );
}