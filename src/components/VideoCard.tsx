"use client";
import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1200";

export default function VideoCard({
  title = "Untitled Video",
  desc = "",
  thumb,
  duration = "",
  views = "",
  tags = [],
  youtubeUrl,
  embedUrl,
  toolUrl,
  onClick,
}: {
  title?: string;
  desc?: string;
  thumb?: string;
  duration?: string;
  views?: string;
  tags?: string[];
  youtubeUrl?: string;
  embedUrl?: string;
  toolUrl?: string;
  onClick?: () => void;
}) {
  const imgSrc = thumb || FALLBACK_THUMB;
  const [open, setOpen] = useState(false);
  const embed = useMemo(() => {
    if (embedUrl) return embedUrl;
    if (!youtubeUrl) return "";
    try {
      const u = new URL(youtubeUrl);
      const id = u.searchParams.get("v") || u.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    } catch {
      return "";
    }
  }, [embedUrl, youtubeUrl]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-[2px] transition flex flex-col">
      {/* Thumb */}
      <div
        className="relative aspect-[16/9] bg-slate-100 overflow-hidden"
        onClick={
          onClick ||
          ((e) => {
            e.stopPropagation();
            setOpen(true);
          })
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={title}
          className="w-full object-cover"
          loading="lazy"
        />

        {/* Play overlay */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="size-12 grid place-items-center rounded-full bg-white/90 shadow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* duration */}
        {!!duration && (
          <span className="absolute top-2 right-2 rounded-md bg-black/70 text-white text-[11px] px-2 py-0.5">
            {duration}
          </span>
        )}
      </div>

      {/* Body */}
      <div
        className="p-4 flex flex-col gap-2 flex-1"
        onClick={
          onClick ||
          ((e) => {
            e.stopPropagation();
            setOpen(true);
          })
        }
      >
        <h3 className="font-extrabold text-slate-900 text-[15px] line-clamp-2">
          {title}
        </h3>
        {desc && <p className="text-sm text-slate-600 line-clamp-3">{desc}</p>}

        <div className="flex items-center gap-3 text-xs text-slate-500">
          {!!views && <span>👁️ {views}</span>}
        </div>

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-block text-xs px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          className="mt-auto rounded-lg  bg-white text-rose-700 font-semibold py-2 hover:bg-rose-50 border border-rose-600"
        >
          Watch tutorial
        </button>
      </div>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] bg-black/40 grid place-items-center"
            onClick={(e) => {
              if (e.currentTarget === e.target) setOpen(false);
            }}
          >
            <div
              className="w-[70%] max-h-[80%] bg-white rounded-2xl shadow-lg overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Video embed */}
              {embed ? (
                <div className="aspect-[16/9] bg-black">
                  <iframe
                    src={embed}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-slate-100 grid place-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Details card under video */}
              <div className="p-5 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-bold text-lg text-slate-900">
                      {title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      {!!duration && <span>⏱ {duration}</span>}
                      {!!views && <span>👁️ {views}</span>}
                    </div>
                  </div>
                  {toolUrl && (
                    <div className="mt-3">
                      <a
                        href={toolUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-md border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-sm px-3 py-2"
                      >
                        Visit Tool
                      </a>
                    </div>
                  )}
                </div>

                {Array.isArray(tags) && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 text-xs rounded-full border border-slate-200 bg-slate-50 text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {desc && (
                  <p className="text-sm text-slate-700 leading-6">{desc}</p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </article>
  );
}
