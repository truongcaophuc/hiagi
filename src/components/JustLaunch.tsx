"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchJSON, Tool } from "../lib/api";
import ToolCard from "./ToolCard";
import PromptCard from "./PromptCard";
import CourseCard from "./CourseCard";
import VideoCard from "./VideoCard";
import { FiltersState } from "./FiltersModal";

type Item = {
  id?: string | number;
  name: string;
  desc?: string;
  thumb?: string;
  tags?: string[];
  favCount?: number;
  updatedAt?: string;
  url?: string;
};

export default function JustLaunch({
  filters,
  query,
}: {
  filters?: FiltersState;
  query?: string;
}) {
  // Tools (limit 8)
  const {
    data: toolsData,
    isLoading: toolsLoading,
    isError: toolsError,
  } = useQuery<Item[] | Tool[], Error>({
    queryKey: ["just-launched-tools"],
    queryFn: async () => {
      const params = new URLSearchParams({
        sortBy: "createdAt",
        sortOrder: "desc",
        limit: "8",
      });
      const json = await fetchJSON<any>(`/api/tools?${params.toString()}`);
      const raw = Array.isArray(json)
        ? json
        : json?.data?.tools ??
          json?.data?.items ??
          json?.items ??
          json?.data ??
          [];
      const mapped = (raw as Tool[]).map((t) => ({
        id: (t as any)._id ?? (t as any).id,
        name: t.name,
        desc: (t as any).description,
        thumb: (t as any).imageUrl,
        pricing: (t as any).pricing,
        tags: t.tags,
        favCount: Number((t as any).favCount ?? 0),
        updatedAt: (t as any).updatedAt,
        url: t.url,
      }));
      try {
        const sample = (raw as any[])[0] || {};
        console.log("[JustLaunch] sample keys:", Object.keys(sample));
        console.log("[JustLaunch] mapped favCount & updated:", mapped.map((m) => ({ id: m.id, favCount: m.favCount, updatedAt: m.updatedAt })));
      } catch (err) {}
      return mapped;
    },
    staleTime: 60_000,
  });

  // Prompts (limit 8)
  const {
    data: promptsData,
    isLoading: promptsLoading,
    isError: promptsError,
  } = useQuery<any[], Error>({
    queryKey: ["just-launched-prompts"],
    queryFn: async () => {
      const params = new URLSearchParams({
        sortBy: "createdAt",
        sortOrder: "desc",
        limit: "8",
      });
      const json = await fetchJSON<any>(`/api/prompts?${params.toString()}`);
      const raw = Array.isArray(json)
        ? json
        : json?.data?.prompts ??
          json?.data?.items ??
          json?.items ??
          json?.data ??
          [];
      return (raw as any[]).map((p: any) => ({
        id: p._id || p.id || p.slug,
        image: p.imageUrl || p.image,
        title: p.title || p.name,
        desc: p.description || p.desc,
        uses: p.usageCount ?? p.uses,
        views: p.viewCount ?? p.views,
        fieldTags: Array.isArray(p.fieldTags)
          ? p.fieldTags
          : Array.isArray(p.tags)
          ? p.tags
          : [],
        source: p.source,
        tool: p.tool,
        prompt: p.promptContent || p.prompt,
        href: p.promptUrl || p.url || "#",
      }));
    },
    staleTime: 60_000,
  });

  // Courses (limit 8)
  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useQuery<any[], Error>({
    queryKey: ["just-launched-courses"],
    queryFn: async () => {
      const params = new URLSearchParams({
        sortBy: "createdAt",
        sortOrder: "desc",
        limit: "8",
      });
      const json = await fetchJSON<any>(`/api/courses?${params.toString()}`);
      const raw = Array.isArray(json)
        ? json
        : json?.data?.courses ??
          json?.data?.items ??
          json?.items ??
          json?.data ??
          [];
      return (raw as any[]).map((c: any) => ({
        id: c._id || c.id,
        image: c.thumbnailUrl || c.imageUrl || c.image,
        price: c.price,
        level: c.level,
        provider: c.provider,
        title: c.title || c.name,
        author: c.author,
        desc: c.description || c.desc,
        rating: c.rating,
        stats: { enroll: c.enrollCount, duration: c.duration },
        href: c.url,
        tags: Array.isArray(c.tags) ? c.tags : [],
      }));
    },
    staleTime: 60_000,
  });

  // Tutorials (limit 8)
  const {
    data: tutorialsData,
    isLoading: tutorialsLoading,
    isError: tutorialsError,
  } = useQuery<any[], Error>({
    queryKey: ["just-launched-tutorials"],
    queryFn: async () => {
      const params = new URLSearchParams({
        sortBy: "createdAt",
        sortOrder: "desc",
        limit: "8",
      });
      const json = await fetchJSON<any>(`/api/tutorials?${params.toString()}`);
      const raw = Array.isArray(json)
        ? json
        : json?.data?.tutorials ??
          json?.data?.items ??
          json?.items ??
          json?.data ??
          [];
      return (raw as any[]).map((v: any) => ({
        id: v._id || v.id,
        title: v.title || v.name || "Untitled",
        desc: v.description || "",
        thumb: v.thumbnailUrl || v.imageUrl || v.thumb,
        duration: v.duration,
        views:
          typeof v.viewCount === "number"
            ? `${Intl.NumberFormat().format(v.viewCount)} views`
            : v.views || "",
        tags: Array.isArray(v.tags) ? v.tags : [],
        youtubeUrl: v.youtubeUrl,
        embedUrl: v.embedUrl,
        toolUrl: v.toolUrl || v.url,
      }));
    },
    staleTime: 60_000,
  });

  const applyFilters = (items: Item[]): Item[] => {
    if (!filters && !query) return items;
    let out = items;
    if (filters?.pricing && filters.pricing.size) {
      const keys = Array.from(filters.pricing).map((s) => s.toLowerCase());
      out = out.filter((it) =>
        keys.some((k) =>
          String((it as any).pricing || "")
            .toLowerCase()
            .includes(k)
        )
      );
    }
    if (filters?.form && filters.form.size) {
      const keys = Array.from(filters.form).map((s) => s.toLowerCase());
      out = out.filter((it) =>
        (it.tags || []).some((tag) => keys.includes(String(tag).toLowerCase()))
      );
    }
    const q = (query || "").toLowerCase().trim();
    if (q) {
      out = out.filter((it) => {
        const name = (it as any).name || "";
        const desc = (it as any).desc || "";
        const tags = Array.isArray((it as any).tags) ? (it as any).tags : [];
        return (
          name.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q) ||
          tags.some((t: any) => String(t).toLowerCase().includes(q))
        );
      });
    }
    return out;
  };
  const tools = useMemo(
    () => applyFilters(Array.isArray(toolsData) ? (toolsData as Item[]) : []),
    [toolsData, filters, query]
  );
  console.log("tool là",tools)
  return (
    <section className="">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-10">
        {/* <h2 className="text-[30px] font-extrabold my-8 text-center">Just Launch</h2> */}

        {/* Tools section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[30px] font-bold">AI Tools</h3>
            <Link href="/tools" className="text-sm font-semibold text-rose-600">
              View more
            </Link>
          </div>
          <div className="grid gap-4 w-full max-w-[1200px] mx-auto [grid-template-columns:repeat(4,minmax(0,1fr))] max-[1100px]:[grid-template-columns:repeat(3,1fr)] max-[860px]:[grid-template-columns:repeat(2,1fr)] max-[560px]:[grid-template-columns:1fr]">
            {toolsLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-gray-100 h-[270px]" />
                ))
              : tools.map((it, i) => (
                  <ToolCard
                    key={String((it as any).id ?? i)}
                    item={it as any}
                    thumbShape="rect"
                  />
                ))}
            {toolsError && (
              <div className="col-span-full text-center text-sm text-slate-500">
                Không tải được dữ liệu Tools.
              </div>
            )}
          </div>
        </div>

        {/* Courses section */}
        <div>
          <div className="flex items-center justify-between mt-8 mb-3">
            <h3 className="text-[30px] font-bold">AI Courses</h3>
            <Link
              href="/courses"
              className="text-sm font-semibold text-rose-600"
            >
              View more
            </Link>
          </div>
          <div className="grid gap-4 w-full max-w-[1200px] mx-auto [grid-template-columns:repeat(4,minmax(0,1fr))] max-[1100px]:[grid-template-columns:repeat(3,1fr)] max-[860px]:[grid-template-columns:repeat(2,1fr)] max-[560px]:[grid-template-columns:1fr]">
            {coursesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-gray-100 h-[270px]"
                  />
                ))
              : (coursesData || []).map((c: any, idx: number) => (
                  <CourseCard key={c.id || idx} {...c} />
                ))}
            {coursesError && (
              <div className="col-span-full text-center text-sm text-slate-500">
                Không tải được dữ liệu Courses.
              </div>
            )}
          </div>
        </div>

        {/* Tutorials section */}
        <div>
          <div className="flex items-center justify-between mt-8 mb-3">
            <h3 className="text-[30px] font-bold">AI Tutorials</h3>
            <Link
              href="/tutorials"
              className="text-sm font-semibold text-rose-600"
            >
              View more
            </Link>
          </div>
          <div className="grid gap-4 w-full max-w-[1200px] mx-auto [grid-template-columns:repeat(4,minmax(0,1fr))] max-[1100px]:[grid-template-columns:repeat(3,1fr)] max-[860px]:[grid-template-columns:repeat(2,1fr)] max-[560px]:[grid-template-columns:1fr]">
            {tutorialsLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-gray-100 h-[270px]"
                  />
                ))
              : (tutorialsData || []).map((v: any, idx: number) => (
                  <VideoCard key={v.id || idx} {...v} />
                ))}
            {tutorialsError && (
              <div className="col-span-full text-center text-sm text-slate-500">
                Không tải được dữ liệu Tutorials.
              </div>
            )}
          </div>
        </div>

        {/* Prompts section */}
        <div>
          <div className="flex items-center justify-between mt-8 mb-3">
            <h3 className="text-[30px] font-bold">AI Prompts</h3>
            <Link
              href="/prompts"
              className="text-sm font-semibold text-rose-600"
            >
              View more
            </Link>
          </div>
          <div className="grid gap-4 w-full max-w-[1200px] mx-auto [grid-template-columns:repeat(4,minmax(0,1fr))] max-[1100px]:[grid-template-columns:repeat(3,1fr)] max-[860px]:[grid-template-columns:repeat(2,1fr)] max-[560px]:[grid-template-columns:1fr]">
            {promptsLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-gray-100 h-[270px]"
                  />
                ))
              : (promptsData || []).map((p: any, idx: number) => (
                  <PromptCard key={p.id || idx} {...p} />
                ))}
            {promptsError && (
              <div className="col-span-full text-center text-sm text-slate-500">
                Không tải được dữ liệu Prompts.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
