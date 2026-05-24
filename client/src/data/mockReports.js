export const initialReports = [
  {
    id: "REP-2026-001",
    title: "Q1 Automated Botnet Campaign Summary",
    type: "Incident",
    generatedBy: "System Core AI",
    fraudValue: "₹11.8Cr",
    status: "Ready",
    createdAt: "2026-05-24",
    aiSummary:
      "Detected and neutralized a multi-vector credential stuffing and automated account takeover campaign targeting high-value accounts.",
    keyFindings:
      "45,000 malicious API calls throttled. 120 compromised sessions terminated at gateway level.",
    modules: ["API Gateway Shield", "Velocity Analyzer", "Device Fingerprinting"],
    timeline: [
      ["04:12", "Anomaly threshold breached on auth endpoint"],
      ["04:15", "Automated perimeter blocking activated"],
      ["05:00", "AI signature set generated"],
    ],
  },
  {
    id: "REP-2026-002",
    title: "SAML Compliance Audit Log",
    type: "Compliance",
    generatedBy: "SecOps Team",
    fraudValue: "₹0",
    status: "Exported",
    createdAt: "2026-05-23",
    aiSummary:
      "Mandatory cryptographic validation of cross-domain authentication tokens completed successfully.",
    keyFindings:
      "100% adherence to token rotation schedules. No orphaned sessions found.",
    modules: ["Identity Vault", "SAML Auditor"],
    timeline: [
      ["09:00", "Token ledger extraction started"],
      ["10:15", "Cryptographic verification completed"],
      ["11:00", "Report exported"],
    ],
  },
  {
    id: "REP-2026-003",
    title: "UPI Velocity Drift Analytics",
    type: "Daily",
    generatedBy: "Fraud Lead",
    fraudValue: "₹7.4Cr",
    status: "Ready",
    createdAt: "2026-05-22",
    aiSummary:
      "Detected mule-account style micro-transfer structuring across several UPI endpoints.",
    keyFindings:
      "Intercepted layered payment routing across 14 suspicious entities.",
    modules: ["UPI Shield", "Graph Risk Model"],
    timeline: [
      ["14:22", "Relationship matrix flag raised"],
      ["16:05", "Manual fraud validation completed"],
    ],
  },
  {
    id: "REP-2026-004",
    title: "Synthetic Identity Ring Deep Dive",
    type: "Weekly",
    generatedBy: "System Core AI",
    fraudValue: "₹17.5Cr",
    status: "Draft",
    createdAt: "2026-05-21",
    aiSummary:
      "Tracked algorithmically generated credit profiles using behavioral form interaction signals.",
    keyFindings:
      "340 synthetic applications flagged using canvas and cadence fingerprints.",
    modules: ["KYC Shield", "Canvas Profiler"],
    timeline: [
      ["01:00", "Weekly clustering pipeline initialized"],
      ["03:45", "Synthetic applications flagged"],
    ],
  },
  {
    id: "REP-2026-005",
    title: "ATM Logical Attack Simulation",
    type: "Incident",
    generatedBy: "RedTeam",
    fraudValue: "₹2.9Cr",
    status: "Ready",
    createdAt: "2026-05-20",
    aiSummary:
      "Post-incident review of simulated malware injection against ATM terminal stack.",
    keyFindings:
      "XFS driver exploitation path blocked via runtime behavior virtualization.",
    modules: ["Endpoint Memory Shield", "XFS Shield"],
    timeline: [
      ["23:11", "Payload executed on Node-ATM-44"],
      ["23:11", "Physical terminal lockout triggered"],
    ],
  },
  {
    id: "REP-2026-006",
    title: "PCI-DSS Network Segmentation Audit",
    type: "Compliance",
    generatedBy: "SecOps Team",
    fraudValue: "₹0",
    status: "Exported",
    createdAt: "2026-05-19",
    aiSummary:
      "Confirmed logical isolation of cardholder data environment from corporate infrastructure.",
    keyFindings:
      "Zero unauthorized firewall ingress or egress rules detected.",
    modules: ["Network Auditor", "CDE Sensor"],
    timeline: [
      ["00:00", "Quarterly compliance sweep started"],
      ["02:30", "Ledger confirmation finalized"],
    ],
  },
  {
    id: "REP-2026-007",
    title: "Mobile API Hooking Exploitation Wave",
    type: "Incident",
    generatedBy: "System Core AI",
    fraudValue: "₹5.1Cr",
    status: "Ready",
    createdAt: "2026-05-18",
    aiSummary:
      "Tracked runtime injection on mobile banking binaries using Frida-like instrumentation.",
    keyFindings:
      "720 rooted or compromised device environments denied access.",
    modules: ["Mobile Integrity Shield", "Anti-Debugging Engine"],
    timeline: [
      ["13:02", "Runtime validation failures spiked"],
      ["13:05", "Protection policy upgraded"],
    ],
  },
  {
    id: "REP-2026-008",
    title: "ACH Batch Processing Outlier Review",
    type: "Daily",
    generatedBy: "Fraud Lead",
    fraudValue: "₹1.4Cr",
    status: "Archived",
    createdAt: "2026-05-17",
    aiSummary:
      "End-of-day clearing variance review found duplicate settlement loop from partner gateway.",
    keyFindings:
      "No malicious intent found. Partner configuration issue corrected.",
    modules: ["ACH Velocity Core"],
    timeline: [
      ["18:40", "Variance exceeded threshold"],
      ["19:15", "Partner loop corrected"],
    ],
  },
];