import React from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Terminal,
  User,
  ArrowUpRight,
  Clock,
} from "lucide-react";

const alertsData = [
  {
    id: "TXN-8042",
    title: "High-Risk UPI Transfer Blocked",
    user: "Arjun Mehta",
    amount: "₹1,45,000",
    riskScore: 94,
    severity: "CRITICAL",
    status: "BLOCKED",
    time: "42s ago",
    reason: "Velocity threshold exceeded with unknown device fingerprint.",
  },
  {
    id: "AUTH-1902",
    title: "New Device Login Anomaly",
    user: "Priya Sharma",
    amount: "N/A",
    riskScore: 78,
    severity: "HIGH",
    status: "STEP-UP",
    time: "2m ago",
    reason: "Simultaneous session tokens detected from distant routing cells.",
  },
  {
    id: "SESS-7710",
    title: "Session Hijack Pattern",
    user: "Rohan Das",
    amount: "N/A",
    riskScore: 88,
    severity: "CRITICAL",
    status: "BLOCKED",
    time: "5m ago",
    reason: "User agent mutated during transaction lifecycle.",
  },
  {
    id: "CARD-4029",
    title: "Multiple Failed PIN Attempts",
    user: "Vikram Singh",
    amount: "₹10,000",
    riskScore: 52,
    severity: "MEDIUM",
    status: "REVIEW",
    time: "12m ago",
    reason: "Repeated authentication failures followed by balance inquiry.",
  },
  {
    id: "BEN-0912",
    title: "Suspicious Beneficiary Addition",
    user: "Ananya Iyer",
    amount: "N/A",
    riskScore: 35,
    severity: "LOW",
    status: "RESOLVED",
    time: "18m ago",
    reason: "Beneficiary matched mule-account heuristic parameters.",
  },
];

const SEVERITY_THEMES = {
  CRITICAL: "bg-rose-500/10 border-rose-500/30 text-rose-300",
  HIGH: "bg-orange-500/10 border-orange-500/30 text-orange-300",
  MEDIUM: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  LOW: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
};

const STATUS_THEMES = {
  BLOCKED: "text-rose-300 border-rose-500/20 bg-rose-500/10",
  "STEP-UP": "text-amber-300 border-amber-500/20 bg-amber-500/10",
  REVIEW: "text-cyan-300 border-cyan-500/20 bg-cyan-500/10",
  RESOLVED: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
};

const containerVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.07,
      type: "spring",
      stiffness: 260,
      damping: 22,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export default function RecentAlerts() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="group relative w-full overflow-hidden rounded-3xl border border-cyan-500/10 bg-slate-950/50 p-4 shadow-[0_0_35px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:p-5"
    >
      <div className="absolute left-6 right-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent" />
      <div className="pointer-events-none absolute right-8 top-10 h-36 w-36 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="mb-4 flex items-center justify-between border-b border-slate-800/70 pb-4">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-rose-300">
            <ShieldAlert className="h-4 w-4" />
          </div>

          <div>
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-slate-200">
              Recent Alerts
            </h2>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Live fraud events requiring analyst review
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-rose-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
          </span>
          Live Feed
        </div>
      </div>

      <div className="max-h-[460px] space-y-2.5 overflow-y-auto pr-1">
        {alertsData.map((alert) => (
          <motion.div
            key={alert.id}
            variants={rowVariants}
            whileHover={{ y: -2 }}
            className="group/row relative flex flex-col gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-3 font-mono text-[11px] transition hover:border-cyan-500/20 hover:bg-slate-900/50 md:flex-row md:items-center md:justify-between"
          >
            <div
              className={`absolute left-0 top-3 bottom-3 w-[2px] opacity-0 transition-opacity duration-300 group-hover/row:opacity-100 ${
                alert.severity === "CRITICAL"
                  ? "bg-rose-400"
                  : alert.severity === "HIGH"
                  ? "bg-orange-400"
                  : alert.severity === "MEDIUM"
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
            />

            <div className="min-w-0 flex-1 space-y-1.5 pl-1.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="rounded-md border border-cyan-500/10 bg-cyan-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-cyan-300">
                  {alert.id}
                </span>

                <h3 className="truncate text-xs font-black uppercase tracking-wide text-slate-200">
                  {alert.title}
                </h3>

                <div className="flex max-w-[150px] items-center gap-1 text-[10px] text-slate-500">
                  <User className="h-3 w-3 shrink-0 text-slate-600" />
                  <span className="truncate">{alert.user}</span>
                </div>
              </div>

              <p className="text-[10px] leading-relaxed text-slate-500 transition group-hover/row:text-slate-400">
                <span className="mr-1 font-bold text-slate-600">LOG:</span>
                {alert.reason}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-800/70 pt-2 md:justify-end md:border-t-0 md:pt-0">
              <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950/60 px-2 py-1">
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">
                  Risk
                </span>
                <span
                  className={`text-xs font-black ${
                    alert.riskScore >= 80
                      ? "text-rose-300"
                      : alert.riskScore >= 50
                      ? "text-amber-300"
                      : "text-emerald-300"
                  }`}
                >
                  {alert.riskScore}
                </span>
              </div>

              <span
                className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                  SEVERITY_THEMES[alert.severity]
                }`}
              >
                {alert.severity}
              </span>

              <span
                className={`rounded-lg border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                  STATUS_THEMES[alert.status]
                }`}
              >
                {alert.status}
              </span>

              <div className="flex min-w-[56px] items-center justify-end gap-1 text-[10px] text-slate-500">
                <Clock className="h-3 w-3 text-slate-600" />
                {alert.time}
              </div>

              <button className="group/btn flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300">
                Inspect
                <ArrowUpRight className="h-3 w-3 transition group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800/70 pt-3 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Terminal className="h-3.5 w-3.5 text-cyan-400/60" />
          <span className="line-clamp-1">
            Active Pipeline: Processing incoming financial risk events.
          </span>
        </div>

        <button className="hidden font-bold uppercase tracking-widest text-rose-400 transition hover:text-rose-300 sm:block">
          Purge Handled
        </button>
      </div>
    </motion.section>
  );
}