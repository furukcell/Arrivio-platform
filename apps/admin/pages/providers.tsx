import { createElement, useEffect, useState } from "react";
import { createProvider, getAppUserByUid, listenToCurrentUser, listProviders, logoutCurrentUser, upsertAppUser } from "@arrivio/firebase";
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
  const [status, setStatus] = useState("Checking admin session...");
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [userIds, setUserIds] = useState<Record<string, string>>({});
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [linkingId, setLinkingId] = useState("");

  async function loadProviders() {
    if (!isAdmin) {
      setStatus("Admin login required.");
      return;
    }

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
    if (!isAdmin) {
      setStatus("Admin login required.");
      return;
    }

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

  async function linkProviderUser(provider: Provider) {
    if (!isAdmin) {
      setStatus("Admin login required.");
      return;
    }

    if (!provider.id) {
      setStatus("Provider id is missing.");
      return;
    }

    const uid = userIds[provider.id]?.trim();
    const email = userEmails[provider.id]?.trim() || provider.email || "";

    if (!uid) {
      setStatus("Auth UID is required.");
      return;
    }

    setLinkingId(provider.id);
    try {
      await upsertAppUser({
        uid,
        role: "provider",
        providerId: provider.id,
        email,
        displayName: provider.name
      });
      setStatus(`${provider.name} linked to provider auth user.`);
    } catch (error) {
      setStatus("Provider auth user could not be linked.");
    } finally {
      setLinkingId("");
    }
  }

  function updateField<K extends keyof ProviderFormState>(key: K, value: ProviderFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateProviderUserId(providerId: string, uid: string) {
    setUserIds((current) => ({ ...current, [providerId]: uid }));
  }

  function updateProviderUserEmail(providerId: string, email: string) {
    setUserEmails((current) => ({ ...current, [providerId]: email }));
  }

  async function logoutAdmin() {
    await logoutCurrentUser();
    setIsAdmin(false);
    setAuthEmail("");
    setProviders([]);
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
      const items = await listProviders();
      setProviders(items);
      setStatus(items.length ? "" : "No providers yet.");
    });

    return () => unsubscribe();
  }, []);

  return createElement(
    "main",
    { style: pageStyle },
    createElement("h1", { style: { fontSize: "40px", margin: "0 0 8px" } }, "Providers"),
    createElement("p", { style: { color: "#4B5563", marginBottom: "8px" } }, "Admin-only provider management screen."),
    createElement("p", { style: { color: "#4B5563", marginBottom: "24px" } }, `Admin: ${authEmail || "not logged in"}`),
    createElement("button", { type: "button", onClick: logoutAdmin, style: { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#4B5563", color: "#FFFFFF", fontWeight: 700, cursor: "pointer", marginBottom: "18px" } }, "Logout"),
    status ? createElement("p", { style: { fontWeight: 700 } }, status) : null,
    !isAdmin ? createElement("p", null, "Open /login to sign in as admin.") : null,
    createElement("section", { style: { ...cardStyle, maxWidth: "720px", opacity: isAdmin ? 1 : 0.55 } },
      createElement("h2", { style: { marginTop: 0 } }, "Create Provider"),
      createElement("label", null, "Type"),
      createElement("select", {
        style: inputStyle,
        value: form.type,
        disabled: !isAdmin,
        onChange: (event) => updateField("type", event.currentTarget.value as ProviderType)
      },
        createElement("option", { value: "transfer" }, "Transfer"),
        createElement("option", { value: "carRental" }, "Car Rental"),
        createElement("option", { value: "hotel" }, "Hotel"),
        createElement("option", { value: "agency" }, "Agency")
      ),
      createElement("label", null, "Name"),
      createElement("input", { style: inputStyle, disabled: !isAdmin, value: form.name, onChange: (event) => updateField("name", event.currentTarget.value), placeholder: "Provider name" }),
      createElement("label", null, "Phone"),
      createElement("input", { style: inputStyle, disabled: !isAdmin, value: form.phone, onChange: (event) => updateField("phone", event.currentTarget.value), placeholder: "+90 5xx xxx xx xx" }),
      createElement("label", null, "WhatsApp"),
      createElement("input", { style: inputStyle, disabled: !isAdmin, value: form.whatsapp, onChange: (event) => updateField("whatsapp", event.currentTarget.value), placeholder: "Optional" }),
      createElement("label", null, "Email"),
      createElement("input", { style: inputStyle, disabled: !isAdmin, value: form.email, onChange: (event) => updateField("email", event.currentTarget.value), placeholder: "Optional" }),
      createElement("label", null, "Notes"),
      createElement("input", { style: inputStyle, disabled: !isAdmin, value: form.notes, onChange: (event) => updateField("notes", event.currentTarget.value), placeholder: "Optional" }),
      createElement("button", {
        type: "button",
        onClick: saveProvider,
        disabled: isSaving || !isAdmin,
        style: { padding: "13px 18px", border: 0, borderRadius: "999px", background: "#0B63F6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }
      }, isSaving ? "Saving..." : "Create Provider")
    ),
    createElement("h2", null, "Existing Providers"),
    ...providers.map((provider) =>
      createElement("article", { key: provider.id || provider.name, style: cardStyle },
        createElement("h3", { style: { margin: "0 0 6px" } }, provider.name),
        createElement("p", { style: { margin: "0 0 6px", color: "#0B63F6", fontWeight: 700 } }, formatProviderCard(provider)),
        createElement("p", { style: { margin: "0 0 6px" } }, `Phone: ${provider.phone}`),
        provider.email ? createElement("p", { style: { margin: "0 0 12px" } }, `Email: ${provider.email}`) : null,
        provider.id ? createElement("div", { style: { marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #E5E7EB" } },
          createElement("h4", { style: { margin: "0 0 8px" } }, "Link Firebase Auth User"),
          createElement("input", {
            style: inputStyle,
            disabled: !isAdmin,
            value: userIds[provider.id] || "",
            onChange: (event) => updateProviderUserId(provider.id || "", event.currentTarget.value),
            placeholder: "Firebase Auth UID"
          }),
          createElement("input", {
            style: inputStyle,
            disabled: !isAdmin,
            value: userEmails[provider.id] || provider.email || "",
            onChange: (event) => updateProviderUserEmail(provider.id || "", event.currentTarget.value),
            placeholder: "Provider auth email"
          }),
          createElement("button", {
            type: "button",
            onClick: () => linkProviderUser(provider),
            disabled: !isAdmin || linkingId === provider.id,
            style: { padding: "12px 16px", border: 0, borderRadius: "999px", background: "#1FB6A6", color: "#FFFFFF", fontWeight: 700, cursor: "pointer" }
          }, linkingId === provider.id ? "Linking..." : "Link Auth User")
        ) : null
      )
    )
  );
}
