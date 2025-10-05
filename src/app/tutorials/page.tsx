"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Chip from "@/components/Chip";
import VideoCard from "@/components/VideoCard";
import TutorialGrid from "@/components/TutorialGrid";

import { FiZap } from 'react-icons/fi';
import { extractList, getTutorials, Tutorial } from "@/lib/api";

const CHIPS = [
  "All",
  "Beginner",
  "AI for Content",
  "AI for Developer",
  "AI for Website",
  "AI Image Generator",
  "AI Music",
  "AI Video Generator",
  "Kling",
  "Nano Banana",
];

export default function TutorialsPage() {
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState(q);
  useEffect(() => setQInput(q), [q]);
  useEffect(() => {
    const id = setTimeout(() => setQ(qInput), 300);
    return () => clearTimeout(id);
  }, [qInput]);
  const [active, setActive] = useState("All");
  // Dữ liệu tutorials sẽ được tải từ backend qua TutorialGrid

  const { data: featData } = useQuery({
    queryKey: ["tutorials", "featured", { limit: 3, isFeatured: true }],
    queryFn: () => getTutorials({ page: 1, limit: 3, isFeatured: true }),
    staleTime: 60_000,
  });

  const featured = extractList<Tutorial>(featData || {});

  function formatDuration(seconds?: number) {
    if (!seconds || typeof seconds !== "number" || seconds <= 0) return "";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div className="relative min-h-screen mt-14">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />

      <section className="pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="mt-3 text-[34px] sm:text-[60px] font-[600] tracking-tight text-slate-900">
            Video Tutorials
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto text-[20px]">
            Learn from our team with step-by-step video tutorials. Master new
            skills and discover best practices.
          </p>
        </div>
      </section>

      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 justify-center mb-10">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-pink-600"><FiZap className="h-4 w-4" /></span>
            <h2 className="font-[600] text-[30px] text-slate-900">
              Featured Tutorials
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((t) => (
              <VideoCard
                key={t.id || t._id}
                title={t.title}
                thumb={(t as any).thumbnailUrl}
                duration={formatDuration((t as any).duration)}
                desc={t.description}
                views={typeof t.viewCount === "number" ? `${Intl.NumberFormat().format(t.viewCount)} views` : String(t.viewCount || "")}
                tags={t.tags || []}
                youtubeUrl={(t as any).youtubeUrl}
                embedUrl={(t as any).embedUrl}
                toolUrl={(t as any).toolUrl || (t as any).url}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="w-full max-w-xl relative rounded-full border border-slate-200/80 bg-white/70 backdrop-blur shadow-sm focus-within:border-rose-300 focus-within:shadow-[0_0_0_6px_rgba(193,59,93,.12)] transition">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21l-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Search tutorials…"
                className="w-full rounded-full bg-transparent pl-10 pr-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {CHIPS.map((c) => (
              <Chip
                key={c}
                label={c}
                active={active === c}
                onClick={() => setActive(c)}
              />
            ))}
          </div>
        </div>
      </section>

      <TutorialGrid query={q} activeTag={active} />
    </div>
  );
}





