import { createElement, useEffect, useState } from "react";
import {
  assignTransferProvider,
  filterTransferProviders,
  getAppUserByUid,
  listenToCurrentUser,
  listProviders,
  listTransferRequests,
  logoutCurrentUser,
  updateTransferCommission
} from "@arrivio/firebase";
import type { CommissionStatus, Provider, TransferRequest } from "@arrivio/shared";
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

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "10px",
  border: "1px solid #D1D5DB",
  borderRadius: "12px"
};

export default function AdminTransferRequestsPage() {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("Checking admin session...");
  const [assigningId, setAssigningId] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [commissionInputs, setCommissionInputs] = useState<Record<string, string>>({});
  const [commissionStatuses, setCommissionStatuses] = useState<Record<string, CommissionStatus>>({});
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [savingCommissionId, setSavingCommissionId] = useState("");

  async function loadData() {
    if (!isAdmin) {
      setStatus("Admin login required.");
      return;
    }

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
    if (!isAdmin) {
      setStatus("Admin login required.");
      return;
    }

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

  async function saveCommission(request: TransferRequest) {
    if (!isAdmin) {
      setStatus("Admin login required.");
      return;
    }

    if (!request.id) {
      setStatus("Request id is missing.");
      return;
    }

    const priceRaw = priceInputs[request.id] ?? (typeof request.estimatedTotalPrice === "number" ? String(request.estimatedTotalPrice) : "");
    const commissionRaw = commissionInputs[request.id] ?? (typeof request.commissionAmount === "number" ? String(request.commissionAmount) : "");
    const totalPrice = Number(priceRaw);
    const commissionAmount = Number(commissionRaw);

    if (!priceRaw || Number.isNaN(totalPrice) || totalPrice < 0) {
      setStatus("Total price must be a valid number.");
      return;
    }

    if (!commissionRaw || Number.isNaN(commissionAmount) || commissionAmount < 0) {
      setStatus("Commission amount must be a valid number.");
      return;
    }

    setSavingCommissionId(request.id);
    try {
      await updateTransferCommission({
        requestId: request.id,
        estimatedTotalPrice: totalPrice,
        commissionAmount,
        commissionStatus: commissionStatuses[request.id] || request.commissionStatus || "pending",
        adminNote: adminNotes[request.id] ?? request.adminNote ?? ""
      });
      await loadData();
      setStatus(`Commission saved for ${request.requestCode}.`);
    } catch (error) {
      setStatus("Commission could not be saved.");
    } finally {
      setSavingCommissionId("");
    }
  }

  function selectProvider(requestId: string, providerId: string) {
    setSelectedProviders((current) => ({ ...current, [requestId]: providerId }));
  }

  function setPrice(requestId: string, value: string) {
    setPriceInputs((current) => ({ ...current, [requestId]: value }));
  }

  function setCommission(requestId: string, value: string) {
    setCommissionInputs((current) => ({ ...current, [requestId]: value }));
  }

  function setCommissionStatusValue(requestId: string, value: CommissionStatus) {
    setCommissionStatuses((current) => ({ ...current, [requestId]: value }));
  }

  function setAdminNote(requestId: string, value: string) {
    setAdminNotes((current) => ({ ...current, [requestId]: value }));
  }

  async function logoutAdmin() {
    await logoutCurrentUser();
    setIsAdmin(false);
    setAuthEmail("");
    setRequests([]);
    setProviders([]);
    setStatus("Logged out.");
  }

  useEffect(() => {
    const unsubscribe = listenToCurrentUser(async (authUser) => {
      if (!authUser) {
        setIsAdmin(false);
        setStatus("Please login as admin at /login.");
        return;
      }

      setAuthEmail(authUser.email || "");
      const profile = await getAppUserByUid(authUser.uid);
      const allowed = profile?.role === "admin";
      setIsAdmin(allowed);
      if (!allowed) {
        setStatus("This account is not an admin account.");
        return;
      }

      setStatus("Admin session ready.");
      const transferItems = await listTransferRequests(50);
      const providerItems = filterTransferProviders(await listProviders());
      setRequests(transferItems);
      setProviders(providerItems);
      setStatus(transferItems.length ? "" : "No transfer requests yet.");
    });

    return () => unsubscribe();
  }, []);

  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "40px", margin: "0 0 8px" } }, "Transfer Requests"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, "Admin-only transfer operation screen."),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, `Admin: ${authEmail || "not logged in"}`),
    createElement(
      "button",
      {
        type: "button",
        onClick: loadData,
        disabled: !isAdmin,
        style: {
          padding: "12px 16px",
          border: 0,
          borderRadius: "999px",
          background: "#0B63F6",
          color: "#FFFFFF",
          fontWeight: 700,
          marginBottom: "24px",
          marginRight: "8px",
          cursor: "pointer"
        }
      },
      "Refresh"
    ),
    createElement("button", { type: "button", onClick: logoutAdmin, style: { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#4B5563", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" } }, "Logout"),
    status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
    !isAdmin ? createElement("p", null, "Open /login to sign in as admin.") : null,
    ...requests.map((request) =>
      createElement(
        "article",
        { key: request.id || request.requestCode, style: cardStyle },
        createElement("h2", { style: { margin: "0 0 8px", fontSize: "22px" } }, formatTransferTitle(request)),
        createElement("p", { style: { margin: "0 0 6px", color: "#0B63F6", fontWeight: 700 } }, formatTransferRoute(request)),
        createElement("p", { style: { margin: "0 0 6px", color: "#4B5563" } }, formatTransferMeta(request)),
        createElement("p", { style: { margin: "0 0 6px" } }, `Phone: ${request.passengerPhone}`),
        createElement("p", { style: { margin: "0 0 6px" } }, `Status: ${request.status}`),
        createElement("p", { style: { margin: "0 0 6px" } }, `Price: ${request.estimatedTotalPrice ?? "not set"} ${request.currency}`),
        createElement("p", { style: { margin: "0 0 6px" } }, `Commission: ${request.commissionAmount ?? "not set"} ${request.currency} / ${request.commissionStatus}`),
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
          disabled: assigningId === request.id || !isAdmin,
          style: { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#1FB6A6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer", marginBottom: "14px" }
        }, assigningId === request.id ? "Assigning..." : "Assign Provider"),
        request.id ? createElement("section", { style: { marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #E5E7EB" } },
          createElement("h3", { style: { margin: "0 0 8px" } }, "Commission Tracking"),
          createElement("input", {
            style: inputStyle,
            value: priceInputs[request.id] ?? (typeof request.estimatedTotalPrice === "number" ? String(request.estimatedTotalPrice) : ""),
            onChange: (event) => setPrice(request.id || "", event.currentTarget.value),
            placeholder: "Total price"
          }),
          createElement("input", {
            style: inputStyle,
            value: commissionInputs[request.id] ?? (typeof request.commissionAmount === "number" ? String(request.commissionAmount) : ""),
            onChange: (event) => setCommission(request.id || "", event.currentTarget.value),
            placeholder: "Commission amount"
          }),
          createElement("select", {
            style: selectStyle,
            value: commissionStatuses[request.id] || request.commissionStatus || "pending",
            onChange: (event) => setCommissionStatusValue(request.id || "", event.currentTarget.value as CommissionStatus)
          },
            createElement("option", { value: "pending" }, "Pending"),
            createElement("option", { value: "invoiced" }, "Invoiced"),
            createElement("option", { value: "paid" }, "Paid"),
            createElement("option", { value: "cancelled" }, "Cancelled")
          ),
          createElement("input", {
            style: inputStyle,
            value: adminNotes[request.id] ?? request.adminNote ?? "",
            onChange: (event) => setAdminNote(request.id || "", event.currentTarget.value),
            placeholder: "Admin note"
          }),
          createElement("button", {
            type: "button",
            onClick: () => saveCommission(request),
            disabled: savingCommissionId === request.id || !isAdmin,
            style: { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }
          }, savingCommissionId === request.id ? "Saving..." : "Save Commission")
        ) : null
      )
    )
  );
}
