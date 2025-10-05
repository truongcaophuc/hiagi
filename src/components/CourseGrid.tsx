"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "./CourseCard";
import { extractList, extractTotal, getCourses, Course } from "../lib/api";

type UiCourse = {
  id?: string | number;
  image?: string;
  price?: string;
  level?: string;
  provider?: string;
  title?: string;
  desc?: string;
  rating?: number;
  href?: string;
  tags?: string[];
};

export default function CourseGrid({ query, price, level, provider, tag }: { query: string; price: string; level: string; provider: string; tag: string }) {
  const [items, setItems] = useState<UiCourse[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const prevFilterKey = useRef("");
  useEffect(() => {
    const key = JSON.stringify({ query, price, level, provider, tag });
    if (prevFilterKey.current !== key) {
      prevFilterKey.current = key;
      setItems([]);
      setPage(1);
      setHasMore(true);
    }
  }, [query, price, level, provider, tag]);

  const isFree = price === "Free" ? true : price === "Paid" ? false : undefined;
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["courses", { page, limit, query, level, isFree, tag }],
    queryFn: () =>
      getCourses({
        page,
        limit,
        search: query || undefined,
        level: level && level !== "All Levels" ? level : undefined,
        isFree,
        tags: tag || undefined,
      }),
    staleTime: 30_000,
    placeholderData: undefined,
  });

  function formatPrice(course: any): string | undefined {
    if (course?.isFree === true) return "Free";
    const p = course?.price ?? course?.originalPrice;
    if (p == null) return undefined;
    return typeof p === "number" ? `${p}` : String(p);
  }

  useEffect(() => {
    setLoading(isLoading || isFetching);
    setErr(error ? (error as any).message || "Fetch failed" : "");
    const list = extractList<Course>(data || {});
    const mapped: UiCourse[] = list.map((c: any) => ({
      id: c._id || c.id || c.slug,
      image: c.thumbnailUrl || c.image,
      price: formatPrice(c),
      level: c.level || c.difficulty,
      provider: c.provider || c.source || c.platform,
      title: c.title || c.name,
      desc: c.description || c.desc,
      rating: typeof c.rating === "number" ? c.rating : undefined,
      href: c.courseUrl || c.url || "#",
      tags: Array.isArray(c.tags) ? c.tags : [],
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
  }, [data, error, isLoading, isFetching]);

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    if (!Array.isArray(items)) return [];
    return items.filter((c) => {
      const title = c.title || "";
      const desc = c.desc || "";
      const tags = Array.isArray(c.tags) ? c.tags : [];
      const matchText = !q || title.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || tags.some((t: any) => String(t).toLowerCase().includes(q));
      const priceStr = (c.price || "").toString().toLowerCase();
      const matchPrice =
        !price ||
        price === "All Prices" ||
        (price === "Free" && (priceStr === "free" || priceStr === "0" || priceStr === "0đ" || priceStr === "0 vnd")) ||
        (price === "Paid" && !(priceStr === "free" || priceStr === "0" || priceStr === "0đ" || priceStr === "0 vnd"));
      const levelStr = c.level || "";
      const matchLevel = !level || level === "All Levels" || levelStr === level;
      const providerStr = c.provider || "";
      const matchProvider = !provider || provider === "All Providers" || providerStr === provider;
      const matchTag = !tag || tags.includes(tag);
      return matchText && matchPrice && matchLevel && matchProvider && matchTag;
    });
  }, [items, query, price, level, provider, tag]);

  return (
    <section className="py-6">
      {err && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">Lỗi tải khoá học: {err}</div>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {filtered.map((c: UiCourse, idx: number) => (
          <CourseCard key={c.id || idx} {...c} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        {hasMore && !loading && (
          <button onClick={() => setPage((v) => v + 1)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Load More Courses
          </button>
        )}
        {loading && <div className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">Đang tải…</div>}
      </div>
    </section>
  );
}