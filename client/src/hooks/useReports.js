import { useMemo, useState } from "react";
import { initialReports } from "../data/mockReports";

export default function useReports() {
  const [reports, setReports] = useState(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return reports.filter((r) => {
      const matchesSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.generatedBy.toLowerCase().includes(q);

      return (
        matchesSearch &&
        (typeFilter === "All" || r.type === typeFilter) &&
        (statusFilter === "All" || r.status === statusFilter)
      );
    });
  }, [reports, searchTerm, typeFilter, statusFilter]);

  const metrics = useMemo(
    () => ({
      generated: reports.length,
      prevented: "₹46.1Cr",
      resolved: reports.filter(
        (r) => r.status === "Ready" || r.status === "Exported"
      ).length,
      pending: reports.filter((r) => r.status === "Draft").length,
    }),
    [reports]
  );

  const archiveReport = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Archived" } : r))
    );

    setSelectedReport((prev) =>
      prev?.id === id ? { ...prev, status: "Archived" } : prev
    );
  };

  const downloadReport = (title) => {
    alert(`Secure download initialized for ${title}.pdf`);
  };

  return {
    reports,
    filteredReports,
    metrics,

    searchTerm,
    setSearchTerm,

    typeFilter,
    setTypeFilter,

    statusFilter,
    setStatusFilter,

    selectedReport,
    setSelectedReport,

    archiveReport,
    downloadReport,
  };
}