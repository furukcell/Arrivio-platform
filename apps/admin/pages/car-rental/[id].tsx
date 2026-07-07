import { createElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAppUserByUid, getCarRentalRequest, listenToCurrentUser, updateCarRentalStatus } from "@arrivio/firebase";
import type { CarRentalRequest, CarRentalStatus } from "@arrivio/shared";

const pageStyle = { minHeight: "100vh", padding: "32px", fontFamily: "Arial, sans-serif", background: "#F8FAFC", color: "#08183A" };
const cardStyle = { padding: "20px", borderRadius: "18px", background: "#FFFFFF", border: "1px solid #E5E7EB", marginBottom: "14px" };
const inputStyle = { width: "100%", padding: "12px", marginTop: "8px", marginBottom: "10px", border: "1px solid #D1D5DB", borderRadius: "12px" };
const buttonStyle = { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer", marginRight: "8px" };
const statusOptions: CarRentalStatus[] = ["new", "availability_checking", "provider_pending", "confirmed", "vehicle_delivered", "vehicle_returned", "completed", "cancelled"];

function idValue(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export default function CarRentalDetailPage() {
  const router = useRouter();
  const requestId = idValue(router.query.id);
  const [request, setRequest] = useState<CarRentalRequest | null>(null);
  const [status, setStatus] = useState("Checking admin session...");
  const [isAdmin, setIsAdmin] = useState(false);
  const [nextStatus, setNextStatus] = useState<CarRentalStatus>("new");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadDetail(activeId = requestId) {
    if (!isAdmin || !activeId) return;
    setStatus("Loading detail...");
    const item = await getCarRentalRequest(activeId);
    setRequest(item);
    if (item) {
      setNextStatus(item.status);
      setAdminNote(item.adminNote || "");
      setStatus("");
    } else {
      setStatus("Request not found.");
    }
  }

  async function saveOperation() {
    if (!request?.id) return;
    setSaving(true);
    try {
      await updateCarRentalStatus({ requestId: request.id, status: nextStatus, adminNote });
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
        setStatus("Loading detail...");
        const item = await getCarRentalRequest(requestId);
        setRequest(item);
        if (item) {
          setNextStatus(item.status);
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
    createElement("a", { href: "/car-rental", style: { color: "#0B63F6", fontWeight: 700 } }, "Back to car rental requests"),
    createElement("h1", { style: { fontSize: "40px", margin: "16px 0 8px" } }, "Car Rental Detail"),
    status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
    request ? createElement("section", { style: cardStyle },
      createElement("h2", null, `${request.requestCode} - ${request.passengerName}`),
      createElement("p", null, `Phone: ${request.passengerPhone}`),
      createElement("p", null, `Route: ${request.pickupLocation}${request.dropoffLocation ? ` to ${request.dropoffLocation}` : ""}`),
      createElement("p", null, `Dates: ${request.pickupDate} to ${request.dropoffDate}`),
      createElement("p", null, `Car: ${request.carClass || "not set"} / ${request.transmission || "not set"}`),
      createElement("p", null, `QR Source: ${request.qrSourceId || "not set"}`),
      createElement("p", null, `Current Status: ${request.status}`),
      createElement("h3", null, "Operation"),
      createElement("select", { style: inputStyle, value: nextStatus, onChange: (event) => setNextStatus(event.currentTarget.value as CarRentalStatus) },
        ...statusOptions.map((item) => createElement("option", { key: item, value: item }, item))
      ),
      createElement("textarea", { style: { ...inputStyle, minHeight: "96px" }, value: adminNote, onChange: (event) => setAdminNote(event.currentTarget.value), placeholder: "Admin operation note" }),
      createElement("button", { type: "button", onClick: saveOperation, disabled: !isAdmin || saving, style: buttonStyle }, saving ? "Saving..." : "Save Operation")
    ) : null
  );
}
