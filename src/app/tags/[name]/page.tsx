"use client";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ToolsFilters from "@/components/ToolsFilters";
import ToolsGrid from "@/components/ToolsGrid";
import SectionShell from "@/components/SectionShell";
import PageDot from "@/components/PageDot";
import { useQuery } from "@tanstack/react-query";
import { extractList, extractTotal, getTools, Tool } from "@/lib/api";

function safeDecode(s = "") {
  try {
    return decodeURIComponent(s);
  } catch {
    return s.replace(/%20/g, " ");
  }
}

function deslugify(s = "") {
  return safeDecode(s).replace(/-/g, " ").trim();
}

function toTitleCase(s = "") {
  return s
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

function canonicalizeTag(slug = "") {
  const base = deslugify(slug).toLowerCase();
  const SPECIAL: Record<string, string> = {
    seo: "SEO",
    ai: "AI",
    chatgpt: "ChatGPT",
    claude: "Claude",
    gemini: "Gemini",
    jasper: "Jasper",
    "github copilot": "GitHub Copilot",
    "pro.bestlist.ai": "Pro.bestlist.ai",
    kling: "Kling",
    "nano banana": "Nano Banana",
  };
  return SPECIAL[base] || toTitleCase(base);
}

export default function TagDetailPage() {
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState("All Pricing");
  const [form, setForm] = useState("All Forms");
  const params = useParams() as { name?: string };
  const raw = params?.name || "";
  const display = useMemo(() => canonicalizeTag(raw), [raw]);

  // Lấy thống kê tools theo tag để hiển thị count và ngày cập nhật gần nhất
  const apiTag = (display || "").replace(/-/g, " ").trim() || undefined;
  const { data, isLoading } = useQuery({
    queryKey: ["tools", { page: 1, limit: 100, tags: apiTag, search: apiTag }],
    queryFn: () =>
      getTools({
        page: 1,
        limit: 100,
        tags: apiTag,
        search: apiTag,
        sortBy: "updatedAt",
        sortOrder: "desc",
      }),
    staleTime: 30_000,
  });
  const list = extractList<Tool>(data || {});
  console.log("data",data)
  const total = data?.data?.tools?.length;
  const lastUpdated = useMemo(() => {
    const dates = Array.isArray(list)
      ? list
          .map((t: any) => t?.updatedAt)
          .filter(Boolean)
          .map((s: string) => new Date(s))
          .filter((d: Date) => !isNaN(d.getTime()))
      : [];
    if (!dates.length) return undefined;
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    return max.toLocaleDateString();
  }, [list]);

  return (
    <div className="relative min-h-screen mt-14">
      <section className="pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="mt-3 text-[34px] sm:text-[60px] font-[600] tracking-tight text-slate-900">{display}</h1>
        </div>
      </section>
      <section>
        <div className="flex justify-center gap-5">
          <div className="text-center max-w-3xl rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 leading-6">
            <PageDot color="#10B981" />
            {typeof total === "number"
              ? `${total} tools`
              : isLoading
              ? "Đang tải số lượng tools…"
              : "Không có tool nào cho tag này"}
          </div>
          <div className="text-center max-w-3xl rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 leading-6">
            <PageDot color="#10B981" />
            {lastUpdated
              ? lastUpdated
              : isLoading
              ? "Đang tải ngày cập nhật…"
              : "Chưa có tool nào được cập nhật gần đây"}
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ToolsGrid
          query={query}
          pricing={pricing}
          form={form}
          activeTag={display}
          thumbShape="circle"
        />
      </div>
    </div>
  );
}
