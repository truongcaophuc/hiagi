"use client";
import React, { useMemo, useState, useEffect } from "react";
import { FiHeart, FiSearch, FiExternalLink, FiX, FiClock, FiTag, FiDollarSign, FiCheckCircle } from "react-icons/fi";

type EliteItem = {
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

export default function EliteCard({ item }: { item: EliteItem }) {
  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState<boolean>(false);
  const updated = useMemo(() => {
    if (!item.updatedAt) return undefined;
    const d = new Date(item.updatedAt);
    return isNaN(d.getTime()) ? undefined : d.toLocaleDateString();
  }, [item.updatedAt]);
  const heart = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e11d48" aria-hidden>
      <path d="M12 21s-6.716-4.314-9.428-7.026C-0.476 11.998.172 8.15 3.07 6.43 5.264 5.096 7.93 5.654 9.5 7.5l.5.6.5-.6c1.57-1.846 4.236-2.404 6.43-.97 2.898 1.72 3.546 5.568.498 7.544C18.716 16.686 12 21 12 21z" />
    </svg>
  );
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // khóa scroll body
    } else {
      document.body.style.overflow = ""; // reset khi đóng
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onToggleFav = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFav((v) => !v);
  };
  return (
    <>
      <article
        className="relative overflow-hidden rounded-[22px] border border-transparent shadow-[0_12px_34px_rgba(193,59,93,.16)] transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_22px_44px_rgba(193,59,93,.22)] hover:saturate-[1.05] flex flex-col"
        style={{ background: "linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg,#F6B2C3,#FDE7ED) border-box" }}
        onClick={() => setOpen(true)}
        role="button"
        aria-label="Open elite tool details"
      >
        <div className="relative">
          {item.thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumb}
              alt={`${item.name} thumbnail`}
              loading="lazy"
              className="h-48 w-full object-cover"
            />
          ) : (
            <div className="h-48 w-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#FDE7ED,#fff)" }}>
              <span className="text-[#7e1f39] font-extrabold tracking-wider">No Image</span>
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            
               <button
              type="button"
              onClick={(e) => onToggleFav(e)}
              aria-label={fav ? "Bỏ yêu thích" : "Yêu thích"}
              className={`rounded-full p-2 shadow-sm border ${fav ? "bg-rose-600 border-rose-700" : "bg-white/90 hover:bg-white border-slate-200"}`}
            >
              <FiHeart className={fav ? "text-white" : "text-rose-600"} />
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

        <div className="flex flex-col p-4 h-full">
          <div className="flex items-center gap-3">
      
            <h3 className="m-0 text-lg font-[600]">{item.name}</h3>
          </div>

          {!!item.desc && (
            <p className="mt-1 text-sm leading-6 text-[#64748B] line-clamp-3">
              {item.desc}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            {(item.tags || []).map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#d6dfec] bg-white px-2 py-1 text-xs text-slate-700"
              >
                {t}
              </span>
            ))}
          </div>

          {!!(updated || item.favCount) && (
            <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
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
                <div className="text-2xl font-[700] text-slate-900">{item.name}</div>
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
                    <div className="w-full h-48 border border-slate-200 bg-[linear-gradient(135deg,#FDE7ED,#fff)] flex items-center justify-center">
                      <span className="text-[#7e1f39] font-extrabold tracking-wider">No Image</span>
                    </div>
                  )}
                </div>

                {!!(item.useCases && item.useCases.length) && (
                  <div className="mt-6">
                    <div className="text-slate-500 mb-1 inline-flex items-center gap-1 text-lg font-[600]">Use cases</div>
                    <ul className="text-slate-700 space-y-1">
                      {(item.useCases || []).map((u, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <FiCheckCircle className="mt-0.5 text-slate-500" />
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
    </>
  );
}
