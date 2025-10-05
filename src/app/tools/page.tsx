"use client";
import React, { useState } from "react";
import EliteSection from "@/components/EliteSection";
import ToolsFilters from "@/components/ToolsFilters";
import ToolsGrid from "@/components/ToolsGrid";

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState("All Pricing");
  const [form, setForm] = useState("All Forms");

  return (
    <div className="relative min-h-screen mt-14">
       <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />
      <section className="pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="mt-3 text-[34px] sm:text-[60px] font-[600] tracking-tight text-slate-900">AI Tools</h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto text-[20px]">Browse and filter the latest AI tools curated by HiAGI.</p>
        </div>
      </section>

      <div className="px-4 sm:px-30">
        <EliteSection />
      </div>

      <ToolsFilters query={query} setQuery={setQuery} pricing={pricing} setPricing={setPricing} form={form} setForm={setForm} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ToolsGrid query={query} pricing={pricing} form={form} thumbShape="rect" />
      </div>
    </div>
  );
}