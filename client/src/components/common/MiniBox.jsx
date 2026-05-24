import React from "react";

export default function MiniBox({
  label,
  value,
  danger = false,
  cyan = false,
  amber = false,
  purple = false,
}) {
  const color = danger
    ? "text-rose-300"
    : cyan
    ? "text-cyan-300"
    : amber
    ? "text-amber-300"
    : purple
    ? "text-purple-300"
    : "text-slate-300";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-sm font-black ${color}`}>
        {value}
      </p>
    </div>
  );
}