import { createElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getAppUserByUid,
  listenToCurrentUser,
  listTransferRequestsForProvider,
  logoutCurrentUser,
  updateTransferStatus
} from "@arrivio/firebase";
import type { AppUser, TransferRequest, TransferStatus } from "@arrivio/shared";
import {
  formatContactLine,
  formatPassengerSummary,
  formatTransferTitle,
  getProviderIdFromQuery,
  isProviderActionable
} from "../src/providerTransferModel";
import { buildProviderSessionStatus, resolveProviderId } from "../src/providerSessionModel";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
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
  marginBottom: "8px"
};

const secondaryButton = {
  ...primaryButton,
  background: "#1FB6A6"
};

export default function ProviderTransfersPage() {
  const router = useRouter();
  const fallbackProviderId = getProviderIdFromQuery(router.query.providerId);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [providerId, setProviderId] = useState("");
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [status, setStatus] = useState("Checking provider session...");
  const [updatingId, setUpdatingId] = useState("");
  const [isSessionReady, setIsSessionReady] = useState(false);

  async function loadTransfers(activeProviderId = providerId) {
    if (!activeProviderId) {
      setStatus("Provider id is missing. Login or use temporary providerId query for local MVP test.");
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

  async function logoutProvider() {
    await logoutCurrentUser();
    setAppUser(null);
    setAuthEmail("");
    setProviderId("");
    setRequests([]);
    setStatus("Logged out.");
  }

  useEffect(() => {
    const unsubscribe = listenToCurrentUser(async (authUser) => {
      if (!authUser) {
        setIsSessionReady(true);
        setProviderId(fallbackProviderId);
        setStatus(fallbackProviderId ? "Using temporary providerId query fallback." : "Please login as provider.");
        if (fallbackProviderId) await loadTransfers(fallbackProviderId);
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
  }, [fallbackProviderId]);

  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "40px", margin: "0 0 8px" } }, "Provider Transfers"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, "ProviderId is now resolved from Firebase Auth profile. Query providerId is only a temporary MVP fallback."),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, `Email: ${authEmail || "not logged in"}`),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, `Provider ID: ${providerId || "not set"}`),
    createElement("button", { type: "button", onClick: () => loadTransfers(), disabled: !isSessionReady, style: primaryButton }, "Refresh"),
    createElement("button", { type: "button", onClick: logoutProvider, style: { ...primaryButton, background: "#4B5563" } }, "Logout"),
    status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
    !authEmail ? createElement("p", null, "Open /login to sign in as provider.") : null,
    ...requests.map((request) =>
      createElement("article", { key: request.id || request.requestCode, style: cardStyle },
        createElement("h2", { style: { margin: "0 0 8px", fontSize: "22px" } }, formatTransferTitle(request)),
        createElement("p", { style: { margin: "0 0 6px", color: "#0B63F6", fontWeight: 700 } }, formatPassengerSummary(request)),
        createElement("p", { style: { margin: "0 0 6px" } }, formatContactLine(request)),
        createElement("p", { style: { margin: "0 0 6px" } }, `Status: ${request.status}`),
        createElement("p", { style: { margin: "0 0 12px" } }, `Provider: ${request.providerName || request.assignedProviderId || "Assigned"}`),
        isProviderActionable(request) ? createElement("div", null,
          createElement("button", { type: "button", onClick: () => setTransferStatus(request, "confirmed"), disabled: updatingId === request.id, style: secondaryButton }, "Accept / Confirm"),
          createElement("button", { type: "button", onClick: () => setTransferStatus(request, "passenger_waiting"), disabled: updatingId === request.id, style: primaryButton }, "Passenger Waiting"),
          createElement("button", { type: "button", onClick: () => setTransferStatus(request, "passenger_picked_up"), disabled: updatingId === request.id, style: primaryButton }, "Picked Up"),
          createElement("button", { type: "button", onClick: () => setTransferStatus(request, "completed"), disabled: updatingId === request.id, style: secondaryButton }, "Completed"),
          createElement("button", { type: "button", onClick: () => setTransferStatus(request, "cancelled"), disabled: updatingId === request.id, style: { ...primaryButton, background: "#EF4444" } }, "Cancel")
        ) : null
      )
    )
  );
}
