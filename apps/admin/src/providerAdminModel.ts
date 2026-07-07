import type { Provider, ProviderType } from "@arrivio/shared";

export type ProviderFormState = {
  type: ProviderType;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  notes: string;
};

export const initialProviderFormState: ProviderFormState = {
  type: "transfer",
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  notes: ""
};

export function validateProviderForm(state: ProviderFormState): string | null {
  if (!state.name.trim()) return "Provider name is required.";
  if (!state.phone.trim()) return "Provider phone is required.";
  return null;
}

export function formatProviderCard(provider: Provider): string {
  const verified = provider.isVerified ? "verified" : "not verified";
  const active = provider.isActive === false ? "inactive" : "active";
  return `${provider.type} / ${verified} / ${active}`;
}
