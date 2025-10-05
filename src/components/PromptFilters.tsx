"use client";
import React, { useEffect, useState } from "react";
import Chip from "./Chip";

const FIELD_TAGS = [
  "All fields",
  "Architecture",
  "Fashion",
  "Code Quality",
  "Content Creation",
  "Development",
  "Marketing",
  "Model",
  "Poster",
  "Programming",
  "SEO",
  "Social Media",
];

const TOOL_TAGS = [
  "All tools",
  "ChatGPT",
  "Claude",
  "Gemini",
  "GitHub Copilot",
  "Jasper",
  "Pro.bestlist.ai",
];

export default function PromptFilters({
  query,
  setQuery,
  activeField,
  setActiveField,
  activeTool,
  setActiveTool,
}: {
  query: string;
  setQuery: (v: string) => void;
  activeField: string;
  setActiveField: (v: string) => void;
  activeTool: string;
  setActiveTool: (v: string) => void;
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
            placeholder="Search prompts..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <p className="text-center text-[12px] text-slate-400 mb-2">Filter by Field</p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {FIELD_TAGS.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            active={activeField === tag}
            onClick={() => {
              if (tag === "All fields") {
                setActiveField(tag);
                // Reset tool filter when selecting "All fields"
                setActiveTool("All tools");
              } else {
                setActiveField(tag);
              }
            }}
          />
        ))}
      </div>

      <p className="text-center text-[12px] text-slate-400 mb-2">Filter by Tool</p>
      <div className="flex flex-wrap justify-center gap-2">
        {TOOL_TAGS.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            active={activeTool === tag}
            onClick={() => {
              if (tag === "All tools") {
                setActiveTool(tag);
                // Reset field filter when selecting "All tools"
                setActiveField("All fields");
              } else {
                setActiveTool(tag);
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}