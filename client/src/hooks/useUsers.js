import { useMemo, useState } from "react";
import { usersMockData } from "../data/mockUsers";

export default function useUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  const analyticsSummary = useMemo(
    () => ({
      total: usersMockData.length,
      highRisk: usersMockData.filter((u) => u.riskScore >= 75).length,
      verified: usersMockData.filter((u) => u.verificationState === "VERIFIED").length,
      anomalies: usersMockData.filter((u) => u.status === "Under Review").length,
    }),
    []
  );

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return usersMockData.filter((user) => {
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.accountId.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q);

      const matchesRisk =
        riskFilter === "All" ||
        (riskFilter === "High Risk" && user.riskScore >= 75) ||
        (riskFilter === "Medium Risk" &&
          user.riskScore >= 40 &&
          user.riskScore < 75) ||
        (riskFilter === "Low Risk" && user.riskScore < 40);

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [searchQuery, riskFilter, statusFilter]);

  return {
    users: usersMockData,
    filteredUsers,
    analyticsSummary,

    searchQuery,
    setSearchQuery,

    riskFilter,
    setRiskFilter,

    statusFilter,
    setStatusFilter,

    selectedUser,
    setSelectedUser,
  };
}