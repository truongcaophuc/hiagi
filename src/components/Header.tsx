"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  if (pathname === "/login") {
    return null;
  }
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-2xs">
      <div className="max-w-[1400px] mx-auto h-[66px] px-5 grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-[0.3px]">
          <img
            src="https://hiagi.ai/hilab_logo.svg"
            alt="HiAGI logo"
            className="w-[30px] h-[30px] rounded-lg shadow-[0_6px_16px_rgba(193,59,93,.25)]"
            style={{ background: "linear-gradient(135deg, var(--brand-2), var(--brand))" }}
          />
          <span className="text-[20px]">
            <span className="text-[#c13b5d]">Hi</span>
            <span className="text-black">AGI</span>
          </span>
        </Link>

        {/* Centered nav links */}
        <div className="flex items-center justify-center gap-[18px] font-bold text-[#334155]">
          <Link href="/tags" className="opacity-90 hover:opacity-100 hover:[text-shadow:0_0_6px_var(--brand-200)]">Tags</Link>
          <Link href="/tutorials" className="opacity-90 hover:opacity-100 hover:[text-shadow:0_0_6px_var(--brand-200)]">Tutorials</Link>
          <Link href="/prompts" className="opacity-90 hover:opacity-100 hover:[text-shadow:0_0_6px_var(--brand-200)]">Prompts</Link>
          <Link href="/courses" className="opacity-90 hover:opacity-100 hover:[text-shadow:0_0_6px_var(--brand-200)]">Courses</Link>
          <Link href="/tools" className="opacity-90 hover:opacity-100 hover:[text-shadow:0_0_6px_var(--brand-200)]">Tools</Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center justify-end relative" ref={menuRef}>
          {status === "authenticated" && session?.user ? (
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-2 py-1 rounded-[12px] border border-[var(--bd)] bg-white text-[var(--text)] hover:bg-[#f9fafb] hover:border-[#d1d5db]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(session.user as any).image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(session.user.name || session.user.email || "User")}
                alt={session.user.name || session.user.email || "User"}
                className="w-8 h-8 rounded-full border"
              />
              <span className="font-bold text-sm max-w-[160px] truncate">{session.user.name || session.user.email}</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-[12px] font-bold border border-[var(--bd)] bg-white text-[var(--text)] hover:bg-[#f9fafb] hover:border-[#d1d5db]"
            >
              Sign in
            </Link>
          )}

          {open && (
            <div className="absolute right-0 top-[52px] w-[220px] bg-white border border-[#E5E7EB] rounded-[12px] shadow-xl overflow-hidden">
              <Link
                href="/favorites"
                className="block px-4 py-3 text-sm font-semibold text-[#334155] hover:bg-[#f9fafb]"
                onClick={() => setOpen(false)}
              >
                Favorites
              </Link>
              <button
                className="w-full text-left px-4 py-3 text-sm font-semibold text-[#c13b5d] hover:bg-[#fde7ed]"
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}