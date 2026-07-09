import { createElement, useEffect, useState } from "react";
import {
  getAppUserByUid,
  listenToCurrentUser,
  listTransferRequestsForProvider,
  logoutCurrentUser,
  updateTransferProviderResponse,
  updateTransferStatus
} from "@arrivio/firebase";
import type { AppUser, TransferRequest, TransferStatus } from "@arrivio/shared";
import {
  buildPassengerWhatsappUrl,
  formatContactLine,
  formatPassengerSummary,
  formatTransferPriceRange,
  formatTransferTitle,
  isActiveTransfer,
  isCompletedTransfer,
  isProviderActionable
} from "../src/providerTransferModel";
import { buildProviderSessionStatus, resolveProviderId } from "../src/providerSessionModel";

const pageStyle = {
  minHeight: "100vh",
  padding: "24px",
  fontFamily: "Arial, sans-serif",
  background: "#F7FBFF",
  color: "#08183A"
};

const cardStyle = {
  padding: "20px",
  borderRadius: "18px",
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  marginBottom: "14px"
};

const primaryButton = {
  padding: "11px 14px",
  border: 0,
  borderRadius: "999px",
  background: "#0B63F6",
  color: "#FFFFFF",
  fontWeight: 700,
  cursor: "pointer",
  marginRight: "8px",
  marginBottom: "8px",
  textDecoration: "none"
};

const secondaryButton = {
  ...primaryButton,
  background: "#1FB6A6"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "10px",
  border: "1px solid #D1D5DB",
  borderRadius: "12px"
};

