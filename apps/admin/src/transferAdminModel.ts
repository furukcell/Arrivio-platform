import type { TransferRequest } from "@arrivio/shared";

export function formatTransferTitle(request: TransferRequest): string {
  return `${request.requestCode} - ${request.passengerName}`;
}

export function formatTransferRoute(request: TransferRequest): string {
  if (request.routeFrom && request.routeTo) return `${request.routeFrom} → ${request.routeTo}`;
  if (request.transferDirection === "to_airport") return `${request.destination} → ${request.airportCode}`;
  return `${request.airportCode} → ${request.destination}`;
}

export function formatTransferMeta(request: TransferRequest): string {
  const flight = request.flightCode ? `Flight ${request.flightCode}` : "No flight code";
  const bags = typeof request.bags === "number" ? `${request.bags} bags` : "Bags not set";
  const pickup = request.pickupDate || request.pickupTime ? `Pickup ${request.pickupDate || "date not set"} ${request.pickupTime || "time not set"}` : "Pickup not set";
  const vehicle = request.vehicleClass ? `Vehicle ${request.vehicleClass}` : "Vehicle not set";
  return `${pickup} / ${vehicle} / ${flight} / ${request.passengers} passengers / ${bags}`;
}

export function formatProviderInfo(request: TransferRequest): string {
  if (request.providerName) return request.providerName;
  if (request.assignedProviderId) return request.assignedProviderId;
  return "Unassigned";
}
