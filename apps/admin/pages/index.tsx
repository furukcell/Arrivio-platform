import { createElement } from "react";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  background: "#F8FAFC",
  color: "#08183A"
};

const linkStyle = {
  display: "inline-block",
  padding: "14px 18px",
  borderRadius: "999px",
  background: "#0B63F6",
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: 700,
  marginRight: "12px",
  marginBottom: "12px"
};

export default function AdminHomePage() {
  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "42px", margin: "0 0 12px" } }, "Arrivio Admin"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, "Operational dashboard for transfer, car rental, provider, commission and QR workflows."),
    createElement("a", { href: "/transfers", style: linkStyle }, "View Transfer Requests"),
    createElement("a", { href: "/car-rental", style: linkStyle }, "View Car Rental Requests"),
    createElement("a", { href: "/providers", style: linkStyle }, "Manage Providers"),
    createElement("a", { href: "/qr", style: linkStyle }, "QR Tracking")
  );
}
