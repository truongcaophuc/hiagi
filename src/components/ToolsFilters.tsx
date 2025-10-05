"use client";
import React, { useEffect, useState } from "react";
import Chip from "./Chip";

const PRICING = ["All Pricing", "Free Trial", "Free", "Paid", "Waiting list", "Usage Based"];
const FORM = ["All Forms", "Website", "App", "Browser Extension"];

export default function ToolsFilters({
  query,
  setQuery,
  pricing,
  setPricing,
  form,
  setForm,
}: {
  query: string;
  setQuery: (v: string) => void;
  pricing: string;
  setPricing: (v: string) => void;
  form: string;
  setForm: (v: string) => void;
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
            placeholder="Search tools..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <p className="text-center text-[12px] text-slate-400 mb-2">Filter by Pricing</p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {PRICING.map((p) => (
          <Chip key={p} label={p} active={pricing === p} onClick={() => setPricing(p)} />
        ))}
      </div>

      <p className="text-center text-[12px] text-slate-400 mb-2">Filter by Form</p>
      <div className="flex flex-wrap justify-center gap-2">
        {FORM.map((f) => (
          <Chip key={f} label={f} active={form === f} onClick={() => setForm(f)} />
        ))}
      </div>
    </section>
  );
}