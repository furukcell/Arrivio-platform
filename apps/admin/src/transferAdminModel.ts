import type { TransferRequest } from "@arrivio/shared";

export function formatTransferTitle(request: TransferRequest): string {
  return `${request.requestCode} - ${request.passengerName}`;
}

export function formatTransferRoute(request: TransferRequest): string {
  return `${request.airportCode} to ${request.destination}`;
}

export function formatTransferMeta(request: TransferRequest): string {
  const flight = request.flightCode ? `Flight ${request.flightCode}` : "No flight code";
  const bags = typeof request.bags === "number" ? `${request.bags} bags` : "Bags not set";
  return `${flight} / ${request.passengers} passengers / ${bags}`;
}

export function formatProviderInfo(request: TransferRequest): string {
  if (request.providerName) return request.providerName;
  if (request.assignedProviderId) return request.assignedProviderId;
  return "Unassigned";
}
