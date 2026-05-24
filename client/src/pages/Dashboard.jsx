import React from "react";
import StatCard from "../components/common/StatCard";
import {
  Users,
  Activity,
  ShieldAlert,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Terminal,
  Cpu,
  Fingerprint,
} from "lucide-react";

const recentAlerts = [
  {
    id: "ALR-809",
    type: "Velocity Attack",
    account: "AC-9082",
    risk: "CRITICAL",
    status: "MITIGATED",
    time: "1m ago",
  },
  {
    id: "ALR-808",
    type: "UPI Device Spoof",
    account: "AC-1124",
    risk: "HIGH",
    status: "ISOLATED",
    time: "4m ago",
  },
  {
    id: "ALR-807",
    type: "Session Hijack",
    account: "AC-7761",
    risk: "CRITICAL",
    status: "CHALLENGED",
    time: "12m ago",
  },
  {
    id: "ALR-806",
    type: "SIM Swap Detection",
    account: "AC-4490",
    risk: "MEDIUM",
    status: "MONITORED",
    time: "18m ago",
  },
];

const intelligenceLogs = [
  {
    node: "AP-SOUTH-1",
    load: "42%",
    packetRate: "18.4k/s",
    shieldState: "OPTIMAL",
  },
  {
    node: "AP-WEST-2",
    load: "68%",
    packetRate: "31.2k/s",
    shieldState: "STABLE",
  },
  {
    node: "UPI-GATEWAY",
    load: "73%",
    packetRate: "42.7k/s",
    shieldState: "ACTIVE",
  },
];

function RiskBadge({ risk }) {
  const styles = {
    CRITICAL: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-300",
    MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  };

  return (
    <span
      className={`rounded-md border px-2 py-1 text-[9px] font-black tracking-wider ${
        styles[risk] || styles.MEDIUM
      }`}
    >
      {risk}
    </span>
  );
}

export default function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <section className="flex flex-col gap-4 border-b border-cyan-500/10 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-mono text-xl font-black uppercase tracking-[0.12em] text-white lg:text-2xl">
            BehaviorShield Command Center
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time banking fraud intelligence and behavioral telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-slate-400">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>AI Core v4.82</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-slate-400">
            <Fingerprint className="h-3.5 w-3.5 text-cyan-400" />
            <span>Telemetry 100%</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Users"
          value="24,892"
          change="+12%"
          icon={Users}
          color="cyan"
          description="Monitored profiles across system"
          trend="up"
        />
        <StatCard
          title="Active Sessions"
          value="1,284"
          change="+8%"
          icon={Activity}
          color="emerald"
          description="Real-time session tracking"
          trend="up"
        />
        <StatCard
          title="Fraud Alerts"
          value="38"
          change="+18%"
          icon={ShieldAlert}
          color="rose"
          description="Incidents requiring analyst review"
          trend="up"
        />
        <StatCard
          title="Blocked Transactions"
          value="128"
          change="+31%"
          icon={AlertTriangle}
          color="amber"
          description="Suspicious payments prevented"
          trend="up"
        />
        <StatCard
          title="Threat Score"
          value="82%"
          change="+5%"
          icon={TrendingUp}
          color="purple"
          description="Aggregate anomaly intensity"
          trend="up"
        />
        <StatCard
          title="UPI Volume"
          value="₹2.4Cr"
          change="+14%"
          icon={CreditCard}
          color="blue"
          description="Total scrutinized payment flow"
          trend="up"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/10 bg-slate-950/50 p-4 shadow-[0_0_30px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-5">
          <div className="absolute left-6 right-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          <div className="mb-4 flex items-center justify-between border-b border-slate-800/70 pb-3">
            <div className="flex items-center gap-2.5">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-slate-200">
                Live Threat Feed
              </h2>
            </div>

            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-slate-500 sm:inline">
              SYS_STREAM
            </span>
          </div>

          <div className="space-y-2">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-900/35 p-3 font-mono text-[11px] transition hover:border-cyan-500/20 hover:bg-slate-900/55 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="shrink-0 font-bold text-cyan-400">
                    {alert.id}
                  </span>
                  <span className="truncate font-medium text-slate-300">
                    {alert.type}
                  </span>
                  <span className="hidden shrink-0 text-slate-500 md:inline">
                    {alert.account}
                  </span>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <RiskBadge risk={alert.risk} />
                  <span className="font-bold tracking-wide text-emerald-400">
                    {alert.status}
                  </span>
                  <span className="text-slate-600">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end border-t border-slate-800/70 pt-3">
            <button className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400 transition hover:text-cyan-300">
              Access Threat Logs →
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-blue-500/10 bg-slate-950/50 p-4 shadow-[0_0_30px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-5">
          <div className="absolute left-6 right-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

          <div className="mb-4 flex items-center justify-between border-b border-slate-800/70 pb-3">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4 text-blue-400" />
              <h2 className="font-mono text-xs font-black uppercase tracking-[0.18em] text-slate-200">
                Risk Intelligence Overview
              </h2>
            </div>

            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-slate-500 sm:inline">
              NETWORK_MAP
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-slate-800/70 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-bold">Node Identity</th>
                  <th className="pb-3 font-bold">Node Load</th>
                  <th className="pb-3 font-bold">Ingress Rate</th>
                  <th className="pb-3 text-right font-bold">
                    Shield Integrity
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/50">
                {intelligenceLogs.map((log) => (
                  <tr
                    key={log.node}
                    className="text-slate-300 transition hover:bg-slate-900/40"
                  >
                    <td className="py-3 font-medium text-slate-200">
                      {log.node}
                    </td>
                    <td className="py-3">{log.load}</td>
                    <td className="py-3 text-slate-400">{log.packetRate}</td>
                    <td className="py-3 text-right font-bold text-emerald-400">
                      {log.shieldState}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end border-t border-slate-800/70 pt-3">
            <button className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400 transition hover:text-blue-300">
              Cluster Analytics Module →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}