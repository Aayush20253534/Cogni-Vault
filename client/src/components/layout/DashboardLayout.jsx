import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <div className="relative flex min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-100">
      {/* Background layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:26px_26px]" />

        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.06] blur-[120px]" />

        <div className="absolute -right-24 bottom-10 h-[360px] w-[360px] rounded-full bg-blue-600/[0.05] blur-[110px]" />
      </div>

      <Sidebar />

      <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col pt-16 lg:pt-0">
        <Topbar />

        <main className="w-full flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}