import { createElement, useEffect, useState } from "react";
import {
  createQrSource,
  getAppUserByUid,
  listenToCurrentUser,
  listQrSources,
  listRecentQrEvents,
  logoutCurrentUser
} from "@arrivio/firebase";
import type { QrSource, QrSourceType } from "@arrivio/shared";
import type { QrEvent } from "@arrivio/firebase";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  background: "#F8FAFC",
  color: "#08183A"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  marginBottom: "12px",
  border: "1px solid #D1D5DB",
  borderRadius: "12px"
};

const cardStyle = {
  padding: "18px",
  borderRadius: "18px",
  background: "#FFFFFF",
  border: "1px solid #E5E7EB",
  marginBottom: "12px"
};

type QrFormState = {
  slug: string;
  title: string;
  type: QrSourceType;
  airportCode: string;
  locationLabel: string;
};

const initialForm: QrFormState = {
  slug: "bjv-domestic-arrivals",
  title: "BJV Domestic Arrivals",
  type: "airport_domestic",
  airportCode: "BJV",
  locationLabel: "Domestic arrivals area"
};

export default function AdminQrPage() {
  const [form, setForm] = useState<QrFormState>(initialForm);
  const [sources, setSources] = useState<QrSource[]>([]);
  const [events, setEvents] = useState<QrEvent[]>([]);
  const [status, setStatus] = useState("Checking admin session...");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function loadQrData() {
    if (!isAdmin) {
      setStatus("Admin login required.");
      return;
    }

    try {
      setStatus("Loading QR data...");
      const sourceItems = await listQrSources();
      const eventItems = await listRecentQrEvents(50);
      setSources(sourceItems);
      setEvents(eventItems);
      setStatus("");
    } catch (error) {
      setStatus("QR data could not be loaded.");
    }
  }

  async function saveQrSource() {
    if (!isAdmin) {
      setStatus("Admin login required.");
      return;
    }

    if (!form.slug.trim() || !form.title.trim()) {
      setStatus("Slug and title are required.");
      return;
    }

    setIsSaving(true);
    try {
      await createQrSource({
        slug: form.slug.trim(),
        title: form.title.trim(),
        type: form.type,
        airportCode: form.airportCode.trim() || undefined,
        locationLabel: form.locationLabel.trim() || undefined
      });
      await loadQrData();
      setStatus("QR source created.");
    } catch (error) {
      setStatus("QR source could not be created.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateField<K extends keyof QrFormState>(key: K, value: QrFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function logoutAdmin() {
    await logoutCurrentUser();
    setIsAdmin(false);
    setAuthEmail("");
    setSources([]);
    setEvents([]);
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
      const sourceItems = await listQrSources();
      const eventItems = await listRecentQrEvents(50);
      setSources(sourceItems);
      setEvents(eventItems);
      setStatus("");
    });

    return () => unsubscribe();
  }, []);

  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "40px", margin: "0 0 8px" } }, "QR Tracking"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, "Create QR sources and review recent QR scans."),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, `Admin: ${authEmail || "not logged in"}`),
    createElement("button", { type: "button", onClick: loadQrData, disabled: !isAdmin, style: { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer", marginRight: "8px" } }, "Refresh"),
    createElement("button", { type: "button", onClick: logoutAdmin, style: { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#4B5563", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" } }, "Logout"),
    status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
    createElement("section", { style: { ...cardStyle, marginTop: "18px", maxWidth: "720px", opacity: isAdmin ? 1 : 0.55 } },
      createElement("h2", { style: { marginTop: 0 } }, "Create QR Source"),
      createElement("label", null, "Slug"),
      createElement("input", { style: inputStyle, disabled: !isAdmin, value: form.slug, onChange: (event) => updateField("slug", event.currentTarget.value), placeholder: "bjv-domestic-arrivals" }),
      createElement("label", null, "Title"),
      createElement("input", { style: inputStyle, disabled: !isAdmin, value: form.title, onChange: (event) => updateField("title", event.currentTarget.value), placeholder: "BJV Domestic Arrivals" }),
      createElement("label", null, "Type"),
      createElement("select", { style: inputStyle, disabled: !isAdmin, value: form.type, onChange: (event) => updateField("type", event.currentTarget.value as QrSourceType) },
        createElement("option", { value: "airport_domestic" }, "Airport Domestic"),
        createElement("option", { value: "airport_international" }, "Airport International"),
        createElement("option", { value: "airport_parking" }, "Airport Parking"),
        createElement("option", { value: "hotel_desk" }, "Hotel Desk"),
        createElement("option", { value: "ad_campaign" }, "Ad Campaign"),
        createElement("option", { value: "manual" }, "Manual")
      ),
      createElement("label", null, "Airport Code"),
      createElement("input", { style: inputStyle, disabled: !isAdmin, value: form.airportCode, onChange: (event) => updateField("airportCode", event.currentTarget.value), placeholder: "BJV" }),
      createElement("label", null, "Location Label"),
      createElement("input", { style: inputStyle, disabled: !isAdmin, value: form.locationLabel, onChange: (event) => updateField("locationLabel", event.currentTarget.value), placeholder: "Domestic arrivals area" }),
      createElement("button", { type: "button", onClick: saveQrSource, disabled: !isAdmin || isSaving, style: { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#1FB6A6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" } }, isSaving ? "Saving..." : "Create QR Source")
    ),
    createElement("h2", null, "QR Sources"),
    ...sources.map((source) =>
      createElement("article", { key: source.id || source.slug, style: cardStyle },
        createElement("h3", { style: { margin: "0 0 6px" } }, source.title),
        createElement("p", { style: { margin: "0 0 6px", color: "#0B63F6", fontWeight: 700 } }, `/qr/${source.slug}`),
        createElement("p", { style: { margin: "0 0 6px" } }, `Type: ${source.type}`),
        createElement("p", { style: { margin: 0 } }, `Location: ${source.locationLabel || "not set"}`)
      )
    ),
    createElement("h2", null, "Recent QR Events"),
    ...events.map((event) =>
      createElement("article", { key: event.id || `${event.qrSourceId}-${event.path}`, style: cardStyle },
        createElement("p", { style: { margin: "0 0 6px", fontWeight: 700 } }, event.slug),
        createElement("p", { style: { margin: "0 0 6px" } }, `Source ID: ${event.qrSourceId}`),
        createElement("p", { style: { margin: 0 } }, `Path: ${event.path}`)
      )
    )
  );
}
