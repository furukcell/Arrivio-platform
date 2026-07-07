import type { CarRentalRequest } from "@arrivio/shared";
import type { WebLanguage } from "./supportModel";
import type { CarRentalFormState } from "./carRentalFormModel";

export function mapRentalFormToRequest(
  state: CarRentalFormState,
  requestCode: string,
  qrSourceId?: string,
  languageOverride?: WebLanguage
): Omit<CarRentalRequest, "id" | "createdAt" | "updatedAt"> {
  return {
    type: "carRental",
    requestCode,
    passengerName: state.passengerName.trim(),
    passengerPhone: state.passengerPhone.trim(),
    language: languageOverride || state.language,
    airportCode: state.airportCode,
    flightCode: state.flightCode.trim() || undefined,
    qrSourceId,
    pickupLocation: state.pickupLocation.trim(),
    dropoffLocation: state.dropoffLocation.trim() || undefined,
    pickupDate: state.pickupDate,
    dropoffDate: state.dropoffDate,
    carClass: state.carClass,
    transmission: state.transmission,
    status: "new",
    currency: "TRY",
    commissionStatus: "pending"
  };
}
