import {
  Users,
  Activity,
  ShieldAlert,
  CreditCard,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function useDashboardStats() {
  const statCards = [
    {
      title: "Total Users",
      value: "24,892",
      change: "+12%",
      icon: Users,
      color: "cyan",
      description: "Monitored profiles across system",
      trend: "up",
    },
    {
      title: "Active Sessions",
      value: "1,284",
      change: "+8%",
      icon: Activity,
      color: "emerald",
      description: "Real-time session tracking",
      trend: "up",
    },
    {
      title: "Fraud Alerts",
      value: "38",
      change: "+18%",
      icon: ShieldAlert,
      color: "rose",
      description: "Incidents requiring analyst review",
      trend: "up",
    },
    {
      title: "Blocked Transactions",
      value: "128",
      change: "+31%",
      icon: AlertTriangle,
      color: "amber",
      description: "Suspicious payments prevented",
      trend: "up",
    },
    {
      title: "Threat Score",
      value: "82%",
      change: "+5%",
      icon: TrendingUp,
      color: "purple",
      description: "Aggregate anomaly intensity",
      trend: "up",
    },
    {
      title: "UPI Volume",
      value: "₹2.4Cr",
      change: "+14%",
      icon: CreditCard,
      color: "blue",
      description: "Total scrutinized payment flow",
      trend: "up",
    },
  ];

  return { statCards };
}