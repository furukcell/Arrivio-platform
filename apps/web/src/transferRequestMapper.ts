import type { TransferRequest } from "@arrivio/shared";
import type { TransferFormState } from "./transferFormModel";

export function mapTransferFormToRequest(
  state: TransferFormState,
  requestCode: string,
  qrSourceId?: string
): Omit<TransferRequest, "id" | "createdAt" | "updatedAt"> {
  return {
    type: "transfer",
    requestCode,
    passengerName: state.passengerName.trim(),
    passengerPhone: state.passengerPhone.trim(),
    language: state.language,
    airportCode: state.airportCode,
    flightCode: state.flightCode.trim() || undefined,
    destination: state.destination.trim(),
    passengers: state.passengers,
    bags: state.bags,
    pickupDate: state.pickupDate || undefined,
    pickupTime: state.pickupTime || undefined,
    status: "new",
    qrSourceId,
    currency: "TRY",
    commissionStatus: "pending"
  };
}
