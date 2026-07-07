import { createElement, useEffect, useState } from "react";
import { createProvider, listProviders } from "@arrivio/firebase";
import type { Provider, ProviderType } from "@arrivio/shared";
import {
  formatProviderCard,
  initialProviderFormState,
  validateProviderForm,
  type ProviderFormState
} from "../src/providerAdminModel";

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

export default function AdminProvidersPage() {
  const [form, setForm] = useState<ProviderFormState>(initialProviderFormState);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [status, setStatus] = useState("Loading providers...");
  const [isSaving, setIsSaving] = useState(false);

  async function loadProviders() {
    try {
      setStatus("Loading providers...");
      const items = await listProviders();
      setProviders(items);
      setStatus(items.length ? "" : "No providers yet.");
    } catch (error) {
      setStatus("Providers could not be loaded.");
    }
  }

  async function saveProvider() {
    const error = validateProviderForm(form);
    if (error) {
      setStatus(error);
      return;
    }

    setIsSaving(true);
    try {
      await createProvider({
        type: form.type,
        name: form.name.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim() || undefined,
        email: form.email.trim() || undefined,
        notes: form.notes.trim() || undefined
      });
      setForm(initialProviderFormState);
      await loadProviders();
      setStatus("Provider created.");
    } catch (error) {
      setStatus("Provider could not be created.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateField<K extends keyof ProviderFormState>(key: K, value: ProviderFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    loadProviders();
  }, []);

  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "40px", margin: "0 0 8px" } }, "Providers"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, "Create and list service providers for Arrivio operations."),
    createElement("section", { style: { ...cardStyle, maxWidth: "720px" } },
      createElement("h2", { style: { marginTop: 0 } }, "Create Provider"),
      createElement("label", null, "Type"),
      createElement("select", {
        style: inputStyle,
        value: form.type,
        onChange: (event) => updateField("type", event.currentTarget.value as ProviderType)
      },
        createElement("option", { value: "transfer" }, "Transfer"),
        createElement("option", { value: "carRental" }, "Car Rental"),
        createElement("option", { value: "hotel" }, "Hotel"),
        createElement("option", { value: "agency" }, "Agency")
      ),
      createElement("label", null, "Name"),
      createElement("input", { style: inputStyle, value: form.name, onChange: (event) => updateField("name", event.currentTarget.value), placeholder: "Provider name" }),
      createElement("label", null, "Phone"),
      createElement("input", { style: inputStyle, value: form.phone, onChange: (event) => updateField("phone", event.currentTarget.value), placeholder: "+90 5xx xxx xx xx" }),
      createElement("label", null, "WhatsApp"),
      createElement("input", { style: inputStyle, value: form.whatsapp, onChange: (event) => updateField("whatsapp", event.currentTarget.value), placeholder: "Optional" }),
      createElement("label", null, "Email"),
      createElement("input", { style: inputStyle, value: form.email, onChange: (event) => updateField("email", event.currentTarget.value), placeholder: "Optional" }),
      createElement("label", null, "Notes"),
      createElement("input", { style: inputStyle, value: form.notes, onChange: (event) => updateField("notes", event.currentTarget.value), placeholder: "Optional" }),
      createElement("button", {
        type: "button",
        onClick: saveProvider,
        disabled: isSaving,
        style: { padding: "13px 18px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }
      }, isSaving ? "Saving..." : "Create Provider")
    ),
    status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
    createElement("h2", null, "Existing Providers"),
    ...providers.map((provider) =>
      createElement("article", { key: provider.id || provider.name, style: cardStyle },
        createElement("h3", { style: { margin: "0 0 6px" } }, provider.name),
        createElement("p", { style: { margin: "0 0 6px", color: "#0B63F6", fontWeight: 700 } }, formatProviderCard(provider)),
        createElement("p", { style: { margin: "0 0 6px" } }, `Phone: ${provider.phone}`),
        provider.email ? createElement("p", { style: { margin: 0 } }, `Email: ${provider.email}`) : null
      )
    )
  );
}
