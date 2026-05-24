import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users as UsersIcon,
  ShieldAlert,
  CheckCircle,
  Smartphone,
  Search,
  Filter,
  Download,
  Snowflake,
  Terminal,
  MapPin,
  Laptop,
  Clock,
  Cpu,
  Fingerprint,
  Activity,
  AlertTriangle,
} from "lucide-react";

import DarkSelect from "../components/common/DarkSelect";
import ActionButton from "../components/common/ActionButton";
import InfoRow from "../components/common/InfoRow";
import DrawerShell from "../components/common/DrawerShell";
import InfoPanel from "../components/common/InfoPanel";

const usersMockData = [
  {
    id: "USR-0912",
    name: "Arjun Mehta",
    email: "arjun.mehta@axisnet.in",
    accountId: "ACC-9901-X",
    device: "Chrome v124 / Windows 11",
    isMobile: false,
    location: "Mumbai, IN",
    riskScore: 94,
    status: "Under Review",
    lastActivity: "12s ago",
    verificationState: "VERIFIED",
    fingerprint: "fp_w11_cr_9921_ax",
    aiExplanation:
      "Sudden velocity shift. 3 high-value UPI transfers initiated within 45 seconds from a non-whitelisted IP subnet while attempting to add an unverified beneficiary.",
    behaviorNotes:
      "Erratic page scrolling velocity, immediate form autofill, rapid tab switching and clipboard-like injection cadence detected.",
  },
  {
    id: "USR-4412",
    name: "Priya Sharma",
    email: "priya.s@hdfcmail.com",
    accountId: "ACC-4412-B",
    device: "Safari / iPhone 15 Pro",
    isMobile: true,
    location: "Delhi, IN",
    riskScore: 18,
    status: "Active",
    lastActivity: "2m ago",
    verificationState: "VERIFIED",
    fingerprint: "fp_ios_sf_0019_m2",
    aiExplanation:
      "All metrics normal. Behavioral biometric cadence matches historical profile with 99.4% confidence.",
    behaviorNotes:
      "Standard touch pressure, steady scroll rates and expected navigation sequences.",
  },
  {
    id: "USR-7810",
    name: "Vikram Singh",
    email: "v.singh@corporate.co.in",
    accountId: "ACC-7810-M",
    device: "Chrome v123 / Android 14",
    isMobile: true,
    location: "Lucknow, IN",
    riskScore: 68,
    status: "Under Review",
    lastActivity: "5m ago",
    verificationState: "PENDING",
    fingerprint: "fp_and_cr_8841_z0",
    aiExplanation:
      "Device cloning signature flagged. Environment variables indicate simulated container execution.",
    behaviorNotes:
      "Accelerated navigation intervals and system clock offset mismatch flagged by 4200ms.",
  },
  {
    id: "USR-1102",
    name: "Neha Rao",
    email: "neha.rao@icicinet.com",
    accountId: "ACC-1102-K",
    device: "Edge v124 / Windows 11",
    isMobile: false,
    location: "Pune, IN",
    riskScore: 91,
    status: "Restricted",
    lastActivity: "Just now",
    verificationState: "VERIFIED",
    fingerprint: "fp_w11_ed_5510_q4",
    aiExplanation:
      "Automated scripting framework detected. Keystroke timing intervals show deterministic zero-variance distribution.",
    behaviorNotes:
      "Zero cursor jitter, repeated exact click coordinates and macro-cadence input generation.",
  },
  {
    id: "USR-5591",
    name: "Aman Verma",
    email: "aman.v@techcorp.io",
    accountId: "ACC-5591-V",
    device: "Firefox v125 / Ubuntu Linux",
    isMobile: false,
    location: "Bengaluru, IN",
    riskScore: 42,
    status: "Active",
    lastActivity: "14m ago",
    verificationState: "VERIFIED",
    fingerprint: "fp_lin_ff_7721_lx",
    aiExplanation:
      "Slight geolocation anomaly. Security parameters remain within secondary thresholds.",
    behaviorNotes:
      "Natural typing flow, regular mouse patterns and expected page-stay duration.",
  },
  {
    id: "USR-2394",
    name: "Rohan Das",
    email: "rohan.das@fintech.in",
    accountId: "ACC-2394-A",
    device: "Chrome v124 / MacOS Sonoma",
    isMobile: false,
    location: "Kolkata, IN",
    riskScore: 85,
    status: "Under Review",
    lastActivity: "22m ago",
    verificationState: "UNVERIFIED",
    fingerprint: "fp_mac_cr_1109_s1",
    aiExplanation:
      "Session hijack indicators triggered. Rapid regional routing variation and cookie modification attempts detected.",
    behaviorNotes:
      "Deep headers changed mid-flight during transactional confirmation payload.",
  },
  {
    id: "USR-0045",
    name: "Ananya Iyer",
    email: "ananya.iyer@retailbank.com",
    accountId: "ACC-0045-Z",
    device: "Safari / iPadOS",
    isMobile: true,
    location: "Chennai, IN",
    riskScore: 25,
    status: "Active",
    lastActivity: "1h ago",
    verificationState: "VERIFIED",
    fingerprint: "fp_pad_sf_4401_ip",
    aiExplanation:
      "Baseline behavioral matching confirms authentic ownership metrics.",
    behaviorNotes:
      "Familiar touch-surface coordinates and steady reading pacing patterns.",
  },
  {
    id: "USR-8821",
    name: "Kabir Malhotra",
    email: "kabir.m@globalconsult.in",
    accountId: "ACC-8821-P",
    device: "Chrome v124 / Windows 11",
    isMobile: false,
    location: "Hyderabad, IN",
    riskScore: 59,
    status: "Active",
    lastActivity: "3h ago",
    verificationState: "VERIFIED",
    fingerprint: "fp_w11_cr_3391_km",
    aiExplanation:
      "Medium risk variance due to small-value beneficiary testing from unmapped regional cells.",
    behaviorNotes:
      "Normal interaction tracking but unusually focused transfer-confirmation behavior.",
  },
];

