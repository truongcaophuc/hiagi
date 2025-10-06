"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  FiHeart,
  FiSearch,
  FiExternalLink,
  FiX,
  FiClock,
  FiTag,
  FiDollarSign,
  FiCheckCircle,
} from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";

export type ToolCardItem = {
  id?: number | string;
  name?: string;
  desc?: string;
  url?: string;
  tags?: string[];
  views?: number;
  pricing?: string;
  thumb?: string;
  favCount?: number;
  updatedAt?: string;
  useCases?: string[];
};

export default function ToolCard({
  item,
  thumbShape = "rect",
}: {
  item: ToolCardItem;
  thumbShape?: "rect" | "circle";
}) {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const updated = useMemo(() => {
    if (!item.updatedAt) return undefined;
    const d = new Date(item.updatedAt);
    return isNaN(d.getTime()) ? undefined : d.toLocaleDateString();
  }, [item.updatedAt]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hasThumb = !!item.thumb;

  return (
    <>
      <article
        className="relative overflow-hidden rounded-[22px] border border-transparent shadow-[0_12px_34px_rgba(193,59,93,.16)] transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_22px_44px_rgba(193,59,93,.22)] hover:saturate-[1.05] flex flex-col"
        style={{ background: "linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg,#F6B2C3,#FDE7ED) border-box" }}
        onClick={() => setOpen(true)}
        role="button"
        aria-label="Open tool details"
      >
        {thumbShape === "rect" ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {hasThumb ? (
              <img
                src={item.thumb as string}
                alt={`${item.name || "Tool"} thumbnail`}
                loading="lazy"
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FDE7ED,#fff)" }}>
                <span className="text-[#7e1f39] font-extrabold tracking-wider">No Image</span>
              </div>
            )}
            <div className="absolute top-3 right-3 flex gap-2">
              {/* Favorite toggle */}
              <FavButton item={item} onUnauthorized={() => setLoginOpen(true)} />
             
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Visit"
                className="rounded-full bg-white/90 hover:bg-white p-2 shadow-sm border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink className="text-slate-700" />
              </a>
            </div>
          </div>
        ) : (
          <div className="relative p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {hasThumb ? (
                    <img
                      src={item.thumb as string}
                      alt={item.name || "thumb"}
                      className="h-12 w-12 rounded-full border border-slate-200 shadow-sm object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full border border-slate-200 shadow-sm flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FDE7ED,#fff)" }}>
                      <span className="text-[10px] text-[#7e1f39] font-extrabold tracking-wider">No Img</span>
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 inline-block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                </div>
                <div className="m-0 text-lg font-[600]">{item.name}</div>
              </div>
              <div className="flex gap-2">
                <FavButton item={item} onUnauthorized={() => setLoginOpen(true)} />
                <button
                  type="button"
                  aria-label="Details"
                  className="rounded-full bg-white/90 hover:bg-white p-2 shadow-sm border border-slate-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(true);
                  }}
                >
                  <FiSearch className="text-slate-700" />
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Visit"
                  className="rounded-full bg-white/90 hover:bg-white p-2 shadow-sm border border-slate-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink className="text-slate-700" />
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col p-4 h-full">
          {thumbShape === "rect" && (
            <div className="flex items-center gap-3">
              <h3 className="m-0 text-lg font-[600]">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.name}
                </a>
              </h3>
            </div>
          )}

          {!!item.desc && (
            <p className="mt-1 leading-6 text-[#64748B] line-clamp-3">
              {item.desc}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            {(() => {
              const tags = Array.isArray(item.tags) ? item.tags : [];
              const MAX = 3;
              const shown = tags.slice(0, MAX);
              const rest = Math.max(0, tags.length - shown.length);
              return (
                <>
                  {shown.map((t) => (
                    <span key={t} className="rounded-full border border-[#d6dfec] bg-white px-2 py-1 text-slate-700">
                      {t}
                    </span>
                  ))}
                  {rest > 0 && (
                    <span className="rounded-full border border-[#d6dfec] bg-white px-2 py-1 text-slate-700">+{rest}</span>
                  )}
                </>
              );
            })()}
          </div>

          {!!(updated || item.favCount) && (
            <div className="mt-3 flex items-center gap-4 text-slate-600">
              {typeof item.favCount === "number" && (
                <span className="inline-flex items-center gap-1">
                  <FiHeart className="text-rose-500" />
                  {item.favCount}
                </span>
              )}
              {updated && (
                <span className="inline-flex items-center gap-1">
                  <FiClock />
                  {updated}
                </span>
              )}
            </div>
          )}
        </div>
      </article>

      {open && (
        <div
          className="fixed inset-0 z-[1000] bg-black/40 grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.currentTarget === e.target) setOpen(false);
          }}
        >
          <div className="relative w-[70%] rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col max-h-[80vh] overflow-hidden">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-white/90 hover:bg-white p-2 shadow-sm border border-slate-200"
            >
              <FiX className="text-slate-700" />
            </button>
            <div className="overflow-y-auto px-20 py-10">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <div className="text-2xl font-[700] text-slate-900">
                  {item.name}
                </div>
                <div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border shadow-xl bg-white text-black px-10 py-2 font-semibold hover:bg-slate-100"
                  >
                    Visit
                  </a>
                </div>
              </div>

              {!!(item.tags && item.tags.length) && (
                <div className="p-4">
                  <div className="text-slate-500 mb-2 inline-flex items-center gap-1">
                    <FiTag /> Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(item.tags || []).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 space-y-3 flex-1">
                {item.desc && (
                  <p className="text-slate-700 leading-6">{item.desc}</p>
                )}

                {/* Thumbnail dưới phần mô tả */}
                <div className="shadow-xl rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {hasThumb ? (
                    <img
                      src={item.thumb as string}
                      alt={`${item.name || "Tool"} thumbnail`}
                      className="w-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 border border-slate-200 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FDE7ED,#fff)" }}>
                      <span className="text-[#7e1f39] font-extrabold tracking-wider">No Image</span>
                    </div>
                  )}
                </div>

                {!!(item.useCases && item.useCases.length) && (
                  <div className="mt-10">
                    <div className="text-slate-500 mb-1 inline-flex items-center gap-1 text-2xl font-[600]">
                      Use cases
                    </div>
                    <ul className=" text-slate-700 space-y-1">
                      {(item.useCases || []).map((u, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <FiCheckCircle
                            style={{ color: "green" }}
                            className="mt-0.5 text-slate-500"
                          />
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!!item.pricing && (
                  <div className="text-slate-700 flex flex-col gap-2">
                    <div className="text-slate-500 inline-flex items-center gap-1 text-2xl font-[600]">
                      Pricing:
                    </div>
                    <div className="px-4 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-700">
                      {item.pricing}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {loginOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setLoginOpen(false)}
        >
          <div className="w-[min(420px,96vw)] bg-white rounded-2xl border border-[#F6B2C3] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#FDE7ED] border-b border-[#F6B2C3]">
              <h3 className="text-xl font-extrabold text-[#C13B5D]">Vui lòng đăng nhập</h3>
              <button
                onClick={() => setLoginOpen(false)}
                className="text-[#C13B5D] hover:text-[#a82c4a] text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 bg-white">
              <p className="text-sm text-[#334155]">Bạn cần đăng nhập để dùng tính năng Yêu thích.</p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white font-semibold text-[#0F172A] hover:bg-slate-50"
                  onClick={() => setLoginOpen(false)}
                >
                  Đóng
                </button>
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-lg border border-rose-300 bg-rose-600 text-white font-semibold hover:bg-rose-700"
                >
                  Đi tới đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Favorite toggle button using localStorage
function FavButton({ item, onUnauthorized }: { item: ToolCardItem; onUnauthorized?: () => void }) {
  const [fav, setFav] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      try {
        const list = await getUserFavorites();
        setFav(!!list.find((x: any) => String((x as any)._id || x.id) === String(item.id)));
      } catch {}
    })();
  }, [item.id]);

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (fav) {
        await removeUserFavorite(String(item.id));
        setFav(false);
        // refresh favorites lists immediately
        queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
        queryClient.invalidateQueries({ queryKey: ["global-favorites"] });
      } else {
        await addUserFavorite(String(item.id));
        setFav(true);
        // refresh favorites lists immediately
        queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
        queryClient.invalidateQueries({ queryKey: ["global-favorites"] });
      }
    } catch (err: any) {
      const msg = String(err?.message || "");
      if (msg.includes("Unauthorized") || msg.includes("401")) {
        if (onUnauthorized) onUnauthorized();
      }
    }
  };

  return (
    <button
      type="button"
      aria-label={fav ? "Unfavorite" : "Favorite"}
      className={`rounded-full p-2 shadow-sm border ${fav ? "bg-rose-600 border-rose-700" : "bg-white/90 hover:bg-white border-slate-200"}`}
      onClick={toggle}
    >
      <FiHeart className={fav ? "text-white" : "text-rose-600"} />
    </button>
  );
}
import { addUserFavorite, removeUserFavorite, getUserFavorites } from "../lib/api";
