"use client";
import React, { useState } from "react";
import PromptHero from "../../components/PromptHero";
import FeaturedPrompts from "../../components/FeaturedPrompts";
import PromptFilters from "../../components/PromptFilters";
import PromptGrid from "../../components/PromptGrid";

export default function PromptsPage() {
  const [query, setQuery] = useState("");
  const [activeField, setActiveField] = useState("All fields");
  const [activeTool, setActiveTool] = useState("All tools");

  return (
    <div className="relative min-h-screen mt-14">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />
      <PromptHero />
      <FeaturedPrompts /> 
      <PromptFilters
        query={query}
        setQuery={setQuery}
        activeField={activeField}
        setActiveField={setActiveField}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
      />
      <PromptGrid query={query} activeField={activeField} activeTool={activeTool} />
    </div>
  );
}