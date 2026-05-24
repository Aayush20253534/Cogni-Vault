import React from "react";

export default function IconButton({
  icon: Icon,
  onClick,
  cyan = false,
  green = false,
  purple = false,
  red = false,
  disabled = false,
  className = "",
}) {
  const color = cyan
    ? "hover:text-cyan-300 hover:border-cyan-500/30"
    : green
    ? "hover:text-emerald-300 hover:border-emerald-500/30"
    : purple
    ? "hover:text-purple-300 hover:border-purple-500/30"
    : red
    ? "hover:text-rose-300 hover:border-rose-500/30"
    : "hover:text-cyan-300 hover:border-cyan-500/30";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 transition disabled:cursor-not-allowed disabled:text-slate-700 ${color} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}