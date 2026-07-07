import type { TransferRequest } from "@arrivio/shared";

export function getProviderIdFromQuery(rawValue: string | string[] | undefined): string {
  if (Array.isArray(rawValue)) return rawValue[0] || "";
  return rawValue || "";
}

export function formatTransferTitle(request: TransferRequest): string {
  return `${request.requestCode} - ${request.destination}`;
}

export function formatPassengerSummary(request: TransferRequest): string {
  const bags = typeof request.bags === "number" ? `${request.bags} bags` : "bags not set";
  const flight = request.flightCode ? `Flight ${request.flightCode}` : "No flight code";
  return `${request.passengerName} / ${request.passengers} passengers / ${bags} / ${flight}`;
}

export function formatContactLine(request: TransferRequest): string {
  return `Phone: ${request.passengerPhone}`;
}

export function isProviderActionable(request: TransferRequest): boolean {
  return request.status === "provider_pending" || request.status === "confirmed" || request.status === "passenger_waiting";
}
