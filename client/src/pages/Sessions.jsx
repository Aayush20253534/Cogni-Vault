import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Search,
  Filter,
  SlidersHorizontal,
  FileSpreadsheet,
  Laptop,
  MapPin,
  Globe,
  Fingerprint,
  Clock,
  User,
  Cpu,
  Terminal,
} from "lucide-react";
import DarkSelect from "../components/common/DarkSelect";
import ActionButton from "../components/common/ActionButton";
import InfoRow from "../components/common/InfoRow";
import InfoPanel from "../components/common/InfoPanel";
import MiniInfo from "../components/common/MiniInfo";
import DrawerShell from "../components/common/DrawerShell";

import useSessions from "../hooks/useSessions";

const RISK_THEMES = {
  High: "text-rose-300 border-rose-500/30 bg-rose-500/10",
  Medium: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  Low: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
};

const STATE_THEMES = {
  Active: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
  Suspicious: "text-rose-300 border-rose-500/20 bg-rose-500/10",
  Locked: "text-amber-300 border-amber-500/20 bg-amber-500/10",
  Terminated: "text-slate-300 border-slate-700 bg-slate-800/60",
};

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export default function Sessions() {
 
  const {
  sessions,
  filteredSessions,
  summary,
  searchQuery,
  setSearchQuery,
  riskFilter,
  setRiskFilter,
  stateFilter,
  setStateFilter,
  inspectedSession,
  setInspectedSession,
  updateSession,
} = useSessions();

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[1600px] space-y-6 font-mono text-slate-300"
    >
      <motion.section
        variants={itemVariants}
        className="flex flex-col justify-between gap-4 border-b border-cyan-500/10 pb-5 md:flex-row md:items-center"
      >
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black uppercase tracking-[0.16em] text-white">
            <Activity className="h-5 w-5 animate-pulse text-cyan-300" />
            Live Session Intelligence
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time banking session telemetry and behavioral monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-cyan-300 md:self-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          Telemetry Stream Active
        </div>
      </motion.section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ["Active Sessions", summary.active, "text-emerald-300"],
          ["Suspicious", summary.suspicious, "text-rose-300"],
          ["Device Mismatch", summary.device, "text-amber-300"],
          ["Geo Violations", summary.geo, "text-cyan-300"],
          ["Terminated", summary.terminated, "text-slate-300"],
        ].map(([label, value, color]) => (
          <motion.div
            key={label}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 backdrop-blur-xl transition hover:border-cyan-500/20"
          >
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <p className={`mt-1 text-2xl font-black ${color}`}>{value}</p>
            </div>
            <Fingerprint className={`h-4 w-4 opacity-60 ${color}`} />
          </motion.div>
        ))}
      </section>

      <motion.section
        variants={itemVariants}
        className="flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/40 p-3 backdrop-blur-xl lg:flex-row lg:items-center"
      >
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search session, user, IP, device..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-4 text-[11px] uppercase tracking-wide text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-500/40"
          />
        </div>

        <div className="flex w-full flex-wrap gap-2 lg:w-auto">
          <DarkSelect
            icon={<Filter className="h-3 w-3 text-slate-500" />}
            value={riskFilter}
            onChange={setRiskFilter}
            options={["All", "High", "Medium", "Low"]}
          />

          <DarkSelect
            icon={<SlidersHorizontal className="h-3 w-3 text-slate-500" />}
            value={stateFilter}
            onChange={setStateFilter}
            options={["All", "Active", "Suspicious", "Locked", "Terminated"]}
          />

          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300 sm:w-auto">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/50 shadow-[0_0_35px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-800/70 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Session</th>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Device</th>
                <th className="px-3 py-3">IP</th>
                <th className="px-3 py-3">Location</th>
                <th className="px-3 py-3 text-center">Score</th>
                <th className="px-3 py-3 text-center">State</th>
                <th className="px-3 py-3 text-center">Duration</th>
                <th className="px-3 py-3 text-right">Activity</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {filteredSessions.length ? (
                filteredSessions.map((s) => (
                  <tr key={s.sessionId} className="transition hover:bg-slate-900/40">
                    <td className="whitespace-nowrap px-4 py-3.5 font-bold text-cyan-300">
                      {s.sessionId}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-slate-600" />
                        <div>
                          <p className="font-bold text-slate-200">{s.user}</p>
                          <p className="text-[9px] text-slate-500">{s.accountId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Laptop className="h-3 w-3 text-slate-700" />
                        <div>
                          <p className="font-medium text-slate-300">{s.device}</p>
                          <p className="text-[9px] text-slate-600">{s.browser}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">
                      {s.ip}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">
                      <MapPin className="mr-1 inline h-3 w-3 text-slate-600" />
                      {s.location}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      <span
                        className={`rounded-lg px-2 py-1 text-[10px] font-black ${
                          s.behaviorScore >= 75
                            ? "bg-rose-500/10 text-rose-300"
                            : s.behaviorScore >= 40
                            ? "bg-amber-500/10 text-amber-300"
                            : "bg-emerald-500/10 text-emerald-300"
                        }`}
                      >
                        {s.behaviorScore}%
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      <span className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${STATE_THEMES[s.sessionState]}`}>
                        {s.sessionState}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center text-slate-500">
                      {s.duration}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-right text-slate-500">
                      <Clock className="mr-1 inline h-3 w-3 text-slate-700" />
                      {s.lastActivity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                      <div className="inline-flex gap-1.5">
                        <ActionButton onClick={() => setInspectedSession(s)} label="Inspect" cyan />
                        {s.sessionState !== "Locked" && s.sessionState !== "Terminated" && (
                          <ActionButton
                            onClick={() =>
                              updateSession(s.sessionId, {
                                sessionState: "Locked",
                                behaviorScore: Math.min(s.behaviorScore + 10, 100),
                              })
                            }
                            label="Lock"
                            amber
                          />
                        )}
                        {s.sessionState !== "Terminated" && (
                          <ActionButton
                            onClick={() =>
                              updateSession(s.sessionId, {
                                sessionState: "Terminated",
                                lastActivity: "Just now",
                              })
                            }
                            label="Kill"
                            red
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-12 text-center font-bold uppercase tracking-widest text-slate-600">
                    No session objects matched filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/70 bg-slate-950/60 p-3 text-[10px] text-slate-500">
          <div className="flex min-w-0 items-center gap-2">
            <Terminal className="h-3.5 w-3.5 shrink-0 text-cyan-400/60" />
            <span className="truncate">
              Showing {filteredSessions.length} of {sessions.length} live session records.
            </span>
          </div>
          <span className="hidden font-bold text-slate-600 sm:inline">
            STREAM_LOG_SEC_44
          </span>
        </div>
      </motion.section>

      <AnimatePresence>
        {inspectedSession && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectedSession(null)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />

           <DrawerShell
  title="Session Forensics"
  icon={Globe}
  accent="cyan"
  onClose={() => setInspectedSession(null)}
  maxWidth="max-w-[500px]"
  footer={
    <div className="flex gap-2">
      {inspectedSession.sessionState !== "Locked" &&
        inspectedSession.sessionState !== "Terminated" && (
          <button
            onClick={() =>
              updateSession(inspectedSession.sessionId, {
                sessionState: "Locked",
              })
            }
            className="flex-1 rounded-xl border border-amber-500/20 bg-amber-950/40 py-2.5 text-[10px] font-bold uppercase tracking-widest text-amber-300"
          >
            Lock Session
          </button>
        )}

      {inspectedSession.sessionState !== "Terminated" && (
        <button
          onClick={() =>
            updateSession(inspectedSession.sessionId, {
              sessionState: "Terminated",
              lastActivity: "Just now",
            })
          }
          className="flex-1 rounded-xl border border-rose-500/20 bg-rose-950/40 py-2.5 text-[10px] font-bold uppercase tracking-widest text-rose-300"
        >
          Kill Session
        </button>
      )}
    </div>
  }
>
  <DrawerHeader session={inspectedSession} />

  <div className="grid grid-cols-3 gap-2">
    <MiniMetric
      label="Score"
      value={`${inspectedSession.behaviorScore}%`}
      className={
        inspectedSession.behaviorScore >= 75
          ? "text-rose-300"
          : inspectedSession.behaviorScore >= 40
          ? "text-amber-300"
          : "text-emerald-300"
      }
    />
    <MiniBadge
      label="Risk"
      value={inspectedSession.riskLevel}
      className={RISK_THEMES[inspectedSession.riskLevel]}
    />
    <MiniBadge
      label="State"
      value={inspectedSession.sessionState}
      className={STATE_THEMES[inspectedSession.sessionState]}
    />
  </div>

  <InfoPanel title="BehaviorShield Diagnosis" icon={Cpu} color="cyan">
    {inspectedSession.aiExplanation}
  </InfoPanel>

  <InfoPanel title="Flag Reason" icon={Cpu} color="rose">
    {inspectedSession.anomalyReason}
  </InfoPanel>

  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
    <p className="border-b border-slate-800 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
      Network Telemetry
    </p>
    <InfoRow label="IP" value={inspectedSession.ip} />
    <InfoRow label="Carrier" value={inspectedSession.networkIntel} />
    <InfoRow label="Location" value={inspectedSession.location} cyan />
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
    <p className="border-b border-slate-800 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
      Timeline
    </p>

    <div className="relative mt-3 space-y-3 pl-1 before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
      {inspectedSession.timeline.map(([event, details, time]) => (
        <div key={`${event}-${time}`} className="relative flex gap-3 text-[10px]">
          <span className="z-10 mt-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div>
            <p className="text-slate-400">
              <span className="mr-1 rounded border border-slate-800 bg-slate-900 px-1 text-[9px] font-bold uppercase text-slate-200">
                {event}
              </span>
              {details}
            </p>
            <span className="text-[9px] text-slate-600">{time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</DrawerShell>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DrawerHeader({ session }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
      <div className="absolute right-4 top-4 rounded border border-cyan-500/10 bg-cyan-500/10 px-2 py-1 text-[9px] font-black tracking-wider text-cyan-300">
        {session.sessionId}
      </div>

      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
        Identity Mapping
      </p>
      <h3 className="mt-1 pr-20 text-sm font-black uppercase text-white">
        {session.user}
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-[10px]">
        <MiniInfo label="Account" value={session.accountId} />
        <MiniInfo label="Fingerprint" value={session.fingerprint} amber />
        <MiniInfo label="Device" value={session.device} />
        <MiniInfo label="Browser" value={session.browser} />
      </div>
    </div>
  );
}

function MiniMetric({ label, value, className }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-center">
      <p className="text-[8.5px] font-bold uppercase text-slate-500">{label}</p>
      <p className={`mt-1 text-base font-black ${className}`}>{value}</p>
    </div>
  );
}

function MiniBadge({ label, value, className }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-center">
      <p className="text-[8.5px] font-bold uppercase text-slate-500">{label}</p>
      <span className={`mt-1 inline-block rounded border px-1.5 py-0.5 text-[8px] font-black uppercase ${className}`}>
        {value}
      </span>
    </div>
  );
}

