"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function pill(base: string, active: boolean) {
  return `${base} ${active ? "bg-[#FDE7ED] border-[#F6B2C3] text-[#C13B5D]" : ""}`;
}

const TAGS = [
  "Translation",
  "News",
  "Social media",
  "Freemium",
  "Data analysis",
  "Fun",
  "Inspiration",
  "Writing",
  "Relationships",
  "Subscription",
  "Development",
  "Business",
];

export default function Hero({
  activeTab,
  onSort,
  onOpenFilters,
  onSearch,
}: {
  activeTab: "new" | "used" | "fav";
  onSort: (tab: "new" | "used" | "fav") => void;
  onOpenFilters: () => void;
  onSearch?: (q: string) => void;
}) {
  const base =
    "inline-flex items-center gap-1.5 px-[14px] py-[9px] text-[14px] font-semibold rounded-full border border-[#E5E7EB] bg-white text-[#0F172A] transition hover:bg-[#FDE7ED] hover:border-[#F6B2C3] hover:text-[#C13B5D]";
  const [input, setInput] = useState("");
  useEffect(() => {
    const id = setTimeout(() => onSearch?.(input), 300);
    return () => clearTimeout(id);
  }, [input, onSearch]);

  return (
    <header className="pt-15 pb-10 mt-15 border-b border-[#E5E7EB] bg-[linear-gradient(180deg,#fff,rgba(193,59,93,.08)_50%,#F9FAFB_100%)]">
      <div className="mx-auto max-w-[1400px] px-5 text-center">
        <h1 className="text-4xl font-extrabold mb-2">
          <span className="text-[#C13B5D]">Hi</span>AGI AI TOOL DIRECTORY
        </h1>
        <p className="text-[#64748B] mb-5">
          Check out all AI tools, find the right one for any job, and make your daily tasks easier with AI
        </p>

        <div className="flex gap-4 flex-wrap justify-center mb-3">
          <button className={pill(base, activeTab === "new")} onClick={() => onSort("new")}> Just Launched</button>
          <button className={pill(base, activeTab === "used")} onClick={() => onSort("used")}> Most Used</button>
          <button className={pill(base, activeTab === "fav")} onClick={() => onSort("fav")}> Most Favored</button>
          <button className={base} onClick={onOpenFilters}> Filters</button>
        </div>

        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search tools"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 rounded-full border border-[#E5E7EB] bg-[#F8FAFC] text-[#0F172A] font-semibold text-sm transition hover:border-[#d1d5db] hover:bg-[#fcfdff]"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
