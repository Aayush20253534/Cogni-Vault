import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Archive,
  RefreshCw,
  Cpu,
  Calendar,
  User,
  AlertTriangle,
  Layers,
  Activity,
} from "lucide-react";
import DarkSelect from "../components/common/DarkSelect";
import IconButton from "../components/common/IconButton";
import InfoPanel from "../components/common/InfoPanel";
import MiniBox from "../components/common/MiniBox";
import DrawerShell from "../components/common/DrawerShell";

import useReports from "../hooks/useReports";

const STATUS_THEMES = {
  Ready: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  Exported: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  Draft: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  Archived: "bg-slate-800/70 text-slate-400 border-slate-700",
};

const TYPE_THEMES = {
  Incident: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  Compliance: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  Weekly: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
  Daily: "bg-blue-500/10 text-blue-300 border-blue-500/30",
};

export default function Reports() {

  const {
  reports,
  filteredReports,
  metrics,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  selectedReport,
  setSelectedReport,
  archiveReport,
  downloadReport,
} = useReports();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-[1600px] space-y-6 text-slate-300"
    >
      <section className="flex flex-col justify-between gap-4 border-b border-cyan-500/10 pb-5 md:flex-row md:items-center">
        <div>
          <h1 className="font-mono text-xl font-black uppercase tracking-[0.16em] text-white">
            Fraud Intelligence Reports
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Audit logs, threat summaries and compliance-ready analytics.
          </p>
        </div>

        <button
          onClick={() => alert("Report engine re-synced.")}
          className="flex items-center gap-2 self-start rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-cyan-300 md:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Report Engine Synced
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Reports Generated", metrics.generated, FileText, "text-cyan-300"],
          ["Fraud Prevented", metrics.prevented, ShieldCheck, "text-emerald-300"],
          ["Cases Resolved", metrics.resolved, CheckCircle, "text-purple-300"],
          ["Pending Audits", metrics.pending, Clock, "text-amber-300"],
        ].map(([title, value, Icon, color]) => (
          <motion.div
            key={title}
            whileHover={{ y: -2 }}
            className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 backdrop-blur-xl transition hover:border-cyan-500/20"
          >
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
                {title}
              </p>
              <p className={`mt-1 text-2xl font-black ${color}`}>{value}</p>
            </div>
            <Icon className={`h-4 w-4 opacity-60 ${color}`} />
          </motion.div>
        ))}
      </section>

      <section className="flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-950/40 p-3 backdrop-blur-xl lg:flex-row lg:items-center">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report ID, title, analyst..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-9 pr-4 font-mono text-[11px] uppercase tracking-wide text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-500/40"
          />
        </div>

        <div className="flex w-full flex-wrap gap-2 lg:w-auto">
          <DarkSelect
            icon={<Filter className="h-3 w-3 text-slate-500" />}
            value={typeFilter}
            onChange={setTypeFilter}
            options={["All", "Daily", "Weekly", "Compliance", "Incident"]}
          />

          <DarkSelect
            icon={<Filter className="h-3 w-3 text-slate-500" />}
            value={statusFilter}
            onChange={setStatusFilter}
            options={["All", "Ready", "Draft", "Exported", "Archived"]}
          />

          <button
            onClick={() => downloadReport("Full_Report_Dataset")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300 sm:w-auto"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/50 shadow-[0_0_35px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-slate-800/70 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Report ID</th>
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3 text-center">Type</th>
                <th className="px-3 py-3">Generated By</th>
                <th className="px-3 py-3 text-right">Fraud Value</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3 text-right">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {filteredReports.length ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="transition hover:bg-slate-900/40">
                    <td className="whitespace-nowrap px-4 py-3.5 font-bold text-cyan-300">
                      {report.id}
                    </td>

                    <td className="max-w-[280px] truncate px-3 py-3.5 font-bold text-slate-200">
                      {report.title}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      <span className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${TYPE_THEMES[report.type]}`}>
                        {report.type}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">
                      {report.generatedBy}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-right font-black">
                      <span className={report.fraudValue === "₹0" ? "text-slate-600" : "text-rose-300"}>
                        {report.fraudValue === "₹0" ? "Audit" : report.fraudValue}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-center">
                      <span className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${STATUS_THEMES[report.status]}`}>
                        {report.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5 text-right text-slate-500">
                      {report.createdAt}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-right">
                      <div className="inline-flex gap-1.5">
                        <IconButton onClick={() => setSelectedReport(report)} icon={Eye} cyan />
                        <IconButton onClick={() => downloadReport(report.title)} icon={Download} green />
                        <IconButton
                          onClick={() => archiveReport(report.id)}
                          icon={Archive}
                          purple
                          disabled={report.status === "Archived"}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center font-bold uppercase tracking-widest text-slate-600">
                    No reports matched filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-800/70 bg-slate-950/60 p-3 font-mono text-[10px] text-slate-500">
          Showing {filteredReports.length} of {reports.length} report records.
        </div>
      </section>

      <AnimatePresence>
        {selectedReport && (
         <>
         <DrawerShell
  title="Report Intelligence"
  icon={FileText}
  accent="cyan"
  onClose={() => setSelectedReport(null)}
  maxWidth="max-w-[520px]"
  footer={
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => downloadReport(selectedReport.title)}
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
      >
        <Download className="h-3.5 w-3.5" />
        Download
      </button>

      <button
        onClick={() => archiveReport(selectedReport.id)}
        className="flex items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-950/40 py-2.5 text-xs font-bold text-purple-300"
      >
        <Archive className="h-3.5 w-3.5" />
        Archive
      </button>
    </div>
  }
>
  <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
    <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-600">
      {selectedReport.id}
    </p>

    <h2 className="mt-1 text-lg font-black text-white">
      {selectedReport.title}
    </h2>

    <div className="mt-3 flex flex-wrap gap-2">
      <span className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${TYPE_THEMES[selectedReport.type]}`}>
        {selectedReport.type}
      </span>
      <span className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase ${STATUS_THEMES[selectedReport.status]}`}>
        {selectedReport.status}
      </span>
      <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-500">
        <Calendar className="h-3 w-3" />
        {selectedReport.createdAt}
      </span>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <MiniBox
      label="Protected Value"
      value={selectedReport.fraudValue === "₹0" ? "Audit Only" : selectedReport.fraudValue}
      danger={selectedReport.fraudValue !== "₹0"}
    />
    <MiniBox label="Authority" value={selectedReport.generatedBy} />
  </div>

  <InfoPanel title="AI Diagnostic" icon={Cpu} color="cyan">
    {selectedReport.aiSummary}
  </InfoPanel>

  <InfoPanel title="Key Findings" icon={AlertTriangle} color="rose">
    {selectedReport.keyFindings}
  </InfoPanel>

  <div className="rounded-xl border border-purple-500/10 bg-purple-500/10 p-3.5">
    <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-purple-300">
      <Layers className="h-3.5 w-3.5" />
      Included Modules
    </div>

    <div className="flex flex-wrap gap-1.5">
      {selectedReport.modules.map((module) => (
        <span
          key={module}
          className="rounded-lg border border-purple-500/20 bg-slate-950/50 px-2 py-1 font-mono text-[10px] text-purple-300"
        >
          {module}
        </span>
      ))}
    </div>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
    <div className="mb-3 flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest text-slate-400">
      <Activity className="h-3.5 w-3.5" />
      Audit Timeline
    </div>

    <div className="relative space-y-3 border-l border-slate-800 pl-4">
      {selectedReport.timeline.map(([time, event]) => (
        <div key={`${time}-${event}`} className="relative">
          <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <p className="font-mono text-[9px] text-slate-600">{time}</p>
          <p className="text-xs text-slate-300">{event}</p>
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




