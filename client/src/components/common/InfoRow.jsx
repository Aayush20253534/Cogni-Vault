import React from "react";

export default function InfoRow({
  label,
  value,
  cyan = false,
  amber = false,
  purple = false,
  red = false,
  className = "",
}) {
  const color = cyan
    ? "text-cyan-300"
    : amber
    ? "text-amber-300"
    : purple
    ? "text-purple-300"
    : red
    ? "text-rose-300"
    : "text-slate-300";

  return (
    <div className={`flex items-start justify-between gap-4 text-[10px] ${className}`}>
      <span className="shrink-0 text-slate-600">{label}:</span>
      <span className={`text-right font-medium ${color}`}>{value}</span>
    </div>
  );
}