import React from "react";
import { motion } from "framer-motion";

const COLOR_THEMES = {
  cyan: {
    border: "border-cyan-500/20 hover:border-cyan-400/40",
    glow:
      "shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]",
    text: "text-cyan-400",
    iconBg: "bg-cyan-500/10 border-cyan-500/30",
    orb: "bg-cyan-500/10",
    line: "via-cyan-400",
  },
  blue: {
    border: "border-blue-500/20 hover:border-blue-400/40",
    glow:
      "shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]",
    text: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/30",
    orb: "bg-blue-500/10",
    line: "via-blue-400",
  },
  emerald: {
    border: "border-emerald-500/20 hover:border-emerald-400/40",
    glow:
      "shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/30",
    orb: "bg-emerald-500/10",
    line: "via-emerald-400",
  },
  rose: {
    border: "border-rose-500/20 hover:border-rose-400/40",
    glow:
      "shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]",
    text: "text-rose-400",
    iconBg: "bg-rose-500/10 border-rose-500/30",
    orb: "bg-rose-500/10",
    line: "via-rose-400",
  },
  amber: {
    border: "border-amber-500/20 hover:border-amber-400/40",
    glow:
      "shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]",
    text: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/30",
    orb: "bg-amber-500/10",
    line: "via-amber-400",
  },
  purple: {
    border: "border-purple-500/20 hover:border-purple-400/40",
    glow:
      "shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]",
    text: "text-purple-400",
    iconBg: "bg-purple-500/10 border-purple-500/30",
    orb: "bg-purple-500/10",
    line: "via-purple-400",
  },
};

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color = "cyan",
  description,
  trend = "up",
}) {
  const theme = COLOR_THEMES[color] || COLOR_THEMES.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`group relative h-full w-full overflow-hidden rounded-3xl border bg-slate-950/60 p-4 backdrop-blur-xl transition-all duration-300 lg:p-5 ${theme.border} ${theme.glow}`}
    >
      <div
        className={`absolute left-5 right-5 top-0 h-[1px] bg-gradient-to-r from-transparent ${theme.line} to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${theme.orb} blur-3xl transition-transform duration-500 group-hover:scale-125`}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${theme.iconBg}`}
        >
          {Icon && <Icon className={`h-5 w-5 ${theme.text}`} />}
        </div>

        {change && (
          <div
            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold ${
              trend === "down"
                ? "border-rose-500/25 bg-rose-500/10 text-rose-300"
                : "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {trend === "down" ? "▼" : "▲"} {change}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-5">
        <p className="font-mono text-2xl font-black tracking-tight text-white lg:text-3xl">
          {value}
        </p>

        <h3 className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {title}
        </h3>
      </div>

      {description && (
        <div className="relative z-10 mt-4 border-t border-slate-800/80 pt-3">
          <p className="truncate text-xs text-slate-500">{description}</p>
        </div>
      )}
    </motion.div>
  );
}