import { createElement, useEffect, useState } from "react";
import { getAppUserByUid, listenToCurrentUser, logoutCurrentUser } from "@arrivio/firebase";
import type { AppUser } from "@arrivio/shared";
import { buildProviderSessionStatus, resolveProviderId } from "../src/providerSessionModel";

const pageStyle = { minHeight: "100vh", padding: "32px", fontFamily: "Arial, sans-serif", background: "#F7FBFF", color: "#08183A" };
const cardStyle = { padding: "22px", borderRadius: "22px", background: "#FFFFFF", border: "1px solid #DCEBFA", marginBottom: "14px" };
const linkStyle = { display: "inline-block", padding: "12px 16px", borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", textDecoration: "none", fontWeight: 800, marginRight: "8px" };
const mutedButtonStyle = { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#4B5563", color: "#FFFFFF", fontWeight: 800, cursor: "pointer" };

export default function ProviderPricesPage() {
  const [authEmail, setAuthEmail] = useState("");
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [providerId, setProviderId] = useState("");
  const [status, setStatus] = useState("Checking provider session...");

  async function logoutProvider() {
    await logoutCurrentUser();
    setAuthEmail("");
    setAppUser(null);
    setProviderId("");
    setStatus("Logged out.");
  }

  useEffect(() => {
    const unsubscribe = listenToCurrentUser(async (authUser) => {
      if (!authUser) {
        setStatus("Please login as provider at /login.");
        return;
      }
      setAuthEmail(authUser.email || "");
      const profile = await getAppUserByUid(authUser.uid);
      setAppUser(profile);
      setProviderId(resolveProviderId(profile));
      setStatus(buildProviderSessionStatus(profile));
    });
    return () => unsubscribe();
  }, []);

  return createElement("main", { style: pageStyle },
    createElement("a", { href: "/", style: { color: "#0B63F6", fontWeight: 800 } }, "← Provider Dashboard"),
    createElement("h1", { style: { fontSize: "40px", margin: "18px 0 8px" } }, "Provider Prices"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "22px" } }, `Email: ${authEmail || "not logged in"} / Provider ID: ${providerId || "not set"}`),
    createElement("section", { style: cardStyle },
      createElement("h2", { style: { margin: "0 0 8px" } }, status),
      createElement("p", { style: { color: "#64748B", lineHeight: 1.5 } }, "Next step: connect real provider pricing here. Transfer providers will enter route prices; rent a car providers will enter daily car prices; hotel providers will enter nightly availability price ranges."),
      providerId ? createElement("a", { href: "/transfers", style: linkStyle }, "Open Jobs") : createElement("a", { href: "/login", style: linkStyle }, "Login"),
      authEmail ? createElement("button", { type: "button", onClick: logoutProvider, style: mutedButtonStyle }, "Logout") : null
    )
  );
}
