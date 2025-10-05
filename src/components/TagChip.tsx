"use client";
import React from "react";
import Link from "next/link";

const slugify = (s = "") => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export default function TagChip({ name, count }: { name: string; count?: number }) {
  const href = `/tags/${slugify(name)}`;
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-rose-200 hover:bg-rose-50 transition"
    >
      {name}
      {typeof count === "number" && (
        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-[11px] px-1.5 py-0.5">{count}</span>
      )}
    </Link>
  );
}