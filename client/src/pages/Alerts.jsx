import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldAlert,
  Terminal,
  Search,
  Filter,
  X,
  CheckCircle,
  Clock,
  Cpu,
  User,
  SlidersHorizontal,
  Server,
  Zap,
  Radio,
  FileSpreadsheet,
  Eye,
} from "lucide-react";

const initialAlerts = [
  {
    alertId: "ALT-9081",
    title: "SIM-Swap Account Hijack Attempt",
    user: "Vikram Malhotra",
    accountId: "ACC-8831-U",
    severity: "Critical",
    status: "Open",
    riskScore: 98,
    category: "Account Takeover",
    source: "Mobile Telco Sync",
    time: "2m ago",
    reason: "IMSI mismatch with device identifier change.",
    aiExplanation:
      "Device fingerprint changed concurrently with telecom IMSI cycling. Step-up validation bypass pattern detected.",
    recommendedAction:
      "Lock account ledger, invalidate tokens, and flag linked UPI routing tables.",
    sessionContext: {
      ip: "103.44.112.9",
      device: "Samsung Galaxy S24 Ultra Emulator",
      location: "Ranchi, IN",
    },
    timeline: [
      ["Triggered", "High-velocity access telemetry flagged", "2m ago"],
      ["Evaluated", "Mule routing correlation discovered", "1m ago"],
      ["Frozen", "Automated session freeze deployed", "45s ago"],
    ],
  },
  {
    alertId: "ALT-9082",
    title: "Credential Stuffing Cascade",
    user: "Deepika Rao",
    accountId: "ACC-1104-Y",
    severity: "Critical",
    status: "Investigating",
    riskScore: 94,
    category: "Authentication Fraud",
    source: "Auth Gateway Node",
    time: "8m ago",
    reason: "14 password attempts within 3.2 seconds.",
    aiExplanation:
      "Macro-driven credential injection detected using headless browser timing markers.",
    recommendedAction:
      "Blacklist IP reputation cluster and dispatch cryptographic CAPTCHA sequence.",
    sessionContext: {
      ip: "185.220.101.44",
      device: "HeadlessChrome / Linux",
      location: "Tor Exit Relay",
    },
    timeline: [
      ["Detected", "Sequential rate violations registered", "8m ago"],
      ["Isolated", "Traffic redirected to honeypot layer", "6m ago"],
    ],
  },
  {
    alertId: "ALT-9083",
    title: "Unusual UPI Velocity Spurt",
    user: "Amit Sharma",
    accountId: "ACC-5521-A",
    severity: "High",
    status: "Open",
    riskScore: 82,
    category: "Mule Activity",
    source: "NPCI Layer-2",
    time: "14m ago",
    reason: "7 outbound transfers under 120 seconds.",
    aiExplanation:
      "Outbound transfer structure resembles mule transaction splitting below tracking thresholds.",
    recommendedAction:
      "Clamp transaction velocity to ₹5,000 pending customer confirmation.",
    sessionContext: {
      ip: "49.36.88.21",
      device: "OnePlus 12 / Android 14",
      location: "Ahmedabad, IN",
    },
    timeline: [["Flagged", "Velocity burst matched mule matrices", "14m ago"]],
  },
  {
    alertId: "ALT-9084",
    title: "Impossible Geolocation Pivot",
    user: "Sarah Jones",
    accountId: "ACC-0911-X",
    severity: "High",
    status: "Investigating",
    riskScore: 79,
    category: "Session Hijacking",
    source: "Edge Engine",
    time: "22m ago",
    reason: "New Delhi to Frankfurt in 14 minutes.",
    aiExplanation:
      "Physical transit validation failed. Token usage shows cross-border activity without travel exception.",
    recommendedAction: "Terminate active tokens across all connected devices.",
    sessionContext: {
      ip: "80.14.99.102",
      device: "Safari / Apple Silicon Mac",
      location: "Frankfurt, DE",
    },
    timeline: [["Triggered", "Geo-distance mismatch identified", "22m ago"]],
  },
  {
    alertId: "ALT-9085",
    title: "Automation Script Manipulation",
    user: "Nikhil Vance",
    accountId: "ACC-3310-M",
    severity: "Medium",
    status: "Resolved",
    riskScore: 58,
    category: "API Abuse",
    source: "Sandbox Engine",
    time: "1h ago",
    reason: "Profile updates at millisecond boundaries.",
    aiExplanation:
      "Form interaction analytics indicate direct scripted data injection.",
    recommendedAction: "Archive incident and force hardware-token verification.",
    sessionContext: {
      ip: "103.88.221.4",
      device: "Puppeteer Instance",
      location: "Bengaluru, IN",
    },
    timeline: [
      ["Flagged", "Micro-timing pattern evaluated", "1h ago"],
      ["Resolved", "Analyst validated automation context", "40m ago"],
    ],
  },
  {
    alertId: "ALT-9086",
    title: "Rooted Client Device Access",
    user: "Karan Johar",
    accountId: "ACC-6612-L",
    severity: "Low",
    status: "Escalated",
    riskScore: 35,
    category: "Device Integrity",
    source: "App Armor",
    time: "3h ago",
    reason: "Su-binary detected in device sandbox.",
    aiExplanation:
      "Rooted device increases risk of remote accessibility trojans and background tampering.",
    recommendedAction: "Restrict app to view-only mode until device attestation clears.",
    sessionContext: {
      ip: "223.10.45.12",
      device: "Rooted Pixel 7a",
      location: "Chandigarh, IN",
    },
    timeline: [
      ["Reported", "Integrity attestation failed", "3h ago"],
      ["Escalated", "Sent to engineering review", "2h ago"],
    ],
  },
];

const SEVERITY_THEMES = {
  Critical: "text-rose-300 border-rose-500/30 bg-rose-500/10",
  High: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  Medium: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
  Low: "text-slate-300 border-slate-700 bg-slate-800/60",
};

const STATUS_THEMES = {
  Open: "text-rose-300 border-rose-500/20 bg-rose-500/10",
  Investigating: "text-amber-300 border-amber-500/20 bg-amber-500/10",
  Resolved: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
  Escalated: "text-purple-300 border-purple-500/20 bg-purple-500/10",
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

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [inspectedAlert, setInspectedAlert] = useState(null);

  const metrics = useMemo(
    () => ({
      critical: alerts.filter((a) => a.severity === "Critical" && a.status !== "Resolved").length,
      high: alerts.filter((a) => a.severity === "High" && a.status !== "Resolved").length,
      review: alerts.filter((a) => a.status === "Investigating").length,
      resolved: alerts.filter((a) => a.status === "Resolved").length,
    }),
    [alerts]
  );

  const filteredAlerts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return alerts.filter((a) => {
      const search =
        !q ||
        a.alertId.toLowerCase().includes(q) ||
        a.user.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);

      return (
        search &&
        (severityFilter === "All" || a.severity === severityFilter) &&
        (statusFilter === "All" || a.status === statusFilter)
      );
    });
  }, [alerts, searchQuery, severityFilter, statusFilter]);

  const updateAlert = (id, patch) => {
    setAlerts((prev) => prev.map((a) => (a.alertId === id ? { ...a, ...patch } : a)));
    setInspectedAlert((prev) => (prev?.alertId === id ? { ...prev, ...patch } : prev));
  };

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
            <Radio className="h-5 w-5 shrink-0 animate-pulse text-rose-400" />
            Fraud Alert Command
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            AI-detected behavioral threats and payment anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-300 md:self-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
          Incident Engine Live
        </div>
      </motion.section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Critical", metrics.critical, "text-rose-300"],
          ["High Risk", metrics.high, "text-amber-300"],
          ["Investigating", metrics.review, "text-cyan-300"],
          ["Resolved", metrics.resolved, "text-emerald-300"],
        ].map(([label, value, color]) => (
          <motion.div
            key={label}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 backdrop-blur-xl transition hover:border-rose-500/20"
          >
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <p className={`mt-1 text-2xl font-black ${color}`}>{value}</p>
            </div>
            <ShieldAlert className={`h-4 w-4 opacity-60 ${color}`} />
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
            placeholder="Search alert, user, category..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-4 text-[11px] uppercase tracking-wide text-slate-200 outline-none placeholder:text-slate-600 focus:border-rose-500/40"
          />
        </div>

        <div className="flex w-full flex-wrap gap-2 lg:w-auto">
          <DarkSelect
            icon={<Filter className="h-3 w-3 text-slate-500" />}
            value={severityFilter}
            onChange={setSeverityFilter}
            options={["All", "Critical", "High", "Medium", "Low"]}
          />

          <DarkSelect
            icon={<SlidersHorizontal className="h-3 w-3 text-slate-500" />}
            value={statusFilter}
            onChange={setStatusFilter}
            options={["All", "Open", "Investigating", "Resolved", "Escalated"]}
          />

          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-rose-500/30 hover:text-rose-300 sm:w-auto">
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
          <table className="w-full min-w-[1150px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-800/70 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Incident</th>
                <th className="px-3 py-3">Threat</th>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3 text-center">Risk</th>
                <th className="px-3 py-3 text-center">Severity</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3 text-right">Time</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {filteredAlerts.length ? (
                filteredAlerts.map((a) => (
                  <tr key={a.alertId} className="group/row transition hover:bg-slate-900/40">
                    <td className="whitespace-nowrap px-4 py-3.5 font-bold text-rose-300">
                      {a.alertId}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5">
                      <p className="font-bold text-slate-200">{a.title}</p>
                      <p className="max-w-[220px] truncate text-[9px] text-slate-500">{a.category}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-slate-600" />
                        <div>
                          <p className="font-bold text-slate-300">{a.user}</p>
                          <p className="text-[9px] text-slate-600">{a.accountId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      <span className={`rounded-lg px-2 py-1 text-[10px] font-black ${a.riskScore >= 75 ? "text-rose-300 bg-rose-500/10" : "text-amber-300 bg-amber-500/10"}`}>
                        {a.riskScore}%
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      <span className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${SEVERITY_THEMES[a.severity]}`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      <span className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${STATUS_THEMES[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-500">
                      <div className="flex items-center gap-1">
                        <Server className="h-3 w-3 text-slate-700" />
                        {a.source}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-right text-slate-500">
                      <Clock className="mr-1 inline h-3 w-3 text-slate-700" />
                      {a.time}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                      <div className="inline-flex gap-1.5">
                        <ActionButton onClick={() => setInspectedAlert(a)} label="Inspect" cyan icon />
                        {a.status !== "Resolved" && (
                          <ActionButton onClick={() => updateAlert(a.alertId, { status: "Resolved" })} label="Resolve" green />
                        )}
                        {a.status !== "Escalated" && a.status !== "Resolved" && (
                          <ActionButton onClick={() => updateAlert(a.alertId, { status: "Escalated", severity: "Critical" })} label="Escalate" red />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center font-bold uppercase tracking-widest text-slate-600">
                    No alert instances matched filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/70 bg-slate-950/60 p-3 text-[10px] text-slate-500">
          <div className="flex min-w-0 items-center gap-2">
            <Terminal className="h-3.5 w-3.5 shrink-0 text-rose-400/60" />
            <span className="truncate">
              Showing {filteredAlerts.length} of {alerts.length} incident records.
            </span>
          </div>
          <span className="hidden font-bold text-slate-600 sm:inline">SOC_COMMAND_SECURE</span>
        </div>
      </motion.section>

      <AnimatePresence>
        {inspectedAlert && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectedAlert(null)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 260 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[500px] flex-col overflow-y-auto border-l border-slate-800 bg-slate-950/95 p-5 shadow-[0_0_60px_rgba(0,0,0,0.95)] lg:p-6"
            >
              <div className="mb-5 flex shrink-0 items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-rose-300" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                    Incident Forensics
                  </span>
                </div>
                <button
                  onClick={() => setInspectedAlert(null)}
                  className="rounded-lg border border-slate-800 bg-slate-900/70 p-1 text-slate-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-5">
                <DrawerCard alert={inspectedAlert} />

                <InfoPanel title="AI Behavioral Analysis" icon={<Zap className="h-3.5 w-3.5" />} color="rose">
                  {inspectedAlert.aiExplanation}
                </InfoPanel>

                <InfoPanel title="Recommended Action Plan" icon={<CheckCircle className="h-3.5 w-3.5" />} color="cyan">
                  {inspectedAlert.recommendedAction}
                </InfoPanel>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                  <p className="border-b border-slate-800 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Network Session Footprint
                  </p>
                  <InfoRow label="IP" value={inspectedAlert.sessionContext.ip} />
                  <InfoRow label="Device" value={inspectedAlert.sessionContext.device} />
                  <InfoRow label="Location" value={inspectedAlert.sessionContext.location} amber />
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                  <p className="border-b border-slate-800 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Audit Timeline
                  </p>
                  <div className="relative mt-3 space-y-3 pl-1 before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
                    {inspectedAlert.timeline.map(([status, detail, clock]) => (
                      <div key={`${status}-${clock}`} className="relative flex gap-3 text-[10px]">
                        <span className="z-10 mt-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-rose-400 shadow-[0_0_8px_#fb7185]" />
                        <div>
                          <p className="text-slate-400">
                            <span className="mr-1 rounded border border-slate-800 bg-slate-900 px-1 text-[9px] font-bold uppercase text-slate-200">
                              {status}
                            </span>
                            {detail}
                          </p>
                          <span className="text-[9px] text-slate-600">{clock}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex shrink-0 gap-2 border-t border-slate-800 pt-4">
                {inspectedAlert.status !== "Resolved" && (
                  <button
                    onClick={() => updateAlert(inspectedAlert.alertId, { status: "Resolved" })}
                    className="flex-1 rounded-xl border border-emerald-500/20 bg-emerald-950/40 py-2.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300"
                  >
                    Resolve
                  </button>
                )}
                {inspectedAlert.status !== "Escalated" && inspectedAlert.status !== "Resolved" && (
                  <button
                    onClick={() => updateAlert(inspectedAlert.alertId, { status: "Escalated", severity: "Critical" })}
                    className="flex-1 rounded-xl border border-rose-500/20 bg-rose-950/40 py-2.5 text-[10px] font-bold uppercase tracking-widest text-rose-300"
                  >
                    Escalate
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DarkSelect({ icon, value, onChange, options }) {
  return (
    <div className="flex w-full items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 sm:w-auto">
      {icon}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none bg-slate-950 text-[11px] font-bold uppercase text-slate-300 outline-none sm:w-auto"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-slate-950 text-slate-300">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ActionButton({ label, onClick, cyan, green, red, icon }) {
  const color = cyan
    ? "hover:border-cyan-500/30 hover:text-cyan-300"
    : green
    ? "text-emerald-300 border-emerald-500/20 bg-emerald-500/10"
    : red
    ? "text-rose-300 border-rose-500/20 bg-rose-500/10"
    : "";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 transition ${color}`}
    >
      {icon && <Eye className="h-3 w-3" />}
      {label}
    </button>
  );
}

function DrawerCard({ alert }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
      <div className="absolute right-4 top-4 rounded border border-rose-500/10 bg-rose-500/10 px-2 py-1 text-[9px] font-black tracking-wider text-rose-300">
        {alert.alertId}
      </div>
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
        Anomalous Activity
      </p>
      <h3 className="mt-1 pr-20 text-sm font-black uppercase leading-snug text-white">
        {alert.title}
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-[10px]">
        <MiniInfo label="User" value={alert.user} />
        <MiniInfo label="Account" value={alert.accountId} />
        <MiniInfo label="Category" value={alert.category} cyan />
        <MiniInfo label="Source" value={alert.source} />
      </div>
    </div>
  );
}

function MiniInfo({ label, value, cyan }) {
  return (
    <div>
      <p className="text-slate-600">{label.toUpperCase()}:</p>
      <p className={`truncate font-bold ${cyan ? "text-cyan-300" : "text-slate-300"}`}>
        {value}
      </p>
    </div>
  );
}

function InfoPanel({ title, icon, color, children }) {
  const cls =
    color === "rose"
      ? "border-rose-500/10 bg-rose-500/10 text-rose-300"
      : "border-cyan-500/10 bg-cyan-500/10 text-cyan-300";

  return (
    <div className={`rounded-xl border p-3.5 ${cls}`}>
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
        {icon}
        {title}
      </div>
      <p className="text-[11px] leading-relaxed text-slate-400">{children}</p>
    </div>
  );
}

function InfoRow({ label, value, amber = false }) {
  return (
    <div className="mt-2 flex items-start justify-between gap-4 text-[10px]">
      <span className="shrink-0 text-slate-600">{label}:</span>
      <span className={`text-right font-medium ${amber ? "text-amber-300" : "text-slate-300"}`}>
        {value}
      </span>
    </div>
  );
}