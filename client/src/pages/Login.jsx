import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  Mail,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const DEMO_EMAIL = "admin@behaviorshield.internal";
const DEMO_PASSWORD = "admin123";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError("Invalid demo credentials. Use the sandbox keys shown below.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem(
        "adminToken",
        "mock-jwt-behaviorshield-admin-token-2026"
      );
      localStorage.setItem("adminEmail", cleanEmail);
      localStorage.setItem("rememberAdmin", String(rememberMe));

      setIsLoading(false);
      navigate("/admin/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#060b19] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0c1938] via-[#060b19] to-[#03060f] flex text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-400">
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between border-r border-slate-800/40 bg-gradient-to-b from-slate-950/20 to-transparent relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              BehaviorShield
            </h1>
            <p className="text-xs text-cyan-400/80 font-mono tracking-widest uppercase mt-0.5">
              Bank Fraud Command Center
            </p>
          </div>
        </div>

        <div className="my-auto max-w-md space-y-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              SYSTEMS CORE: OPERATIONAL
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-slate-100">
              Real-time behavior analysis & telemetry tracking.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>ACTIVE NODE</span>
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className="text-sm font-mono text-cyan-400 font-semibold">
                Node-047//Demo
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>RISK ENGINE</span>
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-xl font-semibold text-white tracking-tight">
                Live
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs text-slate-400 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500">THREAT TELEMETRY</span>
              <span className="text-[10px] text-slate-500">MOCK FEED</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400/90">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>AI Engine: Pattern modeling synchronized.</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400/90">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Suspicious UPI attempt isolated: TXN_MOCK_892</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-mono relative z-10">
          Classification: Restricted demo environment // authorized admin access only.
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12 relative">
        <div className="lg:hidden flex items-center gap-3 mb-10 self-start">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">BehaviorShield</h1>
            <p className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
              Bank Fraud Command Center
            </p>
          </div>
        </div>

        <div className="w-full max-w-md bg-slate-900/30 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative transition-all duration-300 hover:border-slate-700">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent blur-[1px]" />

          <div className="mb-8">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Gateway Authentication
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Enter admin credentials to access fraud monitoring operations.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Admin Identifier
              </label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={DEMO_EMAIL}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono text-sm shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Access Key
                </label>
                <button
                  type="button"
                  className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                  onClick={() => setError("Password reset is disabled in demo mode.")}
                >
                  Reset Key?
                </button>
              </div>

              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-cyan-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono text-sm shadow-inner"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group text-xs text-slate-400 select-none">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 bg-slate-950 rounded border border-slate-800 peer-checked:border-cyan-500 peer-checked:bg-cyan-500/10 flex items-center justify-center transition-all group-hover:border-slate-600">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-sm opacity-0 peer-checked:opacity-100 transition-all shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                  </div>
                </div>
                <span>Keep encrypted session open</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold tracking-wide text-sm shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 group/btn"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Initialize Connection</span>
                  <Terminal className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/60 font-mono text-xs">
            <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80">
              <span className="text-cyan-400/90 font-semibold block mb-1.5 uppercase tracking-wider text-[10px]">
                Demo Sandbox Credentials
              </span>
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">ID:</span>
                  <span className="text-right">{DEMO_EMAIL}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">KEY:</span>
                  <span>{DEMO_PASSWORD}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] text-slate-600 font-mono">
          &copy; 2026 BehaviorShield. Demo banking security environment.
        </div>
      </div>
    </div>
  );
}