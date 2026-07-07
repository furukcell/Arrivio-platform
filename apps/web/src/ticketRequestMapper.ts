import type { TicketRequest } from "@arrivio/shared";
import type { WebLanguage } from "./supportModel";
import type { TicketFormState } from "./ticketFormModel";

export function mapTicketFormToRequest(
  state: TicketFormState,
  requestCode: string,
  qrSourceId?: string,
  languageOverride?: WebLanguage
): Omit<TicketRequest, "id" | "createdAt" | "updatedAt"> {
  return {
    type: "ticket",
    requestCode,
    passengerName: state.passengerName.trim(),
    passengerPhone: state.passengerPhone.trim(),
    language: languageOverride || state.language,
    airportCode: state.airportCode,
    flightCode: state.flightCode.trim() || undefined,
    qrSourceId,
    fromAirportOrCity: state.fromAirportOrCity.trim(),
    toAirportOrCity: state.toAirportOrCity.trim(),
    departureDate: state.departureDate,
    returnDate: state.returnDate.trim() || undefined,
    passengers: state.passengers,
    status: "new",
    currency: "TRY",
    commissionStatus: "pending"
  };
}
