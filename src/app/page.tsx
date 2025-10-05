"use client";
import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import EliteSection from "../components/EliteSection";
import JustLaunch from "../components/JustLaunch";
import MostUsed from "../components/MostUsed";
import FavoriteSection from "../components/Favorite";
import FiltersModal, { FiltersState } from "../components/FiltersModal";
export default function Home() {
  const [activeTab, setActiveTab] = useState<"new" | "used" | "fav">("new");
  const [openFilters, setOpenFilters] = useState(false);
  const [homeQuery, setHomeQuery] = useState("");
  const [filters, setFilters] = useState<FiltersState>({
    pricing: new Set(["Free Trial", "Free", "Paid", "Waiting list", "Usage Based"]),
    form: new Set<string>(),
  });
  useEffect(() => {
    setActiveTab("new");
  }, []);

  return (
    <div className="">
      <Hero activeTab={activeTab} onSort={(tab) => setActiveTab(tab)} onOpenFilters={() => setOpenFilters(true)} onSearch={(q) => setHomeQuery(q)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {activeTab !== "used" && activeTab !== "fav" && <EliteSection />}
        {activeTab === "new" && <JustLaunch filters={filters} query={homeQuery} />}
        {activeTab === "used" && <MostUsed filters={filters} query={homeQuery} />}
        {activeTab === "fav" && <FavoriteSection mode="global" filters={filters} query={homeQuery} />}
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




