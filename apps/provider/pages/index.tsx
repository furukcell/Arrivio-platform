import { createElement, useState } from "react";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  background: "#F7FBFF",
  color: "#08183A"
};

const inputStyle = {
  width: "100%",
  maxWidth: "520px",
  padding: "13px",
  marginTop: "8px",
  marginBottom: "14px",
  border: "1px solid #D1D5DB",
  borderRadius: "12px"
};

const linkStyle = {
  display: "inline-block",
  padding: "14px 18px",
  borderRadius: "999px",
  background: "#0B63F6",
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: 700
};

export default function ProviderHomePage() {
  const [providerId, setProviderId] = useState("");
  const transferHref = providerId ? `/transfers?providerId=${encodeURIComponent(providerId)}` : "/transfers";

  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "42px", margin: "0 0 12px" } }, "Arrivio Provider"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, "MVP provider panel. Enter provider document id until Firebase Auth is connected."),
    createElement("label", null, "Provider document id"),
    createElement("input", {
      style: inputStyle,
      value: providerId,
      onChange: (event) => setProviderId(event.currentTarget.value),
      placeholder: "Paste provider Firestore document id"
    }),
    createElement("br"),
    createElement("a", { href: transferHref, style: linkStyle }, "View Assigned Transfers")
  );
}
