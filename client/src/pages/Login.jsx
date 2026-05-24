import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ScanLine,
  Sparkles,
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
      setError("Invalid demo credentials.");
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
    }, 700);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-slate-100 flex items-center justify-center px-4 py-6">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.16),transparent_30%),linear-gradient(180deg,#020617,#030712)]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:42px_42px]" />

      {/* Floating blur orbs */}
      <div className="absolute -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-[110px]" />
      <div className="absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-blue-600/20 blur-[120px]" />

      <section className="relative w-full max-w-[430px]">
        {/* Outer neon ring */}
        <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-br from-cyan-400/60 via-blue-500/20 to-transparent blur-sm" />

        <div className="relative rounded-[28px] border border-cyan-400/20 bg-slate-950/75 backdrop-blur-2xl shadow-[0_0_60px_rgba(34,211,238,0.16)] px-5 py-6 sm:px-8 sm:py-8">
          {/* Top scanner line */}
          <div className="absolute left-8 right-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

          <div className="mb-7 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-2xl bg-cyan-400/30 blur-xl" />
              <div className="relative h-16 w-16 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 flex items-center justify-center shadow-[inset_0_0_24px_rgba(34,211,238,0.12)]">
                <Shield className="h-8 w-8 text-cyan-300" />
              </div>
            </div>

            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-mono text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
              SECURE ADMIN NODE
            </div>

            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              Cogni-Vault
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Bank Fraud Command Center
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Admin Identity
              </label>

              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-300 transition" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={DEMO_EMAIL}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-400/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Access Key
              </label>

              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-300 transition" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={DEMO_PASSWORD}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 py-3.5 pl-10 pr-11 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-400/10"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300 transition"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 accent-cyan-400"
                />
                Remember node
              </label>

              <button
                type="button"
                onClick={() =>
                  setError("Password reset is disabled in demo mode.")
                }
                className="hover:text-cyan-300 transition"
              >
                Reset key?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 px-4 py-3.5 text-sm font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.25)] transition hover:shadow-[0_0_40px_rgba(34,211,238,0.42)] hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  Authenticating
                </>
              ) : (
                <>
                  Enter Command Center
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

        </div>
      </section>
    </main>
  );
}