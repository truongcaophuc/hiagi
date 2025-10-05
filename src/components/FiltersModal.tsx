"use client";
import React, { useEffect, useState } from "react";

const PRICING_OPTIONS = [
  "Free Trial",
  "Free",
  "Paid",
  "Waiting list",
  "Usage Based",
  "Contact for Pricing",
  "Subscription",
  "Visit site",
  "Others",
];

const FORM_OPTIONS = ["Website", "App", "Browser Extension"];

export type FiltersState = {
  pricing: Set<string>;
  form: Set<string>;
};

export default function FiltersModal({
  open,
  onClose,
  onApply,
  initial = {
    pricing: new Set(["Free Trial", "Free", "Paid", "Waiting list", "Usage Based"]),
    form: new Set<string>(),
  },
}: {
  open: boolean;
  onClose?: () => void;
  onApply?: (f: FiltersState) => void;
  initial?: FiltersState;
}) {
  const [pricing, setPricing] = useState<Set<string>>(new Set(initial.pricing));
  const [form, setForm] = useState<Set<string>>(new Set(initial.form));

  useEffect(() => {
    if (open) {
      setPricing(new Set(initial.pricing));
      setForm(new Set(initial.form));
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) =>
    setter((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="w-[min(480px,96vw)] bg-white rounded-2xl border border-[#F6B2C3] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[#FDE7ED] border-b border-[#F6B2C3]">
          <h3 className="text-xl font-extrabold text-[#C13B5D]">Filter Tools</h3>
          <button
            onClick={onClose}
            className="text-[#C13B5D] hover:text-[#a82c4a] text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-7 bg-white">
          <div>
            <h4 className="font-bold text-[#0F172A] mb-2">Pricing</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {PRICING_OPTIONS.map((opt) => (
                <label key={opt} className="inline-flex items-center gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#E5E7EB] text-[#C13B5D] focus:ring-[#F6B2C3]"
                    checked={pricing.has(opt)}
                    onChange={() => toggle(setPricing, opt)}
                  />
                  <span className="text-[#334155]">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#F6B2C3]/40" />

          <div>
            <h4 className="font-bold text-[#0F172A] mb-2">Form</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
              {FORM_OPTIONS.map((opt) => (
                <label key={opt} className="inline-flex items-center gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#E5E7EB] text-[#C13B5D] focus:ring-[#F6B2C3]"
                    checked={form.has(opt)}
                    onChange={() => toggle(setForm, opt)}
                  />
                  <span className="text-[#334155]">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 bg-[#FDE7ED] border-t border-[#F6B2C3]">
          <button
            className="px-4 py-2 rounded-xl border border-[#E5E7EB] bg-white font-semibold text-[#C13B5D] hover:bg-[#FDE7ED]"
            onClick={() => {
              setPricing(new Set());
              setForm(new Set());
            }}
          >
            Clear filters
          </button>
          <div className="ml-auto" />
          <button
            className="px-5 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-[#C13B5D] to-[#F6B2C3] hover:opacity-90"
            onClick={() => onApply?.({ pricing, form })}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}