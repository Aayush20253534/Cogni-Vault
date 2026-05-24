import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Terminal,
  Search,
  Filter,
  Download,
  Eye,
  X,
  MapPin,
  Clock,
  Cpu,
  Fingerprint,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  Zap,
} from "lucide-react";

const transactionMockData = [
  {
    id: "TXN-4091",
    user: "Rohan Sharma",
    email: "rohan.s90@axisnet.in",
    accountId: "ACC-9921-X",
    type: "UPI",
    payee: "unknown_mule_payee.pay",
    amount: "₹1,85,000",
    riskScore: 92,
    decision: "Blocked",
    reason: "Mule beneficiary match",
    time: "14s ago",
    device: "Chrome v124 / Android 14",
    fingerprint: "fp_and_up_9941_zk",
    location: "Mumbai, IN",
    aiExplanation:
      "Destination VPA is flagged as a high-velocity laundering endpoint. Transfer velocity violates the user baseline.",
    timeline: [
      ["Initiated", "UPI intent dispatched from mobile terminal", "14s ago"],
      ["Scored", "BehaviorShield computed risk index at 92%", "13s ago"],
      ["Blocked", "Payment pipeline hold executed", "12s ago"],
    ],
  },
  {
    id: "TXN-4092",
    user: "Priya Mehta",
    email: "p.mehta@hdfcmail.com",
    accountId: "ACC-4410-B",
    type: "IMPS",
    payee: "Aman Verma Self",
    amount: "₹45,000",
    riskScore: 12,
    decision: "Approved",
    reason: "Trusted loop",
    time: "45s ago",
    device: "Safari v17 / iPhone 15 Pro",
    fingerprint: "fp_ios_sf_0019_m2",
    location: "Delhi, IN",
    aiExplanation:
      "Clean behavioral biometric signature. Device hash and input cadence match historical telemetry.",
    timeline: [
      ["Initiated", "IMPS transfer request processed", "45s ago"],
      ["Cleared", "Heuristic evaluation returned clean", "44s ago"],
      ["Settled", "Gateway settlement completed", "41s ago"],
    ],
  },
  {
    id: "TXN-4093",
    user: "Arjun Singh",
    email: "arjun.s@corporate.co.in",
    accountId: "ACC-7812-M",
    type: "UPI",
    payee: "crypto_exchange_vpa",
    amount: "₹2,50,000",
    riskScore: 78,
    decision: "Step-Up",
    reason: "Unusual value velocity",
    time: "2m ago",
    device: "Chrome v124 / Windows 11",
    fingerprint: "fp_w11_cr_3321_as",
    location: "Lucknow, IN",
    aiExplanation:
      "High-value transfer mismatch. User has no previous crypto-related payment history.",
    timeline: [
      ["Initiated", "UPI request generated", "2m ago"],
      ["Flagged", "Value threshold deviation detected", "2m ago"],
      ["Pending", "Biometric challenge dispatched", "1m ago"],
    ],
  },
  {
    id: "TXN-4094",
    user: "Neha Rao",
    email: "neha.rao@icicinet.com",
    accountId: "ACC-1102-K",
    type: "Card",
    payee: "Overseas Luxury Ltd",
    amount: "₹4,10,000",
    riskScore: 89,
    decision: "Blocked",
    reason: "Impossible travel",
    time: "5m ago",
    device: "POS Terminal",
    fingerprint: "pos_term_7710_hk",
    location: "London, UK",
    aiExplanation:
      "Impossible travel detected. User had a verified session in Pune shortly before this card event.",
    timeline: [
      ["Intercepted", "Cross-border settlement requested", "5m ago"],
      ["Failed", "Geo-distance variance check failed", "5m ago"],
      ["Terminated", "Card token temporarily locked", "4m ago"],
    ],
  },
  {
    id: "TXN-4095",
    user: "Aman Verma",
    email: "aman.v@techcorp.io",
    accountId: "ACC-5591-V",
    type: "NEFT",
    payee: "Global Vendor Cluster",
    amount: "₹12,50,000",
    riskScore: 54,
    decision: "Review",
    reason: "First-time merchant",
    time: "11m ago",
    device: "Firefox v125 / Ubuntu Linux",
    fingerprint: "fp_lin_ff_7721_lx",
    location: "Bengaluru, IN",
    aiExplanation:
      "Transaction value matches corporate profile but merchant category is outside monthly baseline.",
    timeline: [["Held", "NEFT queued for analyst validation", "11m ago"]],
  },
  {
    id: "TXN-4096",
    user: "Vikram Das",
    email: "v.das@retail.net",
    accountId: "ACC-0911-A",
    type: "UPI",
    payee: "gaming_wallet_topup",
    amount: "₹8,000",
    riskScore: 45,
    decision: "Review",
    reason: "Macro timing",
    time: "18m ago",
    device: "Chrome v124 / Windows 11",
    fingerprint: "fp_w11_cr_0029_vd",
    location: "Kolkata, IN",
    aiExplanation:
      "Six deposits were executed at identical timing intervals, suggesting scripted activity.",
    timeline: [["Monitored", "Micro-velocity pattern recorded", "18m ago"]],
  },
  {
    id: "TXN-4097",
    user: "Ananya Iyer",
    email: "ananya.iyer@retailbank.com",
    accountId: "ACC-0045-Z",
    type: "UPI",
    payee: "Local Grocery Hub",
    amount: "₹1,200",
    riskScore: 5,
    decision: "Approved",
    reason: "Trusted location",
    time: "24m ago",
    device: "Safari / iPadOS",
    fingerprint: "fp_pad_sf_4401_ip",
    location: "Chennai, IN",
    aiExplanation: "Routine domestic payment. Contextual scoring returned clear.",
    timeline: [["Settled", "Instant settlement finalized", "24m ago"]],
  },
  {
    id: "TXN-4098",
    user: "Kabir Malhotra",
    email: "kabir.m@globalconsult.in",
    accountId: "ACC-8821-P",
    type: "IMPS",
    payee: "Real Estate Escrow",
    amount: "₹15,00,000",
    riskScore: 61,
    decision: "Step-Up",
    reason: "Extreme value deviation",
    time: "42m ago",
    device: "Chrome v124 / MacOS Sonoma",
    fingerprint: "fp_mac_cr_8812_km",
    location: "Hyderabad, IN",
    aiExplanation:
      "Extreme transfer volume requires secondary out-of-band behavioral authorization.",
    timeline: [["Challenged", "Biometric push notification sent", "42m ago"]],
  },
  {
    id: "TXN-4099",
    user: "Sanjay Dutt",
    email: "sanjay.d@omnimail.in",
    accountId: "ACC-3310-Q",
    type: "UPI",
    payee: "unknown_peer_vpa",
    amount: "₹95,000",
    riskScore: 82,
    decision: "Blocked",
    reason: "Rapid device switching",
    time: "1h ago",
    device: "Unknown Terminal",
    fingerprint: "fp_unk_0011_sd",
    location: "Patna, IN",
    aiExplanation:
      "Account accessed across three mobile OS footprints in under four minutes.",
    timeline: [["Blocked", "Access tokens revoked instantly", "1h ago"]],
  },
  {
    id: "TXN-4100",
    user: "Meera Nair",
    email: "m.nair@enterprise.co",
    accountId: "ACC-7722-K",
    type: "NEFT",
    payee: "Staff Payroll Node",
    amount: "₹24,50,000",
    riskScore: 8,
    decision: "Approved",
    reason: "Monthly batch",
    time: "2h ago",
    device: "Edge v124 / Windows 11",
    fingerprint: "fp_w11_ed_9011_mn",
    location: "Kochi, IN",
    aiExplanation: "Standard payroll cycle matched. No abnormal parameters logged.",
    timeline: [["Settled", "Batch transmission succeeded", "2h ago"]],
  },
];

function getRiskStyles(score) {
  if (score >= 75) return "text-rose-300 border-rose-500/20 bg-rose-500/10";
  if (score >= 40) return "text-amber-300 border-amber-500/20 bg-amber-500/10";
  return "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";
}

const DECISION_THEMES = {
  Approved: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
  Blocked: "text-rose-300 border-rose-500/20 bg-rose-500/10",
  "Step-Up": "text-amber-300 border-amber-500/20 bg-amber-500/10",
  Review: "text-cyan-300 border-cyan-500/20 bg-cyan-500/10",
};

const TYPE_BADGES = {
  UPI: "text-purple-300 bg-purple-500/10 border-purple-500/20",
  IMPS: "text-blue-300 bg-blue-500/10 border-blue-500/20",
  NEFT: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
  Card: "text-pink-300 bg-pink-500/10 border-pink-500/20",
};

const containerVariants = {
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

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedTxn, setSelectedTxn] = useState(null);

  const summaryMetrics = useMemo(
    () => ({
      total: transactionMockData.length,
      blocked: transactionMockData.filter((t) => t.decision === "Blocked")
        .length,
      stepup: transactionMockData.filter((t) => t.decision === "Step-Up")
        .length,
      approved: transactionMockData.filter((t) => t.decision === "Approved")
        .length,
      suspicious: transactionMockData.filter((t) => t.riskScore >= 70).length,
    }),
    []
  );

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return transactionMockData.filter((txn) => {
      const matchesSearch =
        !q ||
        txn.id.toLowerCase().includes(q) ||
        txn.user.toLowerCase().includes(q) ||
        txn.payee.toLowerCase().includes(q) ||
        txn.accountId.toLowerCase().includes(q);

      const matchesDecision =
        decisionFilter === "All" || txn.decision === decisionFilter;

      const matchesType = typeFilter === "All" || txn.type === typeFilter;

      return matchesSearch && matchesDecision && matchesType;
    });
  }, [searchQuery, decisionFilter, typeFilter]);

  const statCards = [
    { label: "Total", value: summaryMetrics.total, icon: Activity, color: "text-slate-300" },
    { label: "Blocked", value: summaryMetrics.blocked, icon: AlertTriangle, color: "text-rose-300" },
    { label: "Step-Up", value: summaryMetrics.stepup, icon: Fingerprint, color: "text-amber-300" },
    { label: "Approved", value: summaryMetrics.approved, icon: ShieldCheck, color: "text-emerald-300" },
    { label: "Suspicious", value: summaryMetrics.suspicious, icon: Cpu, color: "text-purple-300" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[1600px] space-y-6 text-slate-300"
    >
      <motion.section
        variants={itemVariants}
        className="flex flex-col justify-between gap-4 border-b border-cyan-500/10 pb-5 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="flex items-center gap-2 font-mono text-xl font-black uppercase tracking-[0.16em] text-white">
            <Zap className="h-5 w-5 shrink-0 text-cyan-300" />
            Transaction Risk Monitor
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time UPI and banking payment risk intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-emerald-300 sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5" />
          Payment Shield Active
        </div>
      </motion.section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/50 p-3.5 font-mono backdrop-blur-xl transition hover:border-cyan-500/20"
            >
              <div className="min-w-0">
                <p className="truncate text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
                <p className={`mt-1 text-xl font-black ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <Icon className={`h-4 w-4 opacity-60 ${stat.color}`} />
            </motion.div>
          );
        })}
      </section>

      <motion.section
        variants={itemVariants}
        className="flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/40 p-3 font-mono text-xs backdrop-blur-xl lg:flex-row lg:items-center"
      >
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Search transaction, user, payee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-4 text-[11px] uppercase tracking-wide text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-500/40"
          />
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
          <DarkSelect
            icon={<Filter className="h-3 w-3 text-slate-500" />}
            value={decisionFilter}
            onChange={setDecisionFilter}
            options={["All", "Approved", "Blocked", "Step-Up", "Review"]}
          />

          <DarkSelect
            icon={<CreditCard className="h-3 w-3 text-slate-500" />}
            value={typeFilter}
            onChange={setTypeFilter}
            options={["All", "UPI", "IMPS", "NEFT", "Card"]}
          />

          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300 sm:w-auto">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/50 shadow-[0_0_35px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800/70 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-bold">Transaction</th>
                <th className="px-3 py-3 font-bold">User</th>
                <th className="px-3 py-3 text-center font-bold">Type</th>
                <th className="px-3 py-3 font-bold">Payee</th>
                <th className="px-3 py-3 text-right font-bold">Amount</th>
                <th className="px-3 py-3 text-center font-bold">Risk</th>
                <th className="px-3 py-3 text-center font-bold">Decision</th>
                <th className="px-3 py-3 font-bold">Reason</th>
                <th className="px-3 py-3 text-right font-bold">Time</th>
                <th className="px-4 py-3 text-right font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {filteredTransactions.length ? (
                filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="group/row text-slate-300 transition hover:bg-slate-900/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-bold text-cyan-300">
                      {txn.id}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <p className="font-bold text-slate-200">{txn.user}</p>
                      <p className="text-[9px] text-slate-600">{txn.accountId}</p>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      <span
                        className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${
                          TYPE_BADGES[txn.type]
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>

                    <td
                      className="max-w-[170px] truncate px-3 py-3.5 text-slate-400"
                      title={txn.payee}
                    >
                      {txn.payee}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-right font-black text-white">
                      {txn.amount}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      <span
                        className={`inline-block min-w-[44px] rounded-lg border px-2 py-1 text-[10px] font-black ${getRiskStyles(
                          txn.riskScore
                        )}`}
                      >
                        {txn.riskScore}%
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      <span
                        className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                          DECISION_THEMES[txn.decision]
                        }`}
                      >
                        {txn.decision}
                      </span>
                    </td>

                    <td
                      className="max-w-[180px] truncate px-3 py-3.5 text-[10px] text-slate-500 transition group-hover/row:text-slate-400"
                      title={txn.reason}
                    >
                      {txn.reason}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-right text-[10px] text-slate-500">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3 text-slate-700" />
                        {txn.time}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedTxn(txn)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300"
                      >
                        <Eye className="h-3 w-3" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="bg-slate-950/20 py-12 text-center font-bold uppercase tracking-widest text-slate-600"
                  >
                    No transactions matched your filters.
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
              Showing {filteredTransactions.length} of{" "}
              {transactionMockData.length} transaction records.
            </span>
          </div>

          <span className="hidden font-black text-slate-600 sm:inline">
            SHIELD_NODE_VERIFIED
          </span>
        </div>
      </motion.section>

      <AnimatePresence>
        {selectedTxn && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTxn(null)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[480px] flex-col overflow-y-auto border-l border-slate-800 bg-slate-950/95 p-5 font-mono text-xs text-slate-300 shadow-[0_0_50px_rgba(0,0,0,0.9)] lg:p-6"
            >
              <div className="mb-5 flex shrink-0 items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-cyan-300" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                    AI Risk Analysis Payload
                  </span>
                </div>

                <button
                  onClick={() => setSelectedTxn(null)}
                  className="rounded-lg border border-slate-800 bg-slate-900/70 p-1 text-slate-500 transition hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-5">
                <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
                  <div className="absolute right-4 top-4 rounded border border-cyan-500/10 bg-cyan-500/10 px-2 py-1 text-[9px] font-black tracking-wider text-cyan-300">
                    {selectedTxn.id}
                  </div>

                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                    Transfer Value
                  </p>

                  <h3 className="mt-1 text-2xl font-black text-white">
                    {selectedTxn.amount}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-[10px]">
                    <Info label="User" value={selectedTxn.user} />
                    <Info label="Type" value={selectedTxn.type} cyan />
                    <Info label="Payee" value={selectedTxn.payee} wide />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Threat Index
                    </p>
                    <p
                      className={`mt-1 text-xl font-black ${
                        getRiskStyles(selectedTxn.riskScore).split(" ")[0]
                      }`}
                    >
                      {selectedTxn.riskScore}%
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      Decision
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${
                        DECISION_THEMES[selectedTxn.decision]
                      }`}
                    >
                      {selectedTxn.decision}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-300">
                    <Cpu className="h-3.5 w-3.5" />
                    AI Diagnosis
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    {selectedTxn.aiExplanation}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                  <p className="border-b border-slate-800 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Device Context
                  </p>
                  <div className="mt-3 space-y-2 text-[10px]">
                    <InfoRow label="DEVICE" value={selectedTxn.device} />
                    <InfoRow
                      label="FINGERPRINT"
                      value={selectedTxn.fingerprint}
                      purple
                    />
                    <InfoRow label="LOCATION" value={selectedTxn.location} />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                  <p className="border-b border-slate-800 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Timeline
                  </p>

                  <div className="relative mt-3 space-y-3 pl-1 before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
                    {selectedTxn.timeline.map(([status, detail, clock]) => (
                      <div key={`${status}-${clock}`} className="relative flex gap-3 text-[10px]">
                        <span className="z-10 mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-slate-950 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        <div>
                          <p className="leading-tight text-slate-400">
                            <span className="mr-1 rounded border border-slate-800 bg-slate-900 px-1 text-[9px] font-bold uppercase text-slate-200">
                              {status}
                            </span>
                            {detail}
                          </p>
                          <span className="text-[9px] text-slate-600">
                            {clock}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex shrink-0 items-center gap-2 border-t border-slate-800 pt-4">
                <button className="flex-1 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition hover:bg-slate-800">
                  Force Chargeback
                </button>

                <button className="flex-1 rounded-xl border border-emerald-500/20 bg-emerald-950/40 py-2.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300 transition hover:border-emerald-500/40 hover:bg-emerald-900/40">
                  Authorize Clear
                </button>
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
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-slate-950 text-slate-300"
          >
            {option === "All" ? "All" : option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Info({ label, value, cyan = false, wide = false }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <p className="text-slate-600">{label.toUpperCase()}:</p>
      <p
        className={`truncate font-bold ${
          cyan ? "text-cyan-300" : "text-slate-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, value, purple = false }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-slate-600">{label}:</span>
      <span
        className={`text-right font-medium ${
          purple ? "text-purple-300" : "text-slate-300"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
