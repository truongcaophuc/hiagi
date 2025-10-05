"use client";
import React from "react";
import Link from "next/link";

const slugify = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function TagCard({
  name,
  count,
}: {
  name: string;
  count: number;
}) {
  const href = `/tags/${slugify(name)}`;
  return (
    <Link href={href} className="block">
      <div className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-[linear-gradient(135deg,rgba(193,59,93,.25),rgba(255,255,255,0))] before:opacity-0 group-hover:before:opacity-100 before:transition">
        <span className="absolute right-3 top-3 w-2 h-2 rounded-full bg-blue-400/80" />
        <div className="text-[13px] text-slate-500 mb-2">Category</div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[17px] font-extrabold text-slate-900 leading-none">
              {name}
            </h3>
            <div className="mt-1 text-[12px] text-slate-500">{count} tools</div>
          </div>
          <div className="relative z-[1] text-[12px] font-semibold text-slate-600 hover:text-rose-600 transition">
            Explore →
          </div>
        </div>
      </div>
    </Link>
  );
}
