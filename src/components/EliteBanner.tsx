import React from "react";

export default function EliteBanner() {
  return (
    <div className="flex justify-center px-5 py-[30px] max-w-[1300px] mx-auto">
      <div
        className="relative flex flex-col items-center text-center gap-1.5 px-7 py-5 rounded-[28px] overflow-hidden border border-[var(--brand-200)] shadow-[0_10px_30px_rgba(193,59,93,.12)]"
        style={{ background: "linear-gradient(180deg,var(--brand-50),var(--brand-100))" }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 animate-[eliteShine_3.2s_ease-in-out_infinite]"
          style={{ background: "linear-gradient(120deg,transparent 30%,rgba(255,255,255,.6) 50%,transparent 70%)", WebkitMaskImage: "linear-gradient(#000,#000)" }}
        />
        <style>{`@keyframes eliteShine { 0% { transform: translateX(-120%); } 60%,100% { transform: translateX(120%); } }`}</style>

        <h2 className="m-0 font-extrabold text-[clamp(20px,2.4vw,28px)] tracking-[0.4px] text-[var(--text)]">
          <span className="opacity-90 text-[0.95em]">✨ 🧠 ⚡</span> ELITE TOOLS <span className="opacity-90 text-[0.95em]">✨ 🧠 ⚡</span>
        </h2>
        <p className="m-0 text-[clamp(13px,1.6vw,15px)] text-[var(--muted)]">Handpicked by Bestlist AI • Verified by Experts</p>
      </div>
    </div>
  );
}