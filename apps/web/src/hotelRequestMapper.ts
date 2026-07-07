import type { HotelRequest } from "@arrivio/shared";
import type { HotelFormState } from "./hotelFormModel";

export function mapHotelFormToRequest(
  state: HotelFormState,
  requestCode: string,
  qrSourceId?: string
): Omit<HotelRequest, "id" | "createdAt" | "updatedAt"> {
  return {
    type: "hotel",
    requestCode,
    passengerName: state.passengerName.trim(),
    passengerPhone: state.passengerPhone.trim(),
    language: state.language,
    airportCode: state.airportCode,
    flightCode: state.flightCode.trim() || undefined,
    qrSourceId,
    checkInDate: state.checkInDate,
    checkOutDate: state.checkOutDate,
    guests: state.guests,
    rooms: state.rooms,
    radiusKm: state.radiusKm,
    wantsTransfer: state.wantsTransfer,
    status: "new",
    currency: "TRY",
    commissionStatus: "pending"
  };
}
