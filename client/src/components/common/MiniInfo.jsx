import React from "react";

export default function MiniInfo({
  label,
  value,
  cyan = false,
  amber = false,
  purple = false,
}) {
  const color = cyan
    ? "text-cyan-300"
    : amber
    ? "text-amber-300"
    : purple
    ? "text-purple-300"
    : "text-slate-300";

  return (
    <div>
      <p className="text-slate-600">
        {label.toUpperCase()}:
      </p>

      <p className={`truncate font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}