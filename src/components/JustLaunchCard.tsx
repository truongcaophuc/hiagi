"use client";
import React, { useEffect, useState } from "react";
import { FiHeart, FiClock, FiSearch, FiExternalLink, FiX, FiTag, FiDollarSign } from "react-icons/fi";
import Link from "next/link";
import { addUserFavorite, removeUserFavorite, getUserFavorites } from "../lib/api";
import { getAuthToken } from "../lib/auth";

type Item = {
  id?: string | number;
  slug?: string;
  name: string;
  desc?: string;
  thumb?: string;
  tags?: string[];
  favCount?: number;
  updatedAt?: string;
  url?: string;
  pricing?: string;
};

export default function JustLaunchCard({ item }: { item?: Item }) {
  if (!item) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-gray-100 h-[270px]">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.1s_infinite] [background:linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent)]" />
        <style>{`@keyframes shimmer { to { transform: translateX(100%); } }`}</style>
      </div>
    );
  }

  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    (async () => {
      try {
        const list = await getUserFavorites();
        setFav(!!list.find((x: any) => String((x as any)._id || x.id) === String(item.id)));
      } catch {}
    })();
  }, [item.id]);

  const onToggleFav = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const token = getAuthToken();
    if (!token) {
      setLoginOpen(true);
      return;
    }
    try {
      if (fav) {
        await removeUserFavorite(String(item.id));
        setFav(false);
      } else {
        await addUserFavorite(String(item.id));
        setFav(true);
      }
    } catch (err: any) {
      const msg = String(err?.message || "");
      if (msg.includes("Unauthorized") || msg.includes("401")) {
        setLoginOpen(true);
      }
    }
  };

  return (
    <div className="h-full">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        }}
        className="bg-white border border-[#E5E7EB] rounded-2xl shadow overflow-hidden flex flex-col relative transition h-full hover:-translate-y-[2px] hover:border-[#F6B2C3] hover:shadow-lg cursor-pointer"
      >
        <div className="relative h-40 bg-[linear-gradient(135deg,#FDE7ED,#fff)] flex items-center justify-center">
          {item.thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.thumb} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#7e1f39] font-extrabold tracking-wider">No Image</span>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={onToggleFav}
              aria-label={fav ? "Bỏ yêu thích" : "Yêu thích"}
              className={`rounded-full p-2 shadow-sm border ${fav ? "bg-rose-600 border-rose-700" : "bg-white/90 hover:bg-white border-slate-200"}`}
            >
              <FiHeart className={fav ? "text-white" : "text-rose-600"} />
            </button>
            {item.url && (
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
            )}
          </div>
        </div>

        <div className="p-3 flex-1 flex flex-col">
          <h3 className="text-lg font-extrabold mb-1 text-[#0F172A]">{item.name}</h3>
          <p className="text-sm text-[#64748B] line-clamp-2">{item.desc}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {(item.tags || []).map((t) => (
              <Link key={t} href={`/tags/${encodeURIComponent(String(t))}`} className="px-2 py-1 text-xs rounded-full border border-[#E5E7EB] bg-white text-[#334155]">
                {t}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t border-[#E5E7EB] text-sm text-[#64748B]">
          <span className="inline-flex items-center gap-3">
  
     

            <span className="inline-flex items-center gap-1 ml-1">
              <FiHeart className="text-rose-500" />
              {Number(item.favCount ?? 0).toLocaleString()}
            </span>

            {item.updatedAt && (() => {
              const d = new Date(item.updatedAt);
              const txt = isNaN(d.getTime()) ? null : d.toLocaleDateString();
              return txt ? (
                <span className="inline-flex items-center gap-1">
                  <FiClock />
                  {txt}
                </span>
              ) : null;
            })()}
          </span>
        
        </div>
      </div>

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
                <div className="text-2xl font-[700] text-slate-900">{item.name}</div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border shadow-xl bg-white text-black px-10 py-2 font-semibold hover:bg-slate-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit
                  </a>
                )}
              </div>
              {!!(item.tags && item.tags.length) && (
                <div className="p-4">
                  <div className="text-slate-500 mb-2 inline-flex items-center gap-1"><FiTag /> Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {(item.tags || []).map((t) => (
                      <span key={t} className="px-2 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 space-y-3 flex-1">
                {item.desc && <p className="text-slate-700 leading-6">{item.desc}</p>}
                <div className="shadow-xl rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {item.thumb ? (
                    <img src={item.thumb} alt={`${item.name || "Tool"} thumbnail`} className="w-full border border-slate-200 object-cover" />
                  ) : (
                    <div className="w-full h-48 border border-slate-200 bg-[linear-gradient(135deg,#EEF4FF,#fff)] flex items-center justify-center">
                      <span className="text-[#1d4ed8] font-extrabold tracking-wider">No Image</span>
                    </div>
                  )}
                </div>
                {!!item.pricing && (
                  <div className="text-slate-700 flex flex-col gap-2">
                    <div className="text-slate-500 inline-flex items-center gap-1 text-lg font-[600]">Pricing:</div>
                    <div className="px-4 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-700">{item.pricing}</div>
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
    </div>
  );
}



