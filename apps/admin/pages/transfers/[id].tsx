import { createElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAppUserByUid, getTransferRequest, listenToCurrentUser, updateTransferCommission } from "@arrivio/firebase";
import type { CommissionStatus, TransferRequest } from "@arrivio/shared";

const pageStyle = { minHeight: "100vh", padding: "32px", fontFamily: "Arial, sans-serif", background: "#F8FAFC", color: "#08183A" };
const cardStyle = { padding: "20px", borderRadius: "18px", background: "#FFFFFF", border: "1px solid #E5E7EB", marginBottom: "14px" };
const inputStyle = { width: "100%", padding: "12px", marginTop: "8px", marginBottom: "10px", border: "1px solid #D1D5DB", borderRadius: "12px" };
const buttonStyle = { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer", marginRight: "8px" };

function idValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export default function TransferDetailPage() {
  const router = useRouter();
  const requestId = idValue(router.query.id);
  const [request, setRequest] = useState<TransferRequest | null>(null);
  const [status, setStatus] = useState("Checking admin session...");
  const [isAdmin, setIsAdmin] = useState(false);
  const [price, setPrice] = useState("");
  const [commission, setCommission] = useState("");
  const [commissionStatus, setCommissionStatus] = useState<CommissionStatus>("pending");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadDetail(activeId = requestId) {
    if (!isAdmin || !activeId) return;
    const item = await getTransferRequest(activeId);
    setRequest(item);
    if (item) {
      setPrice(typeof item.estimatedTotalPrice === "number" ? String(item.estimatedTotalPrice) : "");
      setCommission(typeof item.commissionAmount === "number" ? String(item.commissionAmount) : "");
      setCommissionStatus(item.commissionStatus || "pending");
      setAdminNote(item.adminNote || "");
      setStatus("");
    } else {
      setStatus("Request not found.");
    }
  }

  async function saveOperation() {
    if (!request?.id) return;
    const totalPrice = Number(price || 0);
    const commissionAmount = Number(commission || 0);
    setSaving(true);
    try {
      await updateTransferCommission({ requestId: request.id, estimatedTotalPrice: totalPrice, commissionAmount, commissionStatus, adminNote });
      await loadDetail(request.id);
      setStatus("Operation saved.");
    } catch (error) {
      setStatus("Operation could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const unsubscribe = listenToCurrentUser(async (authUser) => {
      if (!authUser) {
        setIsAdmin(false);
        setStatus("Please login as admin at /login.");
        return;
      }
      const profile = await getAppUserByUid(authUser.uid);
      const allowed = profile?.role === "admin";
      setIsAdmin(allowed);
      if (!allowed) {
        setStatus("This account is not an admin account.");
        return;
      }
      if (requestId) {
        const item = await getTransferRequest(requestId);
        setRequest(item);
        if (item) {
          setPrice(typeof item.estimatedTotalPrice === "number" ? String(item.estimatedTotalPrice) : "");
          setCommission(typeof item.commissionAmount === "number" ? String(item.commissionAmount) : "");
          setCommissionStatus(item.commissionStatus || "pending");
          setAdminNote(item.adminNote || "");
          setStatus("");
        } else {
          setStatus("Request not found.");
        }
      }
    });
    return () => unsubscribe();
  }, [requestId]);

  return createElement("main", { style: pageStyle },
    createElement("a", { href: "/transfers", style: { color: "#0B63F6", fontWeight: 700 } }, "Back to transfer requests"),
    createElement("h1", { style: { fontSize: "40px", margin: "16px 0 8px" } }, "Transfer Detail"),
    status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
    request ? createElement("section", { style: cardStyle },
      createElement("h2", null, `${request.requestCode} - ${request.passengerName}`),
      createElement("p", null, `Phone: ${request.passengerPhone}`),
      createElement("p", null, `Destination: ${request.destination}`),
      createElement("p", null, `Passengers: ${request.passengers} / Bags: ${request.bags || 0}`),
      createElement("p", null, `Flight: ${request.flightCode || "not set"}`),
      createElement("p", null, `QR Source: ${request.qrSourceId || "not set"}`),
      createElement("p", null, `Provider: ${request.providerName || request.assignedProviderId || "not assigned"}`),
      createElement("p", null, `Status: ${request.status}`),
      createElement("h3", null, "Finance and Note"),
      createElement("input", { style: inputStyle, value: price, onChange: (event) => setPrice(event.currentTarget.value), placeholder: "Total price" }),
      createElement("input", { style: inputStyle, value: commission, onChange: (event) => setCommission(event.currentTarget.value), placeholder: "Commission amount" }),
      createElement("select", { style: inputStyle, value: commissionStatus, onChange: (event) => setCommissionStatus(event.currentTarget.value as CommissionStatus) },
        createElement("option", { value: "pending" }, "pending"),
        createElement("option", { value: "invoiced" }, "invoiced"),
        createElement("option", { value: "paid" }, "paid"),
        createElement("option", { value: "cancelled" }, "cancelled")
      ),
      createElement("textarea", { style: { ...inputStyle, minHeight: "96px" }, value: adminNote, onChange: (event) => setAdminNote(event.currentTarget.value), placeholder: "Admin operation note" }),
      createElement("button", { type: "button", onClick: saveOperation, disabled: !isAdmin || saving, style: buttonStyle }, saving ? "Saving..." : "Save Operation")
    ) : null
  );
}
