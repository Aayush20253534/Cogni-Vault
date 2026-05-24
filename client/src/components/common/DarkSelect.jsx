import React from "react";
import { ChevronDown } from "lucide-react";

export default function DarkSelect({
  icon,
  value,
  onChange,
  options = [],
  className = "",
}) {
  return (
    <div
      className={`relative flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 backdrop-blur-xl transition hover:border-cyan-500/20 sm:w-auto ${className}`}
    >
      {/* LEFT ICON */}
      {icon && (
        <div className="flex items-center text-slate-500">
          {icon}
        </div>
      )}

      {/* SELECT */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          appearance-none
          bg-transparent
          pr-6
          font-mono
          text-[11px]
          font-bold
          uppercase
          tracking-wide
          text-slate-300
          outline-none
          cursor-pointer
        "
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-slate-950 text-slate-300"
          >
            {option}
          </option>
        ))}
      </select>

      {/* CUSTOM ARROW */}
      <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-slate-600" />
    </div>
  );
}