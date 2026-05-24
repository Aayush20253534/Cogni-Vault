import React from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Cpu,
  Activity,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

const riskMetrics = [
  {
    label: "AI Confidence",
    value: "96.4%",
    color: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
    dot: "bg-cyan-400",
    desc: "Neural pattern alignment precision",
  },
  {
    label: "Active Threats",
    value: "38",
    color: "text-rose-300 bg-rose-500/10 border-rose-500/20",
    dot: "bg-rose-400",
    desc: "Behavioral escalations being tracked",
  },
  {
    label: "Blocked Transactions",
    value: "128",
    color: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-400",
    desc: "Automated payment mitigations",
  },
  {
    label: "Step-up Challenges",
    value: "74",
    color: "text-purple-300 bg-purple-500/10 border-purple-500/20",
    dot: "bg-purple-400",
    desc: "MFA verification triggers",
  },
];

export default function RiskOverview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative w-full overflow-hidden rounded-3xl border border-cyan-500/10 bg-slate-950/50 p-4 shadow-[0_0_30px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-5"
    >
      <div className="absolute left-6 right-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="mb-5 flex items-center justify-between border-b border-slate-800/70 pb-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300">
            <ShieldAlert className="h-4 w-4" />
          </div>

          <div>
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-slate-200">
              Risk Overview
            </h2>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Composite behavioral anomaly score
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-emerald-300">
          <Cpu className="h-3 w-3" />
          AI Active
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8">
        <div className="flex shrink-0 flex-col items-center py-2">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-slate-800 bg-slate-950/60 shadow-inner">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-rose-500/20 animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-3 rounded-full border-2 border-rose-500/45 shadow-[0_0_18px_rgba(244,63,94,0.18)]" />
            <div className="absolute inset-6 rounded-full border border-cyan-500/10" />

            <div className="relative z-10 text-center">
              <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500">
                Composite
              </span>

              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="font-mono text-4xl font-black tracking-tight text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.35)]"
              >
                82%
              </motion.div>

              <span className="mt-1 inline-block rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-1 font-mono text-[8px] font-black uppercase tracking-widest text-rose-300">
                High Risk
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500">
            <Activity className="h-3 w-3 text-rose-400" />
            Telemetry Core Node
          </div>
        </div>

        <div className="w-full flex-1 space-y-2">
          {riskMetrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-3 transition hover:border-cyan-500/20 hover:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${metric.dot}`}
                  />
                  <span className="truncate font-mono text-[11px] font-black uppercase tracking-wide text-slate-300">
                    {metric.label}
                  </span>
                </div>

                <p className="mt-1 truncate text-[10px] text-slate-600">
                  {metric.desc}
                </p>
              </div>

              <div
                className={`self-start rounded-xl border px-3 py-1.5 font-mono text-xs font-black tracking-wider sm:self-auto ${metric.color}`}
              >
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 border-t border-slate-800/70 pt-3.5 font-mono text-[10px] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400/70" />
          <span>Automated security policies running at maximum integrity.</span>
        </div>

        <button className="flex items-center gap-1 self-end font-bold uppercase tracking-wider text-cyan-400 transition hover:text-cyan-300 sm:self-auto">
          <HelpCircle className="h-3 w-3" />
          Audit Logic
        </button>
      </div>
    </motion.section>
  );
}