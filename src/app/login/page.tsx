"use client";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import SectionShell from "@/components/SectionShell";
import PageDot from "@/components/PageDot";

export default function LoginPage() {
  const { status } = useSession();

  const handleGoogleLogin = () => {
    // Yêu cầu Google hiển thị chọn tài khoản mỗi lần
    signIn("google", { callbackUrl: "/", prompt: "select_account" } as any);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-white">
      <section className="pt-10 pb-4">
        <SectionShell>
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hiagi.ai/hilab_logo.svg"
                alt="HiAGI logo"
                className="w-[40px] h-[40px] rounded-lg shadow-[0_6px_16px_rgba(193,59,93,.25)]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-2), var(--brand))",
                }}
              />
            </div>
            <h1 className="text-[34px] sm:text-[40px] font-black tracking-tight text-slate-900">
              Welcome to Hiagi
            </h1>
          </div>
        </SectionShell>
      </section>
      <SectionShell>
        <div className="max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-6 text-center">
          {/* Logo above Google button */}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="inline-flex items-center gap-2 px-20 py-4 rounded-[12px] bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            <img
              src="https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
          {status !== "unauthenticated" && (
            <div className="mt-4 text-sm text-slate-700">
              {status === "loading"
                ? "Đang tải phiên đăng nhập…"
                : status === "authenticated"
                ? "Đã đăng nhập."
                : null}
            </div>
          )}
        </div>
      </SectionShell>
    </div>
  );
}
