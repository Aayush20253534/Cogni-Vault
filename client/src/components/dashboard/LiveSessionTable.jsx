import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Terminal,
  Eye,
  MapPin,
  Smartphone,
  Laptop,
  Clock,
  ShieldCheck,
} from "lucide-react";

const sessionsData = [
  {
    sessionId: "SES-8841",
    user: "Rohan Sharma",
    accountId: "ACC-9902",
    device: "Chrome / Windows",
    isMobile: false,
    location: "Delhi, IN",
    riskScore: 82,
    status: "HIGH RISK",
    behaviorSignal: "Rapid tab switches + sudden IP shift",
    lastActivity: "2s ago",
  },
  {
    sessionId: "SES-8842",
    user: "Priya Mehta",
    accountId: "ACC-4412",
    device: "Safari / iPhone",
    isMobile: true,
    location: "Mumbai, IN",
    riskScore: 34,
    status: "NORMAL",
    behaviorSignal: "Standard balance inquiry match",
    lastActivity: "12s ago",
  },
  {
    sessionId: "SES-8843",
    user: "Arjun Singh",
    accountId: "ACC-7810",
    device: "Chrome / Android",
    isMobile: true,
    location: "Lucknow, IN",
    riskScore: 67,
    status: "STEP-UP",
    behaviorSignal: "High-value beneficiary addition attempt",
    lastActivity: "1m ago",
  },
  {
    sessionId: "SES-8844",
    user: "Neha Rao",
    accountId: "ACC-1102",
    device: "Edge / Windows",
    isMobile: false,
    location: "Pune, IN",
    riskScore: 91,
    status: "BLOCKED",
    behaviorSignal: "Automated macro/script timing signature",
    lastActivity: "Just now",
  },
  {
    sessionId: "SES-8845",
    user: "Aman Verma",
    accountId: "ACC-5591",
    device: "Firefox / Linux",
    isMobile: false,
    location: "Bengaluru, IN",
    riskScore: 48,
    status: "WATCHING",
    behaviorSignal: "First-time device identity verification",
    lastActivity: "4m ago",
  },
];

const STATUS_THEMES = {
  NORMAL: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
  WATCHING: "text-cyan-300 border-cyan-500/20 bg-cyan-500/10",
  "STEP-UP": "text-amber-300 border-amber-500/20 bg-amber-500/10",
  "HIGH RISK": "text-rose-300 border-rose-500/20 bg-rose-500/10",
  BLOCKED: "text-red-300 border-red-500/20 bg-red-500/10",
};

function getRiskStyles(score) {
  if (score >= 70) {
    return "text-rose-300 border-rose-500/20 bg-rose-500/10";
  }

  if (score >= 40) {
    return "text-amber-300 border-amber-500/20 bg-amber-500/10";
  }

  return "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";
}

const containerVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.06,
      type: "spring",
      stiffness: 260,
      damping: 22,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export default function LiveSessionTable() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="group relative w-full overflow-hidden rounded-3xl border border-cyan-500/10 bg-slate-950/50 p-4 shadow-[0_0_35px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:p-5"
    >
      <div className="absolute left-6 right-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="pointer-events-none absolute left-10 bottom-0 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="mb-4 flex items-center justify-between border-b border-slate-800/70 pb-4">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-300">
            <Activity className="h-4 w-4" />
          </div>

          <div>
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-slate-200">
              Live Sessions
            </h2>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Real-time behavioral session monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-widest text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl border border-slate-800/60 bg-slate-950/40">
        <table className="w-full min-w-[900px] border-collapse text-left font-mono text-[11px]">
          <thead>
            <tr className="border-b border-slate-800/70 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-bold">Session ID</th>
              <th className="px-3 py-3 font-bold">Identity</th>
              <th className="px-3 py-3 font-bold">Device</th>
              <th className="px-3 py-3 font-bold">Location</th>
              <th className="px-3 py-3 text-center font-bold">Risk</th>
              <th className="px-3 py-3 font-bold">Behavior Signal</th>
              <th className="px-3 py-3 text-center font-bold">Status</th>
              <th className="px-3 py-3 text-right font-bold">Activity</th>
              <th className="px-4 py-3 text-right font-bold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/50">
            {sessionsData.map((session) => (
              <motion.tr
                key={session.sessionId}
                variants={rowVariants}
                className="group/row text-slate-300 transition hover:bg-slate-900/40"
              >
                <td className="whitespace-nowrap px-4 py-3.5 font-bold text-cyan-300">
                  {session.sessionId}
                </td>

                <td className="whitespace-nowrap px-3 py-3.5">
                  <div className="flex flex-col">
                    <span className="font-bold tracking-wide text-slate-200">
                      {session.user}
                    </span>
                    <span className="mt-0.5 text-[9px] text-slate-600">
                      {session.accountId}
                    </span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {session.isMobile ? (
                      <Smartphone className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                    ) : (
                      <Laptop className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                    )}
                    <span>{session.device}</span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-600" />
                    <span>{session.location}</span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-3 py-3.5 text-center">
                  <span
                    className={`inline-block min-w-[42px] rounded-lg border px-2 py-1 text-[10px] font-black ${getRiskStyles(
                      session.riskScore
                    )}`}
                  >
                    {session.riskScore}%
                  </span>
                </td>

                <td
                  className="max-w-[220px] truncate px-3 py-3.5 text-[10px] font-medium text-slate-400 transition group-hover/row:text-slate-300"
                  title={session.behaviorSignal}
                >
                  {session.behaviorSignal}
                </td>

                <td className="whitespace-nowrap px-3 py-3.5 text-center">
                  <span
                    className={`inline-block rounded-lg border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                      STATUS_THEMES[session.status]
                    }`}
                  >
                    {session.status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-3 py-3.5 text-right text-slate-500">
                  <div className="flex items-center justify-end gap-1 text-[10px]">
                    <Clock className="h-3 w-3 text-slate-700" />
                    <span>{session.lastActivity}</span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-3.5 text-right">
                  <button className="group/btn inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300">
                    <Eye className="h-3 w-3 transition group-hover/btn:text-cyan-300" />
                    Watch
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-800/70 pt-3.5 font-mono text-[10px] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Terminal className="h-3.5 w-3.5 text-cyan-400/60" />
          <span className="line-clamp-1">
            Matching live behavior metrics against stored behavioral biometric
            signatures.
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 self-end font-bold uppercase tracking-widest text-slate-400 sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/70" />
          Nodes Secured
        </div>
      </div>
    </motion.section>
  );
}