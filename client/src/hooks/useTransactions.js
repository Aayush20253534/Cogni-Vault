import { useMemo, useState } from "react";
import { transactionsMockData } from "../data/mockTransactions";

export default function useTransactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedTxn, setSelectedTxn] = useState(null);

  const summaryMetrics = useMemo(
    () => ({
      total: transactionsMockData.length,
      blocked: transactionsMockData.filter((t) => t.decision === "Blocked").length,
      stepup: transactionsMockData.filter((t) => t.decision === "Step-Up").length,
      approved: transactionsMockData.filter((t) => t.decision === "Approved").length,
      suspicious: transactionsMockData.filter((t) => t.riskScore >= 70).length,
    }),
    []
  );

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return transactionsMockData.filter((txn) => {
      const matchesSearch =
        !q ||
        txn.id.toLowerCase().includes(q) ||
        txn.user.toLowerCase().includes(q) ||
        txn.payee.toLowerCase().includes(q) ||
        txn.accountId.toLowerCase().includes(q);

      const matchesDecision =
        decisionFilter === "All" || txn.decision === decisionFilter;

      const matchesType =
        typeFilter === "All" || txn.type === typeFilter;

      return matchesSearch && matchesDecision && matchesType;
    });
  }, [searchQuery, decisionFilter, typeFilter]);

  return {
    transactions: transactionsMockData,
    filteredTransactions,
    summaryMetrics,
    searchQuery,
    setSearchQuery,
    decisionFilter,
    setDecisionFilter,
    typeFilter,
    setTypeFilter,
    selectedTxn,
    setSelectedTxn,
  };
}