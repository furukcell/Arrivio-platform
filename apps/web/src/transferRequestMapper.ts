import type { TransferRequest } from "@arrivio/shared";
import type { WebLanguage } from "./supportModel";
import { buildTransferRoute, estimateTransferPrice, type TransferFormState } from "./transferFormModel";

export function mapTransferFormToRequest(
  state: TransferFormState,
  requestCode: string,
  qrSourceId?: string,
  languageOverride?: WebLanguage
): Omit<TransferRequest, "id" | "createdAt" | "updatedAt"> {
  const route = buildTransferRoute(state);

  return {
    type: "transfer",
    requestCode,
    passengerName: state.passengerName.trim(),
    passengerPhone: state.passengerPhone.trim(),
    language: languageOverride || state.language,
    airportCode: state.airportCode,
    flightCode: state.flightCode.trim() || undefined,
    transferDirection: state.transferDirection,
    routeFrom: route.routeFrom,
    routeTo: route.routeTo,
    pickupLocation: route.pickupLocation,
    destination: state.destination.trim(),
    passengers: state.passengers,
    bags: state.bags,
    vehicleClass: state.vehicleClass,
    pickupDate: state.pickupDate || undefined,
    pickupTime: state.pickupTime || undefined,
    status: "new",
    qrSourceId,
    estimatedTotalPrice: estimateTransferPrice(state),
    currency: "TRY",
    commissionStatus: "pending"
  };
}
