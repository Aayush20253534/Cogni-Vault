import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  UserCircle,
  LogOut,
  Activity,
  ShieldCheck,
  Command,
} from "lucide-react";

const pageMeta = {
  "/admin/dashboard": {
    title: "Dashboard",
    subtitle: "Behavioral fraud overview and live risk intelligence",
  },
  "/admin/users": {
    title: "User Intelligence",
    subtitle: "Monitor customer profiles, devices and behavioral baselines",
  },
  "/admin/transactions": {
    title: "UPI Transactions",
    subtitle: "Track payment attempts, blocks and step-up verification",
  },
  "/admin/alerts": {
    title: "Fraud Alerts",
    subtitle: "Review suspicious sessions and critical risk events",
  },
  "/admin/sessions": {
    title: "Live Sessions",
    subtitle: "Observe real-time session telemetry and risk movement",
  },
  "/admin/reports": {
    title: "Reports",
    subtitle: "Audit summaries, analyst reports and fraud intelligence",
  },
};

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = pageMeta[location.pathname] || {
    title: "Security Console",
    subtitle: "Real-time behavioral fraud monitoring",
  };

  const adminEmail = localStorage.getItem("adminEmail") || "admin@bank.local";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("rememberAdmin");

    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminEmail");

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-500/10 bg-slate-950/75 px-4 py-3 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] lg:px-6">
      <div className="flex items-center justify-between gap-4">
        {/* LEFT */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="hidden h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 sm:flex">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-mono text-sm font-black uppercase tracking-[0.18em] text-white sm:text-base">
                <span className="mr-2 text-cyan-400">//</span>
                {currentPage.title}
              </h2>

              <p className="mt-0.5 hidden truncate text-[11px] font-medium text-slate-500 md:block">
                {currentPage.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="hidden w-full max-w-[430px] md:block">
          <div className="group relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-cyan-300" />

            <input
              type="text"
              placeholder="Search user, transaction, session..."
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 py-2.5 pl-10 pr-16 font-mono text-xs text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-400/10"
            />

            <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-0.5 font-mono text-[9px] text-slate-500 lg:flex">
              <Command className="h-3 w-3" />
              K
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* LIVE */}
          <div className="hidden items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
              Live
            </span>
          </div>

          {/* RISK ENGINE */}
          <div className="hidden items-center gap-2 rounded-xl border border-cyan-500/10 bg-slate-900/70 px-3 py-2 lg:flex">
            <Activity className="h-4 w-4 text-cyan-300" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Risk Engine
            </span>
          </div>

          {/* NOTIFICATION */}
          <button
            className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300 hover:shadow-[0_0_18px_rgba(34,211,238,0.08)]"
            aria-label="System alerts"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
          </button>

          {/* PROFILE */}
          <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 px-3 py-2 sm:flex">
            <UserCircle className="h-4 w-4 text-cyan-300" />

            <div className="leading-none">
              <p className="font-mono text-[11px] font-bold text-slate-200">
                Admin
              </p>
              <p className="mt-1 max-w-[110px] truncate text-[9px] text-slate-500">
                {adminEmail}
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="rounded-xl border border-rose-500/10 bg-rose-950/10 p-2.5 text-rose-400 transition hover:border-rose-500/30 hover:bg-rose-950/30 hover:text-rose-300"
            title="Terminate session"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* MOBILE MINI SEARCH */}
      <div className="mt-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 py-2.5 pl-10 pr-4 font-mono text-xs text-slate-200 outline-none focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10"
          />
        </div>
      </div>
    </header>
  );
}