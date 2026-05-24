import React from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PieChart as PieIcon, Terminal } from "lucide-react";

const fraudData = [
  { name: "UPI Spoofing", value: 32, color: "#f43f5e" },
  { name: "Session Hijack", value: 21, color: "#06b6d4" },
  { name: "Velocity Attack", value: 18, color: "#f59e0b" },
  { name: "Device Clone", value: 14, color: "#a855f7" },
  { name: "SIM Swap", value: 15, color: "#10b981" },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/95 p-3 font-mono text-[11px] shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <p className="mb-1 font-black uppercase tracking-wide text-slate-200">
        {data.name}
      </p>

      <div className="flex items-center gap-4 text-slate-400">
        <span>
          Allocation:{" "}
          <strong style={{ color: data.color }}>{data.value}%</strong>
        </span>
        <span className="text-[10px] text-slate-500">CONF: 0.98</span>
      </div>
    </div>
  );
}

const panelVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export default function FraudPieChart() {
  return (
    <motion.section
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      className="group relative flex min-h-[380px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-cyan-500/10 bg-slate-950/50 p-4 shadow-[0_0_35px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:p-5"
    >
      <div className="absolute left-6 right-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="mb-4 flex items-center justify-between border-b border-slate-800/70 pb-3.5">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-300">
            <PieIcon className="h-4 w-4" />
          </div>

          <div>
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-slate-200">
              Fraud Distribution
            </h2>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Detected attack vector allocation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-cyan-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>
          AI Classified
        </div>
      </div>

      <div className="my-auto flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="relative h-[190px] w-[190px] shrink-0">
          <div className="pointer-events-none absolute inset-0 z-10 flex select-none flex-col items-center justify-center font-mono">
            <span className="text-2xl font-black tracking-tight text-white">
              100%
            </span>

            <span className="mt-1 px-2 text-center text-[8px] font-bold uppercase tracking-widest text-slate-500">
              Classified Events
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fraudData}
                cx="50%"
                cy="50%"
                innerRadius={66}
                outerRadius={84}
                paddingAngle={4}
                dataKey="value"
                animationDuration={900}
                animationEasing="ease-out"
              >
                {fraudData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    stroke="#020617"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full max-w-[230px] flex-1 space-y-2 font-mono text-[11px]">
          {fraudData.map((item) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
              className="group/item flex items-center justify-between rounded-xl border border-slate-800/50 bg-slate-900/25 p-2 transition hover:border-cyan-500/20 hover:bg-slate-900/50"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}90`,
                  }}
                />

                <span className="truncate font-medium tracking-wide text-slate-400 transition group-hover/item:text-slate-300">
                  {item.name}
                </span>
              </div>

              <span className="shrink-0 pl-3 font-bold text-slate-300">
                {item.value}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-slate-800/70 pt-3 font-mono text-[10px] text-slate-500">
        <Terminal className="h-3.5 w-3.5 shrink-0 text-cyan-400/60" />
        <span className="truncate">
          Cluster analysis synchronized across 5 threat surfaces.
        </span>
      </div>
    </motion.section>
  );
}