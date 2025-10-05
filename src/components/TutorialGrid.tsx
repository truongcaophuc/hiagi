"use client";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { extractList, extractTotal, getTutorials, Tutorial } from "../lib/api";
import VideoCard from "./VideoCard";

type UiTutorial = {
  id?: string | number;
  title?: string;
  desc?: string;
  thumb?: string;
  duration?: string;
  views?: string;
  tags?: string[];
  youtubeUrl?: string;
  embedUrl?: string;
  toolUrl?: string;
};

export default function TutorialGrid({
  query,
  activeTag,
}: {
  query: string;
  activeTag: string;
}) {
  const [items, setItems] = useState<UiTutorial[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const prevFilterKey = useRef("");
  useEffect(() => {
    const key = JSON.stringify({ query, activeTag });
    if (prevFilterKey.current !== key) {
      prevFilterKey.current = key;
      setItems([]);
      setPage(1);
      setHasMore(true);
      setTotal(undefined);
    }
  }, [query, activeTag]);

  const tag = activeTag && activeTag !== "All" ? activeTag : undefined;
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["tutorials", { page, limit, query, tag }],
    queryFn: () =>
      getTutorials({
        page,
        limit,
        search: query || undefined,
        tags: tag,
      }),
    staleTime: 30_000,
    placeholderData: undefined,
  });
  console.log("tutorial",data)
  function formatDuration(seconds?: number | string) {
    if (typeof seconds === "string") return seconds;
    if (!seconds || typeof seconds !== "number" || seconds <= 0) return "";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  useEffect(() => {
    setLoading(isLoading || isFetching);
    setErr(error ? (error as any).message || "Fetch failed" : "");
    const list = extractList<Tutorial>(data || {});
    console.log("list",list)
    const mapped: UiTutorial[] = list.map((v: any) => ({
      id: v._id || v.id,
      title: v.title || v.name || "Untitled",
      desc: v.description || "",
      thumb: v.thumbnailUrl || v.imageUrl || v.thumb,
      duration: formatDuration(v.duration),
      views: typeof v.viewCount === "number" ? `${Intl.NumberFormat().format(v.viewCount)} views` : (v.views || ""),
      tags: Array.isArray(v.tags) ? v.tags : [],
      youtubeUrl: v.youtubeUrl,
      embedUrl: v.embedUrl,
      toolUrl: v.toolUrl || v.url,
    }));
    setItems((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
    const totalNum = extractTotal(data || {});
    setTotal(totalNum);
    if (typeof totalNum === "number") {
      const loaded = (page - 1) * limit + list.length;
      setHasMore(loaded < totalNum);
    } else {
      setHasMore(list.length === limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isLoading, isFetching]);

  const remain =
    typeof total === "number" ? Math.max(total - items.length, 0) : undefined;

  return (
    <section className="pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {err && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            Lỗi tải tutorials: {err}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {items.map((v, idx) => (
            <VideoCard key={v.id || idx} {...v} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          {hasMore && !loading && (
            <button
              onClick={() => setPage((n) => n + 1)}
              className="group relative inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-[13px] font-bold text-rose-700 shadow-sm hover:shadow-md hover:border-rose-300 transition"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-rose-50 to-transparent opacity-0 group-hover:opacity-100 transition" />
              Load More Tutorials
              {typeof remain === "number" && (
                <span className="text-slate-500 font-medium">
                  {remain} remaining
                </span>
              )}
            </button>
          )}
          {loading && (
            <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
              Đang tải…
            </div>
          )}
    
        </div>
      </div>
    </section>
  );
}
