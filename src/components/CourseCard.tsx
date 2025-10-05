"use client";
import React from "react";
import { FiClock, FiUsers } from "react-icons/fi";

export default function CourseCard({
  image,
  price,
  level,
  provider,
  title,
  author,
  desc,
  rating,
  stats,
  href,
  tags = [],
}: {
  image?: string;
  price?: string;
  level?: string;
  provider?: string;
  title?: string;
  author?: string;
  desc?: string;
  rating?: number;
  stats?: { enroll?: number; duration?: string | number };
  href?: string;
  tags?: string[];
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="relative">
        {image ? (
          <img src={image} alt={title || "Course"} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-slate-100" />
        )}
        {price && <span className="absolute top-2 left-2 bg-black/80 text-white text-[11px] font-semibold px-2 py-1 rounded">{price}</span>}
        {level && <span className="absolute top-2 right-2 bg-blue-600 text-white text-[11px] font-semibold px-2 py-1 rounded">{level}</span>}
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>{provider}</span>
          {typeof rating === "number" && <span className="inline-flex items-center gap-1 text-amber-500">★ {rating.toFixed(1)}</span>}
        </div>
        <h3 className="font-semibold text-base leading-snug">{title}</h3>
        {author && <p className="text-xs text-slate-500 mt-0.5">by {author}</p>}
        {desc && <p className="text-sm text-slate-600 line-clamp-2 mt-1">{desc}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-500 gap-4">
          <span className="inline-flex items-center gap-1">
            <FiClock className="h-3.5 w-3.5" />
            {stats?.duration ?? 0} hours
          </span>
          <span className="inline-flex items-center gap-1">
            <FiUsers className="h-3.5 w-3.5" />
            {Number(stats?.enroll ?? 0)} 
          </span>
        </div>
        <a href={href || "#"} className="mt-auto inline-flex items-center justify-center w-full rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 text-sm font-medium py-2 hover:bg-indigo-100">
          Visit Course
        </a>
      </div>
    </article>
  );
}