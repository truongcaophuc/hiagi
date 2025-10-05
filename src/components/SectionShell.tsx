import React from "react";

export default function SectionShell({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6">{children}</div>;
}