export default function ProviderTransfersPage() {
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [providerId, setProviderId] = useState("");
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [status, setStatus] = useState("Checking provider session...");
  const [updatingId, setUpdatingId] = useState("");
  const [savingResponseId, setSavingResponseId] = useState("");
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({});
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [isSessionReady, setIsSessionReady] = useState(false);

  const activeRequests = requests.filter(isActiveTransfer);
  const completedRequests = requests.filter(isCompletedTransfer);

  async function loadTransfers(activeProviderId = providerId) {
    if (!activeProviderId) {
      setStatus("Provider login required. Open /login and sign in as provider.");
      return;
    }

    try {
      setStatus("Loading assigned transfers...");
      const items = await listTransferRequestsForProvider(activeProviderId, 50);
      setRequests(items);
      setStatus(items.length ? "" : "No assigned transfer requests yet.");
    } catch (error) {
      setStatus("Assigned transfers could not be loaded.");
    }
  }

  async function setTransferStatus(request: TransferRequest, nextStatus: TransferStatus) {
    if (!providerId) {
      setStatus("Provider login required.");
      return;
    }

    if (!request.id) {
      setStatus("Request id is missing.");
      return;
    }

    setUpdatingId(request.id);
    try {
      await updateTransferStatus({ requestId: request.id, status: nextStatus });
      await loadTransfers();
      setStatus(`Request ${request.requestCode} updated to ${nextStatus}.`);
    } catch (error) {
      setStatus("Transfer status could not be updated.");
    } finally {
      setUpdatingId("");
    }
  }

  async function saveProviderResponse(request: TransferRequest) {
    if (!providerId) {
      setStatus("Provider login required.");
      return;
    }

    if (!request.id) {
      setStatus("Request id is missing.");
      return;
    }

    const rawPrice = priceInputs[request.id] ?? (typeof request.estimatedTotalPrice === "number" ? String(request.estimatedTotalPrice) : "0");
    const priceValue = Number(rawPrice || 0);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setStatus("Price must be a valid number.");
      return;
    }

    setSavingResponseId(request.id);
    try {
      await updateTransferProviderResponse({
        requestId: request.id,
        status: request.status,
        estimatedTotalPrice: priceValue,
        providerNote: noteInputs[request.id] ?? request.providerNote ?? ""
      });
      await loadTransfers();
      setStatus(`Provider response saved for ${request.requestCode}.`);
    } catch (error) {
      setStatus("Provider response could not be saved.");
    } finally {
      setSavingResponseId("");
    }
  }

  function setPrice(requestId: string, value: string) {
    setPriceInputs((current) => ({ ...current, [requestId]: value }));
  }

  function setNote(requestId: string, value: string) {
    setNoteInputs((current) => ({ ...current, [requestId]: value }));
  }

  async function logoutProvider() {
    await logoutCurrentUser();
    setAppUser(null);
    setAuthEmail("");
    setProviderId("");
    setRequests([]);
    setStatus("Logged out.");
  }

  function renderTransferCard(request: TransferRequest) {
    const requestId = request.id || request.requestCode;
    return createElement("article", { key: requestId, style: cardStyle },
      createElement("h2", { style: { margin: "0 0 8px", fontSize: "22px" } }, formatTransferTitle(request)),
      createElement("p", { style: { margin: "0 0 6px", color: "#0B63F6", fontWeight: 700 } }, formatPassengerSummary(request)),
      createElement("p", { style: { margin: "0 0 6px" } }, formatContactLine(request)),
      createElement("p", { style: { margin: "0 0 6px" } }, `Status: ${request.status}`),
      createElement("p", { style: { margin: "0 0 6px" } }, `Passenger saw: ${formatTransferPriceRange(request)}`),
      createElement("p", { style: { margin: "0 0 6px" } }, `Commission: ${request.commissionAmount ?? "not set"} ${request.currency} / ${request.commissionStatus}`),
      request.adminNote ? createElement("p", { style: { margin: "0 0 6px" } }, `Admin note: ${request.adminNote}`) : null,
      request.providerNote ? createElement("p", { style: { margin: "0 0 6px" } }, `Your note: ${request.providerNote}`) : null,
      createElement("p", { style: { margin: "0 0 12px" } }, `Provider: ${request.providerName || request.assignedProviderId || "Assigned"}`),
      createElement("a", { href: buildPassengerWhatsappUrl(request), style: secondaryButton }, "WhatsApp Passenger"),
      request.id ? createElement("section", { style: { marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #E5E7EB" } },
        createElement("h3", { style: { margin: "0 0 8px" } }, "Final Price / Note"),
        createElement("input", { style: inputStyle, value: priceInputs[request.id] ?? (typeof request.estimatedTotalPrice === "number" ? String(request.estimatedTotalPrice) : ""), onChange: (event) => setPrice(request.id || "", event.currentTarget.value), placeholder: "Final price offer" }),
        createElement("textarea", { style: { ...inputStyle, minHeight: "86px" }, value: noteInputs[request.id] ?? request.providerNote ?? "", onChange: (event) => setNote(request.id || "", event.currentTarget.value), placeholder: "Provider note" }),
        createElement("button", { type: "button", onClick: () => saveProviderResponse(request), disabled: savingResponseId === request.id || !providerId, style: primaryButton }, savingResponseId === request.id ? "Saving..." : "Save Price / Note")
      ) : null,
      isProviderActionable(request) ? createElement("div", { style: { marginTop: "10px" } },
        createElement("button", { type: "button", onClick: () => setTransferStatus(request, "confirmed"), disabled: updatingId === request.id || !providerId, style: secondaryButton }, "Accept / Confirm"),
        createElement("button", { type: "button", onClick: () => setTransferStatus(request, "passenger_waiting"), disabled: updatingId === request.id || !providerId, style: primaryButton }, "Passenger Waiting"),
        createElement("button", { type: "button", onClick: () => setTransferStatus(request, "passenger_picked_up"), disabled: updatingId === request.id || !providerId, style: primaryButton }, "Picked Up"),
        createElement("button", { type: "button", onClick: () => setTransferStatus(request, "completed"), disabled: updatingId === request.id || !providerId, style: secondaryButton }, "Completed"),
        createElement("button", { type: "button", onClick: () => setTransferStatus(request, "cancelled"), disabled: updatingId === request.id || !providerId, style: { ...primaryButton, background: "#EF4444" } }, "Cancel")
      ) : null
    );
  }

  useEffect(() => {
    const unsubscribe = listenToCurrentUser(async (authUser) => {
      if (!authUser) {
        setIsSessionReady(true);
        setProviderId("");
        setRequests([]);
        setStatus("Please login as provider at /login.");
        return;
      }

      setAuthEmail(authUser.email || "");
      const profile = await getAppUserByUid(authUser.uid);
      setAppUser(profile);
      const resolvedProviderId = resolveProviderId(profile);
      setProviderId(resolvedProviderId);
      setIsSessionReady(true);
      setStatus(buildProviderSessionStatus(profile));
      if (resolvedProviderId) await loadTransfers(resolvedProviderId);
    });

    return () => unsubscribe();
  }, []);

  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "40px", margin: "0 0 8px" } }, "Provider Transfers"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, "ProviderId is resolved only from Firebase Auth profile."),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, `Email: ${authEmail || "not logged in"}`),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, `Provider ID: ${providerId || "not set"}`),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, `Active: ${activeRequests.length} / Completed: ${completedRequests.length}`),
    createElement("button", { type: "button", onClick: () => loadTransfers(), disabled: !isSessionReady || !providerId, style: primaryButton }, "Refresh"),
    createElement("button", { type: "button", onClick: logoutProvider, style: { ...primaryButton, background: "#4B5563" } }, "Logout"),
    status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
    !authEmail ? createElement("p", null, "Open /login to sign in as provider.") : null,
    createElement("h2", null, "Active Jobs"),
    ...activeRequests.map(renderTransferCard),
    createElement("h2", null, "Completed Jobs"),
    ...completedRequests.map(renderTransferCard)
  );
}
