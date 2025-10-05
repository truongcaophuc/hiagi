"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-slate-500 text-sm">
      <span>{value}</span>
      <span>{label}</span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-sky-50 text-sky-700 text-xs px-2 py-1">
      {children}
    </span>
  );
}

export default function PromptCard(props: {
  image?: string;
  title?: string;
  desc?: string;
  uses?: number | string;
  views?: number | string;
  fieldTags?: string[];
  tags?: string[];
  source?: string;
  tool?: string;
  prompt?: string;
  href?: string;
}) {
  const {
    image,
    title,
    desc,
    uses,
    views,
    fieldTags = [],
    tags = [],
    source,
    tool,
    prompt,
    href = "#",
  } = props;
  const [open, setOpen] = useState(false);
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedModal, setCopiedModal] = useState(false);
  const copyMainTimer = useRef<number | null>(null);
  const copyModalTimer = useRef<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<number | null>(null);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const allTags =
    (Array.isArray(fieldTags) && fieldTags.length ? fieldTags : tags) || [];

  const handleCopy = (isModal?: boolean) => {
    navigator.clipboard?.writeText(prompt || "");

    // Toast visibility
    setToastVisible(true);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastVisible(false), 2000);

    // Button label state
    if (isModal) {
      setCopiedModal(true);
      if (copyModalTimer.current) window.clearTimeout(copyModalTimer.current);
      copyModalTimer.current = window.setTimeout(
        () => setCopiedModal(false),
        1500
      );
    } else {
      setCopiedMain(true);
      if (copyMainTimer.current) window.clearTimeout(copyMainTimer.current);
      copyMainTimer.current = window.setTimeout(
        () => setCopiedMain(false),
        1500
      );
    }
  };
  return (
    <article className="relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm over overflow-hidden">
      <div className="aspect-[16/9] w-full overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title || "Prompt"}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setOpen(true)}
          />
        ) : (
          <div className="w-full h-full bg-slate-100" />
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-lg leading-snug">{title}</h3>
        {desc && (
          <p className="mt-1 text-sm text-slate-600 line-clamp-3">{desc}</p>
        )}
        <div className="mt-4 flex items-center gap-4">
          <Stat
            label="uses"
            value={
              typeof uses === "number" ? Intl.NumberFormat().format(uses) : uses
            }
          />
          <Stat
            label="views"
            value={
              typeof views === "number"
                ? Intl.NumberFormat().format(views)
                : views
            }
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        {/* <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 text-xs px-2 py-1">
            {source || tool}
          </span>
        </div> */}
        {prompt && (
          <div>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 leading-6">
              <div className="line-clamp-3"> {prompt}</div>
            </div>
          </div>
        )}
        <button
          className="mt-auto w-full rounded-xl py-2.5 text-white text-sm font-semibold shadow-sm transition active:translate-y-[1px] bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700"
          onClick={() => handleCopy(false)}
        >
          {copiedMain ? "Copied" : "Copy Prompt"}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 grid place-items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-[50%] p-5 bg-white rounded-2xl shadow-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close (X) icon */}
            <button
              type="button"
              aria-label="Close"
              className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full p-2 text-slate-600 hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* Thumbnail */}
            {image && (
              <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={image}
                  alt={title || "Prompt"}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}

            <div className="p-5 h-full flex flex-col gap-2">
              {/* Title */}
              <h3 className="font-bold text-lg">{title}</h3>

              {/* Stats */}
              <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                <Stat
                  label="uses"
                  value={
                    typeof uses === "number"
                      ? Intl.NumberFormat().format(uses)
                      : uses
                  }
                />
                <Stat
                  label="views"
                  value={
                    typeof views === "number"
                      ? Intl.NumberFormat().format(views)
                      : views
                  }
                />
              </div>

              {/* Tags */}
              {!!fieldTags?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {fieldTags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              )}

              {/* Tool/Source */}
              {(source || tool) && (
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 text-xs px-2 py-1">
                    {source || tool}
                  </span>
                </div>
              )}

              {/* Description */}
              {desc && <p className="mt-3 text-sm text-slate-600">{desc}</p>}

              {/* Prompt content + copy */}
              {prompt && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                      Prompt
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-violet-300 bg-violet-50 text-violet-700 px-3 py-1.5 text-sm hover:bg-violet-100"
                      onClick={() => handleCopy(true)}
                    >
                      {copiedModal ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 leading-6">
                    {prompt}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toastVisible && (
        <div
          className="fixed bottom-4 right-4 z-[70] rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-2 text-sm shadow-sm"
          role="status"
          aria-live="polite"
        >
          Đã copy vào clipboard
        </div>
      )}
    </article>
  );
}
