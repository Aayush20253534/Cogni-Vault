import React, { useMemo, useState } from "react";
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

const initialReports = [
  {
    id: "REP-2026-001",
    title: "Q1 Automated Botnet Campaign Summary",
    type: "Incident",
    generatedBy: "System Core AI",
    fraudValue: "₹11.8Cr",
    status: "Ready",
    createdAt: "2026-05-24",
    aiSummary:
      "Detected and neutralized a multi-vector credential stuffing and automated account takeover campaign targeting high-value accounts.",
    keyFindings:
      "45,000 malicious API calls throttled. 120 compromised sessions terminated at gateway level.",
    modules: ["API Gateway Shield", "Velocity Analyzer", "Device Fingerprinting"],
    timeline: [
      ["04:12", "Anomaly threshold breached on auth endpoint"],
      ["04:15", "Automated perimeter blocking activated"],
      ["05:00", "AI signature set generated"],
    ],
  },
  {
    id: "REP-2026-002",
    title: "SAML Compliance Audit Log",
    type: "Compliance",
    generatedBy: "SecOps Team",
    fraudValue: "₹0",
    status: "Exported",
    createdAt: "2026-05-23",
    aiSummary:
      "Mandatory cryptographic validation of cross-domain authentication tokens completed successfully.",
    keyFindings:
      "100% adherence to token rotation schedules. No orphaned sessions found.",
    modules: ["Identity Vault", "SAML Auditor"],
    timeline: [
      ["09:00", "Token ledger extraction started"],
      ["10:15", "Cryptographic verification completed"],
      ["11:00", "Report exported"],
    ],
  },
  {
    id: "REP-2026-003",
    title: "UPI Velocity Drift Analytics",
    type: "Daily",
    generatedBy: "Fraud Lead",
    fraudValue: "₹7.4Cr",
    status: "Ready",
    createdAt: "2026-05-22",
    aiSummary:
      "Detected mule-account style micro-transfer structuring across several UPI endpoints.",
    keyFindings:
      "Intercepted layered payment routing across 14 suspicious entities.",
    modules: ["UPI Shield", "Graph Risk Model"],
    timeline: [
      ["14:22", "Relationship matrix flag raised"],
      ["16:05", "Manual fraud validation completed"],
    ],
  },
  {
    id: "REP-2026-004",
    title: "Synthetic Identity Ring Deep Dive",
    type: "Weekly",
    generatedBy: "System Core AI",
    fraudValue: "₹17.5Cr",
    status: "Draft",
    createdAt: "2026-05-21",
    aiSummary:
      "Tracked algorithmically generated credit profiles using behavioral form interaction signals.",
    keyFindings:
      "340 synthetic applications flagged using canvas and cadence fingerprints.",
    modules: ["KYC Shield", "Canvas Profiler"],
    timeline: [
      ["01:00", "Weekly clustering pipeline initialized"],
      ["03:45", "Synthetic applications flagged"],
    ],
  },
  {
    id: "REP-2026-005",
    title: "ATM Logical Attack Simulation",
    type: "Incident",
    generatedBy: "RedTeam",
    fraudValue: "₹2.9Cr",
    status: "Ready",
    createdAt: "2026-05-20",
    aiSummary:
      "Post-incident review of simulated malware injection against ATM terminal stack.",
    keyFindings:
      "XFS driver exploitation path blocked via runtime behavior virtualization.",
    modules: ["Endpoint Memory Shield", "XFS Shield"],
    timeline: [
      ["23:11", "Payload executed on Node-ATM-44"],
      ["23:11", "Physical terminal lockout triggered"],
    ],
  },
  {
    id: "REP-2026-006",
    title: "PCI-DSS Network Segmentation Audit",
    type: "Compliance",
    generatedBy: "SecOps Team",
    fraudValue: "₹0",
    status: "Exported",
    createdAt: "2026-05-19",
    aiSummary:
      "Confirmed logical isolation of cardholder data environment from corporate infrastructure.",
    keyFindings:
      "Zero unauthorized firewall ingress or egress rules detected.",
    modules: ["Network Auditor", "CDE Sensor"],
    timeline: [
      ["00:00", "Quarterly compliance sweep started"],
      ["02:30", "Ledger confirmation finalized"],
    ],
  },
  {
    id: "REP-2026-007",
    title: "Mobile API Hooking Exploitation Wave",
    type: "Incident",
    generatedBy: "System Core AI",
    fraudValue: "₹5.1Cr",
    status: "Ready",
    createdAt: "2026-05-18",
    aiSummary:
      "Tracked runtime injection on mobile banking binaries using Frida-like instrumentation.",
    keyFindings:
      "720 rooted or compromised device environments denied access.",
    modules: ["Mobile Integrity Shield", "Anti-Debugging Engine"],
    timeline: [
      ["13:02", "Runtime validation failures spiked"],
      ["13:05", "Protection policy upgraded"],
    ],
  },
  {
    id: "REP-2026-008",
    title: "ACH Batch Processing Outlier Review",
    type: "Daily",
    generatedBy: "Fraud Lead",
    fraudValue: "₹1.4Cr",
    status: "Archived",
    createdAt: "2026-05-17",
    aiSummary:
      "End-of-day clearing variance review found duplicate settlement loop from partner gateway.",
    keyFindings:
      "No malicious intent found. Partner configuration issue corrected.",
    modules: ["ACH Velocity Core"],
    timeline: [
      ["18:40", "Variance exceeded threshold"],
      ["19:15", "Partner loop corrected"],
    ],
  },
];

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
  const [reports, setReports] = useState(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return reports.filter((r) => {
      const search =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.generatedBy.toLowerCase().includes(q);

      return (
        search &&
        (typeFilter === "All" || r.type === typeFilter) &&
        (statusFilter === "All" || r.status === statusFilter)
      );
    });
  }, [reports, searchTerm, typeFilter, statusFilter]);

  const metrics = useMemo(
    () => ({
      generated: reports.length,
      prevented: "₹46.1Cr",
      resolved: reports.filter((r) => r.status === "Ready" || r.status === "Exported").length,
      pending: reports.filter((r) => r.status === "Draft").length,
    }),
    [reports]
  );

  const archiveReport = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Archived" } : r))
    );

    setSelectedReport((prev) =>
      prev?.id === id ? { ...prev, status: "Archived" } : prev
    );
  };

  const downloadReport = (title) => {
    alert(`Secure download initialized for ${title}.pdf`);
  };

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




