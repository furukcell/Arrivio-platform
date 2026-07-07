import type { AppUser } from "@arrivio/shared";

export type ProviderSessionState = {
  isLoading: boolean;
  authEmail: string;
  appUser: AppUser | null;
  providerId: string;
  status: string;
};

export const initialProviderSessionState: ProviderSessionState = {
  isLoading: true,
  authEmail: "",
  appUser: null,
  providerId: "",
  status: "Checking provider session..."
};

export function resolveProviderId(appUser: AppUser | null): string {
  if (appUser?.role === "provider" && appUser.providerId) return appUser.providerId;
  return "";
}

export function buildProviderSessionStatus(appUser: AppUser | null): string {
  if (!appUser) return "No app user profile found for this account.";
  if (appUser.role !== "provider") return "This account is not a provider account.";
  if (!appUser.providerId) return "Provider account has no providerId.";
  return "Provider session ready.";
}
