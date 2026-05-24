import { useMemo, useState } from "react";
import { sessionMockData } from "../data/mockSessions";

export default function useSessions() {
  const [sessions, setSessions] = useState(sessionMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [inspectedSession, setInspectedSession] = useState(null);

  const summary = useMemo(
    () => ({
      active: sessions.filter((s) => s.sessionState === "Active").length,
      suspicious: sessions.filter((s) => s.sessionState === "Suspicious").length,
      device: sessions.filter((s) =>
        `${s.anomalyReason}`.toLowerCase().includes("device")
      ).length,
      geo: sessions.filter((s) =>
        `${s.anomalyReason}`.toLowerCase().match(/travel|vpn/)
      ).length,
      terminated: sessions.filter((s) => s.sessionState === "Terminated").length,
    }),
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return sessions.filter((s) => {
      const search =
        !q ||
        s.sessionId.toLowerCase().includes(q) ||
        s.user.toLowerCase().includes(q) ||
        s.ip.toLowerCase().includes(q) ||
        s.device.toLowerCase().includes(q) ||
        s.anomalyReason.toLowerCase().includes(q);

      return (
        search &&
        (riskFilter === "All" || s.riskLevel === riskFilter) &&
        (stateFilter === "All" || s.sessionState === stateFilter)
      );
    });
  }, [sessions, searchQuery, riskFilter, stateFilter]);

  const updateSession = (id, patch) => {
    setSessions((prev) =>
      prev.map((s) => (s.sessionId === id ? { ...s, ...patch } : s))
    );

    setInspectedSession((prev) =>
      prev?.sessionId === id ? { ...prev, ...patch } : prev
    );
  };

  return {
    sessions,
    filteredSessions,
    summary,

    searchQuery,
    setSearchQuery,

    riskFilter,
    setRiskFilter,

    stateFilter,
    setStateFilter,

    inspectedSession,
    setInspectedSession,

    updateSession,
  };
}