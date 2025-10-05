"use client";
import React, { useState } from "react";
import FavoriteSection from "@/components/Favorite";
import FiltersModal, { FiltersState } from "@/components/FiltersModal";

export default function FavoritesPage() {
  const [query, setQuery] = useState("");
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    pricing: new Set(["Free Trial", "Free", "Paid", "Waiting list", "Usage Based"]),
    form: new Set<string>(),
  });

  return (
    <div className="relative min-h-screen mt-14">
      <section className="pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="mt-3 text-[34px] sm:text-[60px] font-[600] tracking-tight text-slate-900">Your Favorites</h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto text-[20px]">Các tool bạn đã thả tim sẽ hiển thị ở đây.</p>
          <div className="mt-4 max-w-md mx-auto">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search favorites"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mt-3">
              <button
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:border-rose-200 hover:bg-rose-50"
                onClick={() => setOpenFilters(true)}
              >
                Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FavoriteSection mode="user" filters={filters} query={query} />
      </div>

      <FiltersModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        initial={filters}
        onApply={(f) => {
          setFilters(f);
          setOpenFilters(false);
        }}
      />
    </div>
  );
}