import React from "react";
import StatCard from "../components/common/StatCard";

import RiskOverview from "../components/dashboard/RiskOverview";
import RiskTrendChart from "../components/dashboard/RiskTrendChart";
import RecentAlerts from "../components/dashboard/RecentAlerts";
import LiveSessionTable from "../components/dashboard/LiveSessionTable";
import FraudPieChart from "../components/dashboard/FraudPieChart";

import {
  Cpu,
  Fingerprint,
} from "lucide-react";

import useDashboardStats from "../hooks/useDashboardStats";

export default function Dashboard() {

  const { statCards } = useDashboardStats();
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      {/* HEADER */}
      <section className="flex flex-col gap-4 border-b border-cyan-500/10 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-mono text-xl font-black uppercase tracking-[0.12em] text-white lg:text-2xl">
            BehaviorShield Command Center
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Real-time banking fraud intelligence and behavioral telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
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

      {/* STAT CARDS */}
<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
  {statCards.map((card) => (
    <StatCard
      key={card.title}
      title={card.title}
      value={card.value}
      change={card.change}
      icon={card.icon}
      color={card.color}
      description={card.description}
      trend={card.trend}
    />
  ))}
</section>

      {/* RISK OVERVIEW */}
      <RiskOverview />

      {/* CHARTS */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <RiskTrendChart />

       <FraudPieChart />
      </section>

      {/* LIVE SESSIONS */}
      <LiveSessionTable />

      {/* RECENT ALERTS */}
      <RecentAlerts />
    </div>
  );
}