import React from "react";

export default function PageDot({ color = "#7c3a4d" }: { color?: string }) {
  // Dùng CSS variable để Tailwind giữ được class literal, giá trị màu thay đổi runtime
  return (
    <span
      className="inline-block w-2 h-2 rounded-full bg-[var(--dot-color)] mr-2 align-middle"
      style={{ ["--dot-color"]: color } as React.CSSProperties }
    />
  );
}