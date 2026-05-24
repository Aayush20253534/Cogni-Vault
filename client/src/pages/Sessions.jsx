import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Search,
  Filter,
  SlidersHorizontal,
  FileSpreadsheet,
  X,
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


const sessionMockData = [
  {
    sessionId: "SES-88401",
    user: "Arjun Mehta",
    accountId: "ACC-5421-B",
    ip: "103.241.12.89",
    location: "Mumbai, IN",
    device: "OnePlus 11",
    browser: "Chrome Mobile v124",
    behaviorScore: 94,
    sessionState: "Suspicious",
    riskLevel: "High",
    duration: "4m 12s",
    lastActivity: "12s ago",
    anomalyReason: "Emulator Signature Detected",
    fingerprint: "FPR-A98B2-X9",
    aiExplanation:
      "Browser canvas rendering indicates headless automated runtime orchestration and compromised device parameters.",
    networkIntel:
      "ISP: Reliance Jio | Connection Type: Cellular spoofed gateway",
    timeline: [
      ["Session Initialized", "Gateway handshake verified.", "4m 12s ago"],
      ["Biometric Evaluation", "Touch latency indicates non-human vectors.", "3m 50s ago"],
      ["Fund Transfer Staged", "Attempted ₹450,000 routing.", "1m 15s ago"],
    ],
  },
  {
    sessionId: "SES-88402",
    user: "Elena Rostova",
    accountId: "ACC-0092-K",
    ip: "185.220.101.5",
    location: "Frankfurt, DE",
    device: "Apple MacBook Pro",
    browser: "Safari v17.4",
    behaviorScore: 91,
    sessionState: "Suspicious",
    riskLevel: "High",
    duration: "12m 45s",
    lastActivity: "4s ago",
    anomalyReason: "Impossible Travel Pivot",
    fingerprint: "FPR-C11D9-M4",
    aiExplanation:
      "Authentication token moved from Bengaluru to Frankfurt within 14 minutes. Physical transit validation failed.",
    networkIntel: "ISP: M2 Hosting | Known Tor exit relay",
    timeline: [
      ["Login", "Login cleared from Bengaluru profile node.", "12m ago"],
      ["Token Hijack", "Session state replicated across proxy framework.", "8m ago"],
    ],
  },
  {
    sessionId: "SES-88403",
    user: "Vikram Malhotra",
    accountId: "ACC-7719-L",
    ip: "49.36.185.210",
    location: "Ahmedabad, IN",
    device: "Xiaomi Redmi Note 12",
    browser: "Edge Mobile v123",
    behaviorScore: 82,
    sessionState: "Active",
    riskLevel: "High",
    duration: "1m 30s",
    lastActivity: "Just now",
    anomalyReason: "Macro Cadence Execution",
    fingerprint: "FPR-E4421-Z0",
    aiExplanation:
      "Deterministic coordinate interactions and uniform field navigation indicate macro/scripted input.",
    networkIntel: "ISP: Airtel | Dynamic broadband pool",
    timeline: [["Input Injection", "12 fields injected within 88ms.", "45s ago"]],
  },
  {
    sessionId: "SES-88404",
    user: "Priya Sharma",
    accountId: "ACC-1102-M",
    ip: "14.139.22.4",
    location: "New Delhi, IN",
    device: "Custom Desktop PC",
    browser: "Chrome Enterprise v125",
    behaviorScore: 18,
    sessionState: "Active",
    riskLevel: "Low",
    duration: "45m 12s",
    lastActivity: "2m ago",
    anomalyReason: "None",
    fingerprint: "FPR-F9922-A1",
    aiExplanation:
      "Telemetry matches verified baseline profiles with clean keyboard, mouse and network behavior.",
    networkIntel: "ISP: National Knowledge Network | Corporate fixed line",
    timeline: [["Statement Inquiry", "Downloaded historical ledger.", "30m ago"]],
  },
  {
    sessionId: "SES-88405",
    user: "Kabir Thapar",
    accountId: "ACC-6691-Q",
    ip: "103.44.112.19",
    location: "Ranchi, IN",
    device: "Samsung Galaxy S24 Ultra",
    browser: "Samsung Internet v24",
    behaviorScore: 78,
    sessionState: "Active",
    riskLevel: "Medium",
    duration: "8m 19s",
    lastActivity: "1m ago",
    anomalyReason: "Rooted Device Attestation Fail",
    fingerprint: "FPR-K0032-B8",
    aiExplanation:
      "SafetyNet integrity failure detected. Superuser binary modules are accessible.",
    networkIntel: "ISP: Reliance Jio | 5G mobile network",
    timeline: [["Sandbox Exception", "Kernel tamper flag returned.", "8m ago"]],
  },
  {
    sessionId: "SES-88406",
    user: "Ananya Sen",
    accountId: "ACC-3319-P",
    ip: "192.168.43.11",
    location: "Kolkata, IN",
    device: "iPhone 15 Pro",
    browser: "Safari Mobile v17",
    behaviorScore: 45,
    sessionState: "Active",
    riskLevel: "Medium",
    duration: "18m",
    lastActivity: "5m ago",
    anomalyReason: "Suspicious VPN Routing",
    fingerprint: "FPR-L8810-C3",
    aiExplanation:
      "Traffic traverses encrypted datacenter hosting instead of residential access pools.",
    networkIntel: "ISP: DigitalOcean block | Encrypted tunnel",
    timeline: [["VPN Route", "Authentication routed over synthetic VPN layer.", "18m ago"]],
  },
  {
    sessionId: "SES-88407",
    user: "Zain Malik",
    accountId: "ACC-4410-X",
    ip: "103.88.221.14",
    location: "Bengaluru, IN",
    device: "Google Pixel 8 Pro",
    browser: "Chrome Mobile v124",
    behaviorScore: 99,
    sessionState: "Locked",
    riskLevel: "High",
    duration: "5m 4s",
    lastActivity: "1m ago",
    anomalyReason: "Scripted Interface Scraping",
    fingerprint: "FPR-P4410-Q5",
    aiExplanation:
      "Automated crawling signatures detected across restricted ledger endpoints.",
    networkIntel: "ISP: ACT Fibernet | Metro backbone",
    timeline: [["Automated Lock", "Portal deployed transaction lock.", "1m ago"]],
  },
  {
    sessionId: "SES-88408",
    user: "Meera Nair",
    accountId: "ACC-1289-Y",
    ip: "157.44.89.102",
    location: "Kochi, IN",
    device: "Asus ZenBook",
    browser: "Chrome v124",
    behaviorScore: 61,
    sessionState: "Terminated",
    riskLevel: "Medium",
    duration: "14m 22s",
    lastActivity: "10m ago",
    anomalyReason: "Concurrent Multi-Device Access",
    fingerprint: "FPR-R3310-K2",
    aiExplanation:
      "Conflicting browser configurations used the same access token concurrently.",
    networkIntel: "ISP: Asianet | Local fiber terminal",
    timeline: [["Session Annulled", "Token pools force-terminated.", "10m ago"]],
  },
];

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
  const [sessions, setSessions] = useState(sessionMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [inspectedSession, setInspectedSession] = useState(null);

  const summary = useMemo(
    () => ({
      active: sessions.filter((s) => s.sessionState === "Active").length,
      suspicious: sessions.filter((s) => s.sessionState === "Suspicious").length,
      device: sessions.filter((s) =>
        `${s.anomalyReason}`.toLowerCase().includes("device")
      ).length,
      geo: sessions.filter((s) =>
        `${s.anomalyReason}`.toLowerCase().match(/travel|vpn/)
      ).length,
      terminated: sessions.filter((s) => s.sessionState === "Terminated").length,
    }),
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return sessions.filter((s) => {
      const search =
        !q ||
        s.sessionId.toLowerCase().includes(q) ||
        s.user.toLowerCase().includes(q) ||
        s.ip.toLowerCase().includes(q) ||
        s.device.toLowerCase().includes(q) ||
        s.anomalyReason.toLowerCase().includes(q);

      return (
        search &&
        (riskFilter === "All" || s.riskLevel === riskFilter) &&
        (stateFilter === "All" || s.sessionState === stateFilter)
      );
    });
  }, [sessions, searchQuery, riskFilter, stateFilter]);

  const updateSession = (id, patch) => {
    setSessions((prev) =>
      prev.map((s) => (s.sessionId === id ? { ...s, ...patch } : s))
    );
    setInspectedSession((prev) =>
      prev?.sessionId === id ? { ...prev, ...patch } : prev
    );
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

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 260 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[500px] flex-col overflow-y-auto border-l border-slate-800 bg-slate-950/95 p-5 shadow-[0_0_60px_rgba(0,0,0,0.95)] lg:p-6"
            >
              <div className="mb-5 flex shrink-0 items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-300" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                    Session Forensics
                  </span>
                </div>
                <button
                  onClick={() => setInspectedSession(null)}
                  className="rounded-lg border border-slate-800 bg-slate-900/70 p-1 text-slate-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-5">
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
                  <MiniBadge label="Risk" value={inspectedSession.riskLevel} className={RISK_THEMES[inspectedSession.riskLevel]} />
                  <MiniBadge label="State" value={inspectedSession.sessionState} className={STATE_THEMES[inspectedSession.sessionState]} />
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
              </div>

              <div className="mt-5 flex shrink-0 gap-2 border-t border-slate-800 pt-4">
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
            </motion.aside>
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

