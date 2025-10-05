"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiZap } from "react-icons/fi";
import { extractList, getCourses, Course } from "../lib/api";
import CourseCard from "./CourseCard";
export default function FeaturedCourses() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["courses", "featured", { page: 1, limit: 6, isFeatured: true }],
    queryFn: () => getCourses({ page: 1, limit: 6, isFeatured: true }),
    staleTime: 30_000,
  });

  const list = extractList<Course>(data || {});
  const mapped = list.map((c: any) => ({
    id: c._id || c.id || c.slug,
    image: c.thumbnailUrl || c.image,
    price:
      c.isFree === true
        ? "Free"
        : typeof c.price === "number"
        ? `${c.price}`
        : c.price,
    level: c.level || c.difficulty,
    provider: c.provider || c.source || c.platform,
    title: c.title || c.name,
    author: c.instructor,
    desc: c.description || c.desc,
    rating: typeof c.rating === "number" ? c.rating : undefined,
    stats: { enroll: c.enrollmentCount, duration: c.duration },
    tags: Array.isArray(c.tags) ? c.tags : [],
    href: c.courseUrl || c.url || "#",
  }));

  return (
    <section className="py-6">
      <div className="flex items-center justify-center gap-2 mb-12">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
          <FiZap className="h-4 w-4" style={{ color: "#f97316" }} />
        </span>
        <h2 className="text-2xl sm:text-[30px] font-[600] tracking-tight">
          Featured Courses
        </h2>
      </div>
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          Lỗi tải featured courses: {(error as any).message}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(isLoading ? Array.from({ length: 6 }) : mapped).map(
          (c: any, idx: number) => (
            <CourseCard key={c?.id || idx} {...(c || {})} />
          )
        )}
      </div>
    </section>
  );
}

