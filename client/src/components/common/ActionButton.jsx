import React from "react";
import { Eye } from "lucide-react";

export default function ActionButton({
  label,
  onClick,
  cyan = false,
  amber = false,
  red = false,
  green = false,
  purple = false,
  icon = null,
  disabled = false,
  className = "",
}) {
  const colorClasses = cyan
    ? "hover:border-cyan-500/30 hover:text-cyan-300"
    : amber
    ? "border-amber-500/20 bg-amber-500/10 text-amber-300 hover:border-amber-500/40"
    : red
    ? "border-rose-500/20 bg-rose-500/10 text-rose-300 hover:border-rose-500/40"
    : green
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500/40"
    : purple
    ? "border-purple-500/20 bg-purple-500/10 text-purple-300 hover:border-purple-500/40"
    : "hover:border-cyan-500/20 hover:text-cyan-300";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        gap-1
        rounded-lg
        border
        border-slate-800
        bg-slate-900
        px-2.5
        py-1
        text-[9px]
        font-bold
        uppercase
        tracking-widest
        text-slate-400
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-40
        ${colorClasses}
        ${className}
      `}
    >
      {icon ? (
        icon
      ) : cyan ? (
        <Eye className="h-3 w-3" />
      ) : null}

      {label}
    </button>
  );
}