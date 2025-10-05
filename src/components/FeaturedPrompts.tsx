"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiZap } from "react-icons/fi";
import { extractList, getPrompts, Prompt } from "../lib/api";
import PromptCard from "./PromptCard";
export default function FeaturedPrompts() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["prompts", { page: 1, limit: 6, isFeatured: true }],
    queryFn: () => getPrompts({ page: 1, limit: 6, isFeatured: true }),
    staleTime: 30_000,
  });

  const list = extractList<Prompt>(data || {});
  const mapped = list.map((p: any) => ({
    id: p._id || p.id || p.slug,
    image: p.imageUrl || p.image,
    title: p.title || p.name,
    desc: p.description || p.desc,
    uses: typeof p.usageCount === "number" ? Intl.NumberFormat().format(p.usageCount) : p.uses,
    views: typeof p.viewCount === "number" ? Intl.NumberFormat().format(p.viewCount) : p.views,
    fieldTags: Array.isArray(p.fieldTags) ? p.fieldTags : Array.isArray(p.tags) ? p.tags : [],
    source: p.source || p.tool,
    prompt: p.promptContent || p.prompt,
    href: p.promptUrl || p.url || "#",
  }));

  return (
    <section className="py-6 max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center  justify-center gap-2 mb-12">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600"><FiZap className="h-4 w-4" /></span>
        <h2 className="text-2xl sm:text-[30px] font-[600] tracking-tight">Featured Prompts</h2>
      </div>
      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">Lỗi tải featured prompts: {(error as any).message}</div>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(isLoading ? Array.from({ length: 6 }) : mapped).map((item: any, idx: number) => (
          <PromptCard key={item?.id || idx} {...(item || {})} />
        ))}
      </div>
    </section>
  );
}


