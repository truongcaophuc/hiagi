"use client";
import React from "react";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1523246191815-44bce67708f3?q=80&w=1200";

export default function FeaturedVideoCard({
  title = "Untitled Video",
  thumb,
  duration = "",
  onClick,
}: {
  title?: string;
  thumb?: string;
  duration?: string;
  onClick?: () => void;
}) {
  const imgSrc = thumb || FALLBACK_THUMB;
  return (
    <article
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-[2px] transition cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* badges */}
        <span className="absolute top-2 left-2 rounded-md bg-black/70 text-white text-[11px] px-2 py-0.5">
          Bestlist
        </span>
        {!!duration && (
          <span className="absolute top-2 right-2 rounded-md bg-black/70 text-white text-[11px] px-2 py-0.5">
            {duration}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-extrabold text-slate-900 text-base line-clamp-2">
          {title}
        </h3>

        <button
          type="button"
          onClick={onClick}
          className="mt-auto w-full rounded-lg text-rose-600 bg-white font-semibold py-2 hover:bg-rose-50 border border-rose-600">
          Watch tutorial
        </button>
      </div>
    </article>
  );
}