function getRiskStyles(score) {
  if (score >= 75) {
    return {
      text: "text-rose-300",
      border: "border-rose-500/20",
      bg: "bg-rose-500/10",
      label: "HIGH",
    };
  }

  if (score >= 40) {
    return {
      text: "text-amber-300",
      border: "border-amber-500/20",
      bg: "bg-amber-500/10",
      label: "MEDIUM",
    };
  }

  return {
    text: "text-emerald-300",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    label: "LOW",
  };
}

const STATUS_THEMES = {
  Active: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
  Restricted: "text-rose-300 border-rose-500/20 bg-rose-500/10",
  "Under Review": "text-cyan-300 border-cyan-500/20 bg-cyan-500/10",
};

const layoutVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const blockVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  const analyticsSummary = useMemo(
    () => ({
      total: usersMockData.length,
      highRisk: usersMockData.filter((u) => u.riskScore >= 75).length,
      verified: usersMockData.filter((u) => u.verificationState === "VERIFIED")
        .length,
      anomalies: usersMockData.filter((u) => u.status === "Under Review")
        .length,
    }),
    []
  );

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return usersMockData.filter((user) => {
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.accountId.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q);

      const matchesRisk =
        riskFilter === "All" ||
        (riskFilter === "High Risk" && user.riskScore >= 75) ||
        (riskFilter === "Medium Risk" &&
          user.riskScore >= 40 &&
          user.riskScore < 75) ||
        (riskFilter === "Low Risk" && user.riskScore < 40);

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [searchQuery, riskFilter, statusFilter]);

  const summaryCards = [
    {
      title: "Total Users",
      value: analyticsSummary.total,
      icon: UsersIcon,
      color: "text-blue-300",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "High Risk",
      value: analyticsSummary.highRisk,
      icon: ShieldAlert,
      color: "text-rose-300",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      title: "Verified",
      value: analyticsSummary.verified,
      icon: CheckCircle,
      color: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Under Review",
      value: analyticsSummary.anomalies,
      icon: Smartphone,
      color: "text-cyan-300",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
  ];

  return (
    <motion.div
      variants={layoutVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[1600px] space-y-6 text-slate-300"
    >
      <motion.section
        variants={blockVariants}
        className="flex flex-col justify-between gap-4 border-b border-cyan-500/10 pb-5 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="font-mono text-xl font-black uppercase tracking-[0.16em] text-white">
            User Intelligence Center
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Behavioral profiling, device intelligence and risk analytics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-cyan-300 sm:self-auto">
          <Cpu className="h-3.5 w-3.5 animate-spin [animation-duration:4s]" />
          Behavior Engine Active
        </div>
      </motion.section>

      <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              variants={blockVariants}
              whileHover={{ y: -2 }}
              className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 font-mono backdrop-blur-xl transition hover:border-cyan-500/20"
            >
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <p className="mt-1 text-2xl font-black text-white">
                  {card.value}
                </p>
              </div>

              <div
                className={`rounded-xl border p-2.5 ${card.bg} ${card.border} ${card.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </motion.div>
          );
        })}
      </section>

      <motion.section
        variants={blockVariants}
        className="flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/40 p-3.5 font-mono text-xs backdrop-blur-xl lg:flex-row lg:items-center"
      >
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Search user, email, account, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-4 text-[11px] uppercase tracking-wide text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-500/40"
          />
        </div>

        <div className="flex w-full flex-wrap items-center gap-2.5 lg:w-auto">
          <DarkSelect
  icon={<Filter className="h-3 w-3 text-slate-500" />}
  value={riskFilter}
  onChange={setRiskFilter}
  options={[
    "All",
    "High Risk",
    "Medium Risk",
    "Low Risk",
  ]}
/>

         <DarkSelect
  icon={<Activity className="h-3 w-3 text-slate-500" />}
  value={statusFilter}
  onChange={setStatusFilter}
  options={[
    "All",
    "Active",
    "Under Review",
    "Restricted",
  ]}
/>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300 sm:w-auto">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </motion.section>

      <motion.section
        variants={blockVariants}
        className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/50 shadow-[0_0_35px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <div className="absolute left-6 right-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800/70 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-bold">User</th>
                <th className="px-3 py-3 font-bold">Account</th>
                <th className="px-3 py-3 font-bold">Device</th>
                <th className="px-3 py-3 font-bold">Location</th>
                <th className="px-3 py-3 text-center font-bold">Risk</th>
                <th className="px-3 py-3 text-center font-bold">Status</th>
                <th className="px-3 py-3 text-right font-bold">Activity</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.length ? (
                filteredUsers.map((user) => {
                  const risk = getRiskStyles(user.riskScore);

                  return (
                    <tr
                      key={user.id}
                      className="group/row relative text-slate-300 transition hover:bg-slate-900/40"
                    >
                      <td className="relative whitespace-nowrap px-4 py-3.5">
                        <span className="absolute left-0 top-3 bottom-3 w-[2px] bg-cyan-400 opacity-0 shadow-[0_0_8px_#22d3ee] transition group-hover/row:opacity-100" />

                        <div className="flex flex-col">
                          <span className="font-bold tracking-wide text-slate-200">
                            {user.name}
                          </span>
                          <span className="mt-0.5 text-[10px] lowercase text-slate-600">
                            {user.email}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 font-bold text-cyan-300">
                        {user.accountId}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">
                        <div className="flex items-center gap-2">
                          {user.isMobile ? (
                            <Smartphone className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                          ) : (
                            <Laptop className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                          )}
                          {user.device}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-600" />
                          {user.location}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 text-center">
                        <span
                          className={`inline-block min-w-[72px] rounded-lg border px-2 py-1 text-[10px] font-black ${risk.bg} ${risk.border} ${risk.text}`}
                        >
                          {user.riskScore}% {risk.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 text-center">
                        <span
                          className={`inline-block rounded-lg border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                            STATUS_THEMES[user.status]
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 text-right text-slate-500">
                        <div className="flex items-center justify-end gap-1.5 text-[10px]">
                          <Clock className="h-3 w-3 text-slate-700" />
                          {user.lastActivity}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ActionButton
  onClick={() => setSelectedUser(user)}
  label="Inspect"
  cyan
/>

                          <ActionButton
  onClick={() =>
    alert(`Freeze sequence initiated for ${user.id}`)
  }
  label="Freeze"
  red
  icon={<Snowflake className="h-3 w-3" />}
/>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="bg-slate-950/20 py-12 text-center font-bold uppercase tracking-widest text-slate-600"
                  >
                    No user profiles matched your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/70 bg-slate-950/60 p-3 font-mono text-[10px] text-slate-500">
          <div className="flex min-w-0 items-center gap-2">
            <Terminal className="h-3.5 w-3.5 shrink-0 text-cyan-400/60" />
            <span className="truncate">
              Showing {filteredUsers.length} of {usersMockData.length} user
              intelligence records.
            </span>
          </div>

          <span className="hidden font-bold tracking-wider text-slate-600 sm:inline">
            SEC_LOG_OK
          </span>
        </div>
      </motion.section>

      <AnimatePresence>
        {selectedUser && (
         <>
         <DrawerShell
  title="User Intelligence Payload"
  icon={Fingerprint}
  accent="cyan"
  onClose={() => setSelectedUser(null)}
  maxWidth="max-w-[480px]"
  footer={
    <div className="flex items-center gap-2">
      <button className="flex-1 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition hover:bg-slate-800">
        Step-Up Auth
      </button>

      <button className="flex-1 rounded-xl border border-cyan-500/20 bg-cyan-950/40 py-2.5 text-[10px] font-bold uppercase tracking-widest text-cyan-300 transition hover:border-cyan-500/40 hover:bg-cyan-900/40">
        Clear Status
      </button>
    </div>
  }
>
  <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
    <div className="absolute right-4 top-4 rounded border border-cyan-500/10 bg-cyan-500/10 px-2 py-1 text-[9px] font-black tracking-wider text-cyan-300">
      {selectedUser.id}
    </div>

    <h3 className="pr-20 text-base font-black uppercase tracking-wide text-white">
      {selectedUser.name}
    </h3>

    <p className="mt-1 text-[10px] lowercase text-slate-500">
      {selectedUser.email}
    </p>

    <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-[10px] text-slate-400">
      <span>ACCOUNT</span>
      <span className="font-bold text-slate-200">
        {selectedUser.accountId}
      </span>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
        Threat Index
      </span>
      <p className={`mt-1.5 text-xl font-black ${getRiskStyles(selectedUser.riskScore).text}`}>
        {selectedUser.riskScore}%
      </p>
    </div>

    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
        Verification
      </span>
      <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-200">
        <CheckCircle className="h-3.5 w-3.5 text-emerald-300" />
        {selectedUser.verificationState}
      </div>
    </div>
  </div>

  <InfoPanel title="AI Diagnosis" icon={AlertTriangle} color="rose">
    {selectedUser.aiExplanation}
  </InfoPanel>

  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
    <span className="block border-b border-slate-800 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
      Device Telemetry
    </span>

    <div className="mt-3 space-y-2 text-[10px]">
      <InfoRow label="DEVICE" value={selectedUser.device} />
      <InfoRow label="FINGERPRINT" value={selectedUser.fingerprint} cyan />
      <InfoRow label="LOCATION" value={selectedUser.location} />
    </div>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
      Behavior Notes
    </span>

    <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
      {selectedUser.behaviorNotes}
    </p>
  </div>
</DrawerShell>
         </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
