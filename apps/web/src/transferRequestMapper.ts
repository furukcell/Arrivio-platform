import type { TransferRequest } from "@arrivio/shared";
import type { WebLanguage } from "./supportModel";
import { estimateTransferPrice, type TransferFormState } from "./transferFormModel";

export function mapTransferFormToRequest(
  state: TransferFormState,
  requestCode: string,
  qrSourceId?: string,
  languageOverride?: WebLanguage
): Omit<TransferRequest, "id" | "createdAt" | "updatedAt"> {
  return {
    type: "transfer",
    requestCode,
    passengerName: state.passengerName.trim(),
    passengerPhone: state.passengerPhone.trim(),
    language: languageOverride || state.language,
    airportCode: state.airportCode,
    flightCode: state.flightCode.trim() || undefined,
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
