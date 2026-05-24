import {
  Users,
  Activity,
  ShieldAlert,
  CreditCard,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import { usersMockData } from "../data/mockUsers";
import { sessionMockData } from "../data/mockSessions";
import { initialAlerts } from "../data/mockAlerts";
import { transactionsMockData } from "../data/mockTransactions";

function parseAmount(amount) {
  return Number(String(amount).replace(/[₹,]/g, "")) || 0;
}

function formatINR(value) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function useDashboardStats() {
  const totalUsers = usersMockData.length;

  const activeSessions = sessionMockData.filter(
    (s) => s.sessionState === "Active"
  ).length;

  const fraudAlerts = initialAlerts.filter(
    (a) => a.status !== "Resolved"
  ).length;

  const blockedTransactions = transactionsMockData.filter(
    (t) => t.decision === "Blocked"
  ).length;

  const avgThreatScore = Math.round(
    transactionsMockData.reduce((sum, t) => sum + t.riskScore, 0) /
      transactionsMockData.length
  );

  const upiVolume = transactionsMockData
    .filter((t) => t.type === "UPI")
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const statCards = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString("en-IN"),
      change: "+12%",
      icon: Users,
      color: "cyan",
      description: "Monitored profiles across system",
      trend: "up",
    },
    {
      title: "Active Sessions",
      value: activeSessions.toLocaleString("en-IN"),
      change: "+8%",
      icon: Activity,
      color: "emerald",
      description: "Real-time session tracking",
      trend: "up",
    },
    {
      title: "Fraud Alerts",
      value: fraudAlerts.toLocaleString("en-IN"),
      change: "+18%",
      icon: ShieldAlert,
      color: "rose",
      description: "Unresolved incidents requiring review",
      trend: "up",
    },
    {
      title: "Blocked Transactions",
      value: blockedTransactions.toLocaleString("en-IN"),
      change: "+31%",
      icon: AlertTriangle,
      color: "amber",
      description: "Suspicious payments prevented",
      trend: "up",
    },
    {
      title: "Threat Score",
      value: `${avgThreatScore}%`,
      change: "+5%",
      icon: TrendingUp,
      color: "purple",
      description: "Average transaction risk score",
      trend: "up",
    },
    {
      title: "UPI Volume",
      value: formatINR(upiVolume),
      change: "+14%",
      icon: CreditCard,
      color: "blue",
      description: "Total scrutinized UPI payment flow",
      trend: "up",
    },
  ];

  return { statCards };
}