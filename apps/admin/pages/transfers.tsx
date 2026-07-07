import { createElement, useEffect, useState } from "react";
import { listTransferRequests } from "@arrivio/firebase";
import type { TransferRequest } from "@arrivio/shared";
import {
  formatProviderInfo,
  formatTransferMeta,
  formatTransferRoute,
  formatTransferTitle
} from "../src/transferAdminModel";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  background: "#F8FAFC",
  color: "#08183A"
};

const cardStyle = {
  padding: "20px",
  borderRadius: "18px",
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  marginBottom: "14px"
};

export default function AdminTransferRequestsPage() {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [status, setStatus] = useState("Loading transfer requests...");

  async function loadTransfers() {
    try {
      setStatus("Loading transfer requests...");
      const items = await listTransferRequests(50);
      setRequests(items);
      setStatus(items.length ? "" : "No transfer requests yet.");
    } catch (error) {
      setStatus("Transfer requests could not be loaded.");
    }
  }

  useEffect(() => {
    loadTransfers();
  }, []);

  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "40px", margin: "0 0 8px" } }, "Transfer Requests"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, "Latest passenger transfer requests from Firestore."),
    createElement(
      "button",
      {
        type: "button",
        onClick: loadTransfers,
        style: {
          padding: "12px 16px",
          border: 0,
          borderRadius: "999px",
          background: "#0B63F6",
          color: "#FFFFFF",
          fontWeight: 700,
          marginBottom: "24px",
          cursor: "pointer"
        }
      },
      "Refresh"
    ),
    status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
    ...requests.map((request) =>
      createElement(
        "article",
        { key: request.id || request.requestCode, style: cardStyle },
        createElement("h2", { style: { margin: "0 0 8px", fontSize: "22px" } }, formatTransferTitle(request)),
        createElement("p", { style: { margin: "0 0 6px", color: "#0B63F6", fontWeight: 700 } }, formatTransferRoute(request)),
        createElement("p", { style: { margin: "0 0 6px", color: "#4B5563" } }, formatTransferMeta(request)),
        createElement("p", { style: { margin: "0 0 6px" } }, `Phone: ${request.passengerPhone}`),
        createElement("p", { style: { margin: "0 0 6px" } }, `Status: ${request.status}`),
        createElement("p", { style: { margin: 0 } }, `Provider: ${formatProviderInfo(request)}`)
      )
    )
  );
}
