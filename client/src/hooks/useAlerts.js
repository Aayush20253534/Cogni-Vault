import { useMemo, useState } from "react";
import { initialAlerts } from "../data/mockAlerts";

export default function useAlerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [inspectedAlert, setInspectedAlert] = useState(null);

  const metrics = useMemo(
    () => ({
      critical: alerts.filter(
        (a) => a.severity === "Critical" && a.status !== "Resolved"
      ).length,
      high: alerts.filter(
        (a) => a.severity === "High" && a.status !== "Resolved"
      ).length,
      review: alerts.filter((a) => a.status === "Investigating").length,
      resolved: alerts.filter((a) => a.status === "Resolved").length,
    }),
    [alerts]
  );

  const filteredAlerts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return alerts.filter((a) => {
      const search =
        !q ||
        a.alertId.toLowerCase().includes(q) ||
        a.user.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);

      return (
        search &&
        (severityFilter === "All" || a.severity === severityFilter) &&
        (statusFilter === "All" || a.status === statusFilter)
      );
    });
  }, [alerts, searchQuery, severityFilter, statusFilter]);

  const updateAlert = (id, patch) => {
    setAlerts((prev) =>
      prev.map((a) => (a.alertId === id ? { ...a, ...patch } : a))
    );

    setInspectedAlert((prev) =>
      prev?.alertId === id ? { ...prev, ...patch } : prev
    );
  };

  return {
    alerts,
    filteredAlerts,
    metrics,
    searchQuery,
    setSearchQuery,
    severityFilter,
    setSeverityFilter,
    statusFilter,
    setStatusFilter,
    inspectedAlert,
    setInspectedAlert,
    updateAlert,
  };
}