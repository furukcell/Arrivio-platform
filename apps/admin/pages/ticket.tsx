import { createElement, useEffect, useState } from "react";
import { getAppUserByUid, listenToCurrentUser, listTicketRequests, logoutCurrentUser } from "@arrivio/firebase";
import type { TicketRequest } from "@arrivio/shared";

const pageStyle = { minHeight: "100vh", padding: "32px", fontFamily: "Arial, sans-serif", background: "#F8FAFC", color: "#08183A" };
const cardStyle = { padding: "20px", borderRadius: "18px", background: "#FFFFFF", border: "1px solid #E5E7EB", marginBottom: "14px" };
const buttonStyle = { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer", marginRight: "8px" };

function title(request: TicketRequest): string {
  return `${request.requestCode} - ${request.passengerName}`;
}

function route(request: TicketRequest): string {
  return `${request.fromAirportOrCity} to ${request.toAirportOrCity}`;
}

function meta(request: TicketRequest): string {
  const returnDate = request.returnDate ? `Return ${request.returnDate}` : "one way or return not set";
  return `${request.passengers} passengers / Departure ${request.departureDate} / ${returnDate}`;
}

export default function AdminTicketPage() {
  const [requests, setRequests] = useState<TicketRequest[]>([]);
  const [status, setStatus] = useState("Checking admin session...");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authEmail, setAuthEmail] = useState("");

  async function loadData() {
    if (!isAdmin) {
      setStatus("Admin login required.");
      return;
    }

    try {
      setStatus("Loading ticket requests...");
      const items = await listTicketRequests(50);
      setRequests(items);
      setStatus(items.length ? "" : "No ticket requests yet.");
    } catch (error) {
      setStatus("Ticket requests could not be loaded.");
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

      setStatus("Admin session ready.");
      const items = await listTicketRequests(50);
      setRequests(items);
      setStatus(items.length ? "" : "No ticket requests yet.");
    });

    return () => unsubscribe();
  }, []);

  return createElement("main", { style: pageStyle },
    createElement("h1", { style: { fontSize: "40px", margin: "0 0 8px" } }, "Ticket Requests"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, "Admin-only ticket lead screen."),
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
      createElement("p", { style: { margin: "0 0 6px" } }, `Flight: ${request.flightCode || "not set"}`),
      createElement("p", { style: { margin: 0 } }, `Status: ${request.status}`)
    ))
  );
}
