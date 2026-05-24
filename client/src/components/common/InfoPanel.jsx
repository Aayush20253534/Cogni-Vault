import React from "react";

export default function InfoPanel({
  title,
  icon: Icon,
  color = "cyan",
  children,
  className = "",
}) {
  const theme =
    color === "rose"
      ? "border-rose-500/10 bg-rose-500/10 text-rose-300"
      : color === "purple"
      ? "border-purple-500/10 bg-purple-500/10 text-purple-300"
      : color === "emerald"
      ? "border-emerald-500/10 bg-emerald-500/10 text-emerald-300"
      : "border-cyan-500/10 bg-cyan-500/10 text-cyan-300";

  return (
    <div className={`rounded-xl border p-3.5 ${theme} ${className}`}>
      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {title}
      </div>

      <p className="text-[11px] leading-relaxed text-slate-400">
        {children}
      </p>
    </div>
  );
}