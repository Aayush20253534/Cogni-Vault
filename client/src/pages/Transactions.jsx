import React  from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Terminal,
  Search,
  Filter,
  Download,
  MapPin,
  Clock,
  Cpu,
  Fingerprint,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  Zap,
} from "lucide-react";
import ActionButton from "../components/common/ActionButton";
import DarkSelect from "../components/common/DarkSelect";
import InfoRow from "../components/common/InfoRow";
import DrawerShell from "../components/common/DrawerShell";
import InfoPanel from "../components/common/InfoPanel";

import useTransactions from "../hooks/useTransactions";


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

  const {
  transactions,
  filteredTransactions,
  summaryMetrics,
  searchQuery,
  setSearchQuery,
  decisionFilter,
  setDecisionFilter,
  typeFilter,
  setTypeFilter,
  selectedTxn,
  setSelectedTxn,
} = useTransactions();

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
                  <ActionButton
  onClick={() => setSelectedTxn(txn)}
  label="Inspect"
  cyan
/>
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
              {transactions.length} transaction records.
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
         <DrawerShell
  title="AI Risk Analysis Payload"
  icon={Fingerprint}
  accent="cyan"
  onClose={() => setSelectedTxn(null)}
  maxWidth="max-w-[480px]"
  footer={
    <div className="flex items-center gap-2">
      <button className="flex-1 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition hover:bg-slate-800">
        Force Chargeback
      </button>

      <button className="flex-1 rounded-xl border border-emerald-500/20 bg-emerald-950/40 py-2.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300 transition hover:border-emerald-500/40 hover:bg-emerald-900/40">
        Authorize Clear
      </button>
    </div>
  }
>
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

  <InfoPanel title="AI Diagnosis" icon={Cpu} color="cyan">
    {selectedTxn.aiExplanation}
  </InfoPanel>

  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
    <p className="border-b border-slate-800 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
      Device Context
    </p>
    <div className="mt-3 space-y-2 text-[10px]">
      <InfoRow label="DEVICE" value={selectedTxn.device} />
      <InfoRow label="FINGERPRINT" value={selectedTxn.fingerprint} purple />
      <InfoRow label="LOCATION" value={selectedTxn.location} />
    </div>
  </div>
</DrawerShell>
         </>
        )}
      </AnimatePresence>
    </motion.div>
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


