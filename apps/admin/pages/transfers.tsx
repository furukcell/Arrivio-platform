import { createElement, useEffect, useState } from "react";
import { assignTransferProvider, filterTransferProviders, listProviders, listTransferRequests } from "@arrivio/firebase";
import type { Provider, TransferRequest } from "@arrivio/shared";
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

const selectStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  marginBottom: "10px",
  border: "1px solid #D1D5DB",
  borderRadius: "12px"
};

export default function AdminTransferRequestsPage() {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("Loading transfer requests...");
  const [assigningId, setAssigningId] = useState<string>("");

  async function loadData() {
    try {
      setStatus("Loading transfer requests...");
      const transferItems = await listTransferRequests(50);
      const providerItems = filterTransferProviders(await listProviders());
      setRequests(transferItems);
      setProviders(providerItems);
      setStatus(transferItems.length ? "" : "No transfer requests yet.");
    } catch (error) {
      setStatus("Transfer requests could not be loaded.");
    }
  }

  async function assignProvider(request: TransferRequest) {
    if (!request.id) {
      setStatus("Request id is missing.");
      return;
    }

    const selectedProviderId = selectedProviders[request.id];
    const provider = providers.find((item) => item.id === selectedProviderId);

    if (!provider?.id) {
      setStatus("Please select a transfer provider first.");
      return;
    }

    setAssigningId(request.id);
    try {
      await assignTransferProvider({
        requestId: request.id,
        providerId: provider.id,
        providerName: provider.name
      });
      await loadData();
      setStatus(`Request ${request.requestCode} assigned to ${provider.name}.`);
    } catch (error) {
      setStatus("Transfer request could not be assigned.");
    } finally {
      setAssigningId("");
    }
  }

  function selectProvider(requestId: string, providerId: string) {
    setSelectedProviders((current) => ({ ...current, [requestId]: providerId }));
  }

  useEffect(() => {
    loadData();
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
        onClick: loadData,
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
        createElement("p", { style: { margin: "0 0 8px" } }, `Provider: ${formatProviderInfo(request)}`),
        createElement("select", {
          style: selectStyle,
          value: request.id ? selectedProviders[request.id] || "" : "",
          onChange: (event) => request.id && selectProvider(request.id, event.currentTarget.value)
        },
          createElement("option", { value: "" }, "Select transfer provider"),
          ...providers.map((provider) => createElement("option", { key: provider.id || provider.name, value: provider.id }, provider.name))
        ),
        createElement("button", {
          type: "button",
          onClick: () => assignProvider(request),
          disabled: assigningId === request.id,
          style: { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#1FB6A6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }
        }, assigningId === request.id ? "Assigning..." : "Assign Provider")
      )
    )
  );
}
