"use client";
import React, { useState } from "react";
import HeroCourses from "../../components/HeroCourses";
import FeaturedCourses from "../../components/FeaturedCourses";
import CourseFilters from "../../components/CourseFilters";
import CourseGrid from "../../components/CourseGrid";

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState("All Prices");
  const [level, setLevel] = useState("All Levels");
  const [provider, setProvider] = useState("All Providers");
  const [tag, setTag] = useState("");

  return (
    <div className="font-inter text-slate-900 relative min-h-screen mt-14">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroCourses />
        <FeaturedCourses />
        <CourseFilters
          query={query}
          setQuery={setQuery}
          price={price}
          setPrice={setPrice}
          level={level}
          setLevel={setLevel}
          provider={provider}
          setProvider={setProvider}
          tag={tag}
          setTag={setTag}
        />
        <CourseGrid query={query} price={price} level={level} provider={provider} tag={tag} />
      </div>
    </div>
  );
}