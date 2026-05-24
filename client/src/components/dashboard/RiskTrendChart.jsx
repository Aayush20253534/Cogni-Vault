import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, Activity } from "lucide-react";

const data = [
  { day: "Mon", risk: 42 },
  { day: "Tue", risk: 55 },
  { day: "Wed", risk: 61 },
  { day: "Thu", risk: 48 },
  { day: "Fri", risk: 72 },
  { day: "Sat", risk: 66 },
  { day: "Sun", risk: 82 },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0];

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-950/95 p-3 font-mono text-[11px] shadow-[0_0_24px_rgba(34,211,238,0.18)] backdrop-blur-xl">
      <p className="mb-2 border-b border-slate-800 pb-1 text-[9px] uppercase tracking-widest text-slate-500">
        Telemetry Frame
      </p>

      <div className="flex items-center justify-between gap-5">
        <span className="text-slate-400">Timeline:</span>
        <span className="font-bold text-slate-100">{point.payload.day}</span>
      </div>

      <div className="mt-1 flex items-center justify-between gap-5">
        <span className="text-slate-400">Risk Load:</span>
        <span className="font-black text-cyan-300">{point.value}%</span>
      </div>
    </div>
  );
}

export default function RiskTrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative w-full overflow-hidden rounded-3xl border border-cyan-500/10 bg-slate-950/50 p-4 shadow-[0_0_30px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-5"
    >
      <div className="absolute left-6 right-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl transition-transform duration-500 group-hover:scale-125" />

      <div className="mb-5 flex items-center justify-between border-b border-slate-800/70 pb-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-300">
            <TrendingUp className="h-4 w-4" />
          </div>

          <div>
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-slate-200">
              Risk Trend Analysis
            </h2>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Behavior anomaly escalation pattern
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-cyan-300">
          <Activity className="h-3 w-3 animate-pulse" />
          Live
        </div>
      </div>

      <div className="h-[260px] w-full select-none text-[10px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 4 }}>
            <defs>
              <linearGradient id="riskCyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              stroke="#64748b"
              dy={10}
              tick={{ fontSize: 11 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              stroke="#64748b"
              domain={[0, 100]}
              tickCount={5}
              tick={{ fontSize: 11 }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#22d3ee",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="risk"
              stroke="#22d3ee"
              strokeWidth={2.5}
              fill="url(#riskCyanGradient)"
              activeDot={{
                r: 5,
                stroke: "#22d3ee",
                strokeWidth: 2,
                fill: "#020617",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}