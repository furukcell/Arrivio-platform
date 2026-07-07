import type { RequestType } from "./types";

const PREFIX_BY_TYPE: Record<RequestType, string> = {
  transfer: "TRF",
  carRental: "RAC",
  hotel: "HTL",
  ticket: "TKT"
};

const BASE_NUMBER_BY_TYPE: Record<RequestType, number> = {
  transfer: 1000,
  carRental: 2000,
  hotel: 3000,
  ticket: 4000
};

export function normalizeTurkishPhone(input: string): string {
  const digits = input.replace(/\D/g, "");

  if (digits.startsWith("90") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `9${digits}`;
  if (digits.length === 10) return `90${digits}`;

  return digits;
}

export function createWhatsAppUrl(phone: string, message: string): string {
  const normalizedPhone = normalizeTurkishPhone(phone);
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

export function generateRequestCode(type: RequestType, sequence: number): string {
  const prefix = PREFIX_BY_TYPE[type];
  const base = BASE_NUMBER_BY_TYPE[type];
  return `${prefix}-${base + sequence}`;
}

export function calculatePercentageCommission(total: number, ratePercent: number): number {
  return Math.round((total * ratePercent) / 100);
}

export function calculateFixedCommission(amount: number): number {
  return Math.round(amount);
}
