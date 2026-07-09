import { createElement, useEffect, useState } from "react";
import { getAppUserByUid, listenToCurrentUser, listCarRentalRequests, logoutCurrentUser, updateCarRentalStatus } from "@arrivio/firebase";
import type { CarRentalRequest, CarRentalStatus } from "@arrivio/shared";

const pageStyle = { minHeight: "100vh", padding: "32px", fontFamily: "Arial, sans-serif", background: "#F8FAFC", color: "#08183A" };
const cardStyle = { padding: "20px", borderRadius: "18px", background: "#FFFFFF", border: "1px solid #E5E7EB", marginBottom: "14px" };
const buttonStyle = { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer", marginRight: "8px" };
const selectStyle = { width: "100%", padding: "12px", marginTop: "10px", marginBottom: "10px", border: "1px solid #D1D5DB", borderRadius: "12px" };
const statusOptions: CarRentalStatus[] = ["new", "availability_checking", "provider_pending", "confirmed", "vehicle_delivered", "vehicle_returned", "completed", "cancelled"];

function title(request: CarRentalRequest): string {
  return `${request.requestCode} - ${request.passengerName}`;
}

function route(request: CarRentalRequest): string {
  return `${request.pickupLocation}${request.dropoffLocation ? ` to ${request.dropoffLocation}` : ""}`;
}

function meta(request: CarRentalRequest): string {
  const flight = request.flightCode ? `Flight ${request.flightCode}` : "No flight code";
  const carClass = request.carClass || "class not set";
  const transmission = request.transmission || "transmission not set";
  const pickupTime = request.pickupTime ? `Pickup ${request.pickupTime}` : "pickup time not set";
  const dropoffTime = request.dropoffTime ? `Dropoff ${request.dropoffTime}` : "dropoff time not set";
  const passengers = request.passengers ? `${request.passengers} passengers` : "passengers not set";
  return `${flight} / ${carClass} / ${transmission} / ${passengers} / ${pickupTime} / ${dropoffTime}`;
}

function priceRange(request: CarRentalRequest): string {
  if (typeof request.estimatedDailyPriceMin === "number" && typeof request.estimatedDailyPriceMax === "number") {
    const range = request.estimatedDailyPriceMin === request.estimatedDailyPriceMax ? `${request.estimatedDailyPriceMin}` : `${request.estimatedDailyPriceMin} - ${request.estimatedDailyPriceMax}`;
    return `${range} ${request.currency} / day`;
  }
  if (typeof request.estimatedTotalPrice === "number") return `${request.estimatedTotalPrice} ${request.currency}`;
  return `not set ${request.currency}`;
}

function matchedVehicles(request: CarRentalRequest): string {
  if (typeof request.matchedVehicleCount === "number") return `${request.matchedVehicleCount} matched vehicles`;
  return "matched vehicles not set";
}

export default function AdminCarRentalPage() {
  const [requests, setRequests] = useState<CarRentalRequest[]>([]);
  const [status, setStatus] = useState("Checking admin session...");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [nextStatuses, setNextStatuses] = useState<Record<string, CarRentalStatus>>({});
  const [savingId, setSavingId] = useState("");

  async function loadData() {
    if (!isAdmin) {
      setStatus("Admin login required.");
      return;
    }
    try {
      setStatus("Loading car rental requests...");
      const items = await listCarRentalRequests(50);
      setRequests(items);
      setStatus(items.length ? "" : "No car rental requests yet.");
    } catch (error) {
      setStatus("Car rental requests could not be loaded.");
    }
  }

  async function saveRequestStatus(request: CarRentalRequest) {
    if (!isAdmin || !request.id) return;
    setSavingId(request.id);
    try {
      await updateCarRentalStatus({ requestId: request.id, status: nextStatuses[request.id] || request.status });
      await loadData();
      setStatus(`Status saved for ${request.requestCode}.`);
    } catch (error) {
      setStatus("Car rental status could not be saved.");
    } finally {
      setSavingId("");
    }
  }

  async function logoutAdmin() {
    await logoutCurrentUser();
    setIsAdmin(false);
    setAuthEmail("");
    setRequests([]);
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
      const items = await listCarRentalRequests(50);
      setRequests(items);
      setStatus(items.length ? "" : "No car rental requests yet.");
    });
    return () => unsubscribe();
  }, []);

  return createElement("main", { style: pageStyle },
    createElement("h1", { style: { fontSize: "40px", margin: "0 0 8px" } }, "Car Rental Requests"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, "Admin-only car rental lead screen."),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, `Admin: ${authEmail || "not logged in"}`),
    createElement("button", { type: "button", onClick: loadData, disabled: !isAdmin, style: buttonStyle }, "Refresh"),
    createElement("button", { type: "button", onClick: logoutAdmin, style: { ...buttonStyle, background: "#4B5563" } }, "Logout"),
    status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
    !isAdmin ? createElement("p", null, "Open /login to sign in as admin.") : null,
    ...requests.map((request) => createElement("article", { key: request.id || request.requestCode, style: cardStyle },
      createElement("h2", { style: { margin: "0 0 8px", fontSize: "22px" } }, title(request)),
      createElement("p", { style: { margin: "0 0 6px", color: "#0B63F6", fontWeight: 700 } }, route(request)),
      createElement("p", { style: { margin: "0 0 6px", color: "#4B5563" } }, meta(request)),
      createElement("p", { style: { margin: "0 0 6px" } }, `Phone: ${request.passengerPhone}`),
      createElement("p", { style: { margin: "0 0 6px" } }, `Pickup: ${request.pickupDate}`),
      createElement("p", { style: { margin: "0 0 6px" } }, `Dropoff: ${request.dropoffDate}`),
      createElement("p", { style: { margin: "0 0 6px" } }, `Price range: ${priceRange(request)} / ${matchedVehicles(request)} / ${request.estimatedRentalDays || 1} days`),
      createElement("p", { style: { margin: "0 0 6px" } }, `Status: ${request.status}`),
      request.id ? createElement("div", null,
        createElement("select", { style: selectStyle, value: nextStatuses[request.id] || request.status, onChange: (event) => setNextStatuses((current) => ({ ...current, [request.id || ""]: event.currentTarget.value as CarRentalStatus })) },
          ...statusOptions.map((item) => createElement("option", { key: item, value: item }, item))
        ),
        createElement("button", { type: "button", onClick: () => saveRequestStatus(request), disabled: !isAdmin || savingId === request.id, style: buttonStyle }, savingId === request.id ? "Saving..." : "Save Status")
      ) : null
    ))
  );
}
