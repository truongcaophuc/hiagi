"use client";
import React, { useEffect, useState } from "react";
import Chip from "./Chip";

const PRICE = ["All Prices", "Free", "Paid"];
const LEVEL = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const PROVIDER = ["All Providers", "Udemy", "Coursera", "edX"];
const TAGS = [
  "AI Basics",
  "AI Developer",
  "AI Marketing",
  "Video AI",
  "E-commerce Business",
  "Python",
  "Data Analytics",
  "Prompt Engineering",
  "Social Media",
  "Design",
];

export default function CourseFilters({
  query,
  setQuery,
  price,
  setPrice,
  level,
  setLevel,
  provider,
  setProvider,
  tag,
  setTag,
}: {
  query: string;
  setQuery: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  level: string;
  setLevel: (v: string) => void;
  provider: string;
  setProvider: (v: string) => void;
  tag: string;
  setTag: (v: string) => void;
}) {
  const [input, setInput] = useState(query);
  useEffect(() => setInput(query), [query]);
  useEffect(() => {
    const id = setTimeout(() => setQuery(input), 300);
    return () => clearTimeout(id);
  }, [input, setQuery]);
  return (
    <section className="py-6">
      <div className="max-w-xl mx-auto mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {PRICE.map((p) => (
          <Chip key={p} label={p} active={price === p} onClick={() => setPrice(p)} />
        ))}
        {LEVEL.map((l) => (
          <Chip key={l} label={l} active={level === l} onClick={() => setLevel(l)} />
        ))}
        {PROVIDER.map((pr) => (
          <Chip key={pr} label={pr} active={provider === pr} onClick={() => setProvider(pr)} />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {TAGS.map((t) => (
          <Chip key={t} label={t} active={tag === t} onClick={() => setTag(t)} />
        ))}
      </div>
    </section>
  );
}