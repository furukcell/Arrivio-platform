import { createElement, useEffect, useState } from "react";
import { getAppUserByUid, listenToCurrentUser, logoutCurrentUser } from "@arrivio/firebase";
import type { AppUser, ProviderType } from "@arrivio/shared";
import { buildProviderSessionStatus, resolveProviderId } from "../src/providerSessionModel";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  background: "#F7FBFF",
  color: "#08183A"
};

const cardStyle = {
  padding: "22px",
  borderRadius: "22px",
  background: "#FFFFFF",
  border: "1px solid #DCEBFA",
  boxShadow: "0 16px 42px rgba(7, 27, 88, 0.08)"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginTop: "22px"
};

const linkStyle = {
  display: "inline-block",
  padding: "13px 17px",
  borderRadius: "999px",
  background: "#0B63F6",
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: 800,
  marginTop: "14px"
};

const secondaryLinkStyle = {
  ...linkStyle,
  background: "#1FB6A6"
};

const mutedButtonStyle = {
  padding: "12px 16px",
  border: 0,
  borderRadius: "999px",
  background: "#4B5563",
  color: "#FFFFFF",
  fontWeight: 800,
  cursor: "pointer",
  marginTop: "18px"
};

function providerTypeLabel(type?: ProviderType | string): string {
  if (type === "transfer") return "Transfer provider";
  if (type === "carRental") return "Rent a car provider";
  if (type === "hotel") return "Hotel provider";
  if (type === "agency") return "Agency provider";
  return "Provider";
}

export default function ProviderHomePage() {
  const [authEmail, setAuthEmail] = useState("");
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [providerId, setProviderId] = useState("");
  const [status, setStatus] = useState("Checking provider session...");
  const [isReady, setIsReady] = useState(false);

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
        setAuthEmail("");
        setAppUser(null);
        setProviderId("");
        setStatus("Please login with your provider account.");
        setIsReady(true);
        return;
      }

      setAuthEmail(authUser.email || "");
      const profile = await getAppUserByUid(authUser.uid);
      setAppUser(profile);
      const resolvedProviderId = resolveProviderId(profile);
      setProviderId(resolvedProviderId);
      setStatus(buildProviderSessionStatus(profile));
      setIsReady(true);
    });

    return () => unsubscribe();
  }, []);

  const providerType = appUser?.role === "provider" ? providerTypeLabel((appUser as AppUser & { providerType?: ProviderType }).providerType) : "Provider";
  const canOpenProviderPanel = Boolean(providerId);

  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "42px", margin: "0 0 12px" } }, "Arrivio Provider"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, "Provider dashboard for transfer, rent a car, hotel and agency partners."),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px", fontWeight: 700 } }, `Email: ${authEmail || "not logged in"}`),
    createElement("section", { style: cardStyle },
      createElement("h2", { style: { margin: "0 0 8px" } }, isReady ? status : "Checking session..."),
      createElement("p", { style: { color: "#64748B", margin: "0 0 6px" } }, `Provider ID: ${providerId || "not set"}`),
      createElement("p", { style: { color: "#64748B", margin: 0 } }, `Account type: ${providerType}`),
      !authEmail ? createElement("a", { href: "/login", style: linkStyle }, "Provider Login") : null,
      authEmail ? createElement("button", { type: "button", onClick: logoutProvider, style: mutedButtonStyle }, "Logout") : null
    ),
    createElement("div", { style: gridStyle },
      createElement("article", { style: cardStyle },
        createElement("strong", { style: { fontSize: "22px" } }, "Incoming Jobs"),
        createElement("p", { style: { color: "#64748B", lineHeight: 1.45 } }, "See assigned transfer jobs and update passenger status."),
        createElement("a", { href: canOpenProviderPanel ? "/transfers" : "/login", style: linkStyle }, canOpenProviderPanel ? "Open Transfer Jobs" : "Login First")
      ),
      createElement("article", { style: cardStyle },
        createElement("strong", { style: { fontSize: "22px" } }, "Prices"),
        createElement("p", { style: { color: "#64748B", lineHeight: 1.45 } }, "Manage route, daily rental or nightly hotel prices. This screen will connect to real provider pricing next."),
        createElement("a", { href: canOpenProviderPanel ? "/prices" : "/login", style: secondaryLinkStyle }, canOpenProviderPanel ? "Open Prices" : "Login First")
      ),
      createElement("article", { style: cardStyle },
        createElement("strong", { style: { fontSize: "22px" } }, "Profile"),
        createElement("p", { style: { color: "#64748B", lineHeight: 1.45 } }, "Business documents, contact information, active status and verification details."),
        createElement("a", { href: canOpenProviderPanel ? "/profile" : "/login", style: linkStyle }, canOpenProviderPanel ? "Open Profile" : "Login First")
      )
    )
  );
}
