import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldAlert,
  Activity,
  FileText,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: CreditCard,
    },
    {
      name: "Alerts",
      path: "/admin/alerts",
      icon: ShieldAlert,
    },
    {
      name: "Sessions",
      path: "/admin/sessions",
      icon: Activity,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: FileText,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("rememberAdmin");

    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminEmail");

    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const SidebarContent = () => (
    <div className="relative z-10 flex h-full flex-col justify-between">
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-3 border-b border-cyan-500/10 px-4 py-5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 shadow-[0_0_20px_rgba(34,211,238,0.12)]">
            <Shield className="h-6 w-6 text-cyan-400" />

            <div className="absolute inset-0 rounded-xl bg-cyan-400/5 blur-md" />
          </div>

          <div>
            <h1 className="font-mono text-sm font-black uppercase tracking-[0.18em] text-white">
              Behavior
              <span className="text-cyan-400">Shield</span>
            </h1>

            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500/70">
              Fraud Command Center
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-6 space-y-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `
                  group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3
                  font-mono text-xs font-medium tracking-wide transition-all duration-300

                  ${
                    isActive
                      ? "border border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 to-transparent text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                      : "text-slate-400 hover:border hover:border-slate-700/40 hover:bg-slate-900/50 hover:text-white"
                  }
                `
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    )}

                    <div
                      className={`
                        absolute right-0 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full blur-2xl transition-opacity duration-300
                        ${
                          isActive
                            ? "bg-cyan-400/10 opacity-100"
                            : "bg-transparent opacity-0 group-hover:opacity-100"
                        }
                      `}
                    />

                    <Icon
                      className={`
                        relative z-10 h-4 w-4 transition-all duration-300
                        ${
                          isActive
                            ? "text-cyan-300"
                            : "text-slate-500 group-hover:text-cyan-300"
                        }
                      `}
                    />

                    <span className="relative z-10">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="space-y-3 border-t border-cyan-500/10 bg-slate-950/30 p-3">
        {/* SYSTEM STATUS */}
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-slate-900/50 px-4 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Sec-Core
          </span>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
              System Active
            </span>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-2xl border border-rose-500/10 bg-rose-950/10 px-4 py-3 font-mono text-xs font-medium tracking-wide text-rose-400 transition-all duration-300 hover:border-rose-500/30 hover:bg-rose-950/20 hover:text-rose-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.08)]"
        >
          <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />

          <span>Terminate Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* TOP LASER LINE */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

      {/* MOBILE TOPBAR */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-400" />

          <span className="font-mono text-xs font-black uppercase tracking-[0.18em] text-white">
            BehaviorShield
          </span>
        </div>

        <button
          onClick={toggleSidebar}
          className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 transition hover:text-cyan-300"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50
          w-[260px]
          bg-slate-950/90
          backdrop-blur-2xl
          border-r border-cyan-500/10
          shadow-[0_0_40px_rgba(0,0,0,0.7)]
          transition-transform duration-300 ease-in-out

          lg:m-3
          lg:h-[calc(100vh-24px)]
          lg:rounded-3xl
          lg:border

          ${
            isOpen
              ? "translate-x-0 pt-16 lg:pt-0"
              : "-translate-x-full lg:translate-x-0 pt-16 lg:pt-0"
          }
        `}
      >
        {/* GRID */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:18px_18px]" />

        {/* GLOW ORBS */}
        <div className="pointer-events-none absolute top-20 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-10 left-4 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl" />

        <SidebarContent />
      </aside>

      {/* DESKTOP SPACER */}
      <div className="hidden w-[272px] shrink-0 lg:block" />
    </>
  );
}