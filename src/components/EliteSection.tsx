"use client";
import React from "react";
import EliteBanner from "./EliteBanner";
import EliteCard from "./EliteCard";
import { useQuery } from "@tanstack/react-query";
import { Tool, getTools, extractList } from "../lib/api";
import { FiZap } from "react-icons/fi";

type EliteItem = {
  id?: number | string;
  name?: string;
  desc?: string;
  url?: string;
  tags?: string[];
  views?: number;
  pricing?: string;
  thumb?: string;
};

export default function EliteSection() {
  const { data, isLoading, isError } = useQuery<
    { items: EliteItem[] } | EliteItem[] | Tool[],
    Error
  >({
    queryKey: ["elite-tools"],
    queryFn: async () => {
      const json = await getTools({
        limit: 12,
        isFeatured: true,
        sortBy: "updatedAt",
        sortOrder: "desc",
      });
      const tools: Tool[] = extractList<Tool>(json);
      const elite = tools.filter((t: any) => (t as any).isFeatured === true);
      return elite.map((t: any) => ({
        id: (t as any)._id ?? (t as any).id,
        name: t.name,
        desc: (t as any).description,
        url: t.url,
        tags: t.tags,
        views: (t as any).viewCount,
        pricing: t.pricing,
        thumb: (t as any).imageUrl,
        favCount: (t as any).favCount,
        updatedAt: (t as any).updatedAt,
        useCases: Array.isArray((t as any).useCases)
          ? (t as any).useCases
          : undefined,
      }));
    },
    staleTime: 60_000,
  });

  const items = Array.isArray(data)
    ? (data as EliteItem[])
    : (data as any)?.items ?? [];

  // Yêu cầu: không hiện skeleton khi đang tải; ẩn toàn bộ section
  if (isLoading || isError) {
    return null;
  }
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="px-5 py-[50px] box-border mx-auto">
      {/* <EliteBanner /> */}
      <div className="flex items-center  justify-center gap-2 mb-12">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
          <FiZap className="h-4 w-4" style={{ color: "green" }} />
        </span>
        <h2 className="text-2xl sm:text-[30px] font-[600] tracking-tight">
          Featured Tools
        </h2>
      </div>
      <div
        className="grid gap-7 w-full max-w-[1600px] mx-auto [grid-template-columns:repeat(4,minmax(0,1fr))] max-[1100px]:[grid-template-columns:repeat(3,1fr)] max-[860px]:[grid-template-columns:repeat(2,1fr)] max-[560px]:[grid-template-columns:1fr]"
        id="eliteGrid"
      >
        {items.map((it: EliteItem) => (
          <EliteCard key={String(it.id)} item={it} />
        ))}
      </div>
    </section>
  );
}
