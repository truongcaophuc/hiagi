import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] mt-9 py-6 bg-gradient-to-t from-[#F9FAFB] to-white">
      <div className="container mx-auto px-5 grid gap-4 grid-cols-[2fr_1fr_1fr_1.2fr] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
        <div>
          <div className="flex items-center gap-2 font-extrabold tracking-[0.3px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
          </div>
          <p className="text-[#64748B]">Easily access every list of the best AI tools, only with HiAGI</p>
        </div>

        <div>
          <div className="font-extrabold mb-2 text-[#0F172A]">Favorite list tool</div>
          <div className="text-[#64748B]">Category</div>
          <div className="text-[#64748B]">Most used</div>
        </div>

        <div>
          <div className="font-extrabold mb-2 text-[#0F172A]">Join newsletter</div>
          <div className="text-[#64748B]">Get 100+ free AI tools &amp; tips</div>
          <div className="flex gap-2 mt-2">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Your email"
              className="flex-1 rounded-xl border border-[#E5E7EB] px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#F6B2C3] focus:ring-2 focus:ring-[#FDE7ED]"
            />
            <button className="px-4 py-2 rounded-xl font-bold text-white bg-[#C13B5D] hover:opacity-90">Subscribe</button>
          </div>
        </div>

        <div className="text-[#64748B] self-end text-right space-y-1">
          <div>Copyright © Bestlist.ai – All Rights Reserved</div>
          <div>
            <a href="#" className="hover:underline">Terms and Conditions</a> &amp; <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}