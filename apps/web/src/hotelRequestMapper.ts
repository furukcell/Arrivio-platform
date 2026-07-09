import type { HotelRequest } from "@arrivio/shared";
import type { WebLanguage } from "./supportModel";
import { estimateHotelNightlyPrice, getHotelPriceSummary, type HotelFormState } from "./hotelFormModel";

export function mapHotelFormToRequest(
  state: HotelFormState,
  requestCode: string,
  qrSourceId?: string,
  languageOverride?: WebLanguage
): Omit<HotelRequest, "id" | "createdAt" | "updatedAt"> {
  const priceSummary = getHotelPriceSummary(state);
  const estimatedNightlyPrice = priceSummary?.minNightlyPrice ?? estimateHotelNightlyPrice(state);
  const nightCount = priceSummary?.nightCount ?? 1;

  return {
    type: "hotel",
    requestCode,
    passengerName: state.passengerName.trim(),
    passengerPhone: state.passengerPhone.trim(),
    language: languageOverride || state.language,
    airportCode: state.airportCode,
    flightCode: state.flightCode.trim() || undefined,
    qrSourceId,
    checkInDate: state.checkInDate,
    checkOutDate: state.checkOutDate,
    guests: state.guests,
    rooms: state.rooms,
    radiusKm: state.radiusKm,
    wantsTransfer: state.wantsTransfer,
    accommodationType: state.accommodationType,
    estimatedNightlyPriceMin: priceSummary?.minNightlyPrice ?? estimatedNightlyPrice,
    estimatedNightlyPriceMax: priceSummary?.maxNightlyPrice ?? estimatedNightlyPrice,
    estimatedNightCount: nightCount,
    matchedHotelCount: priceSummary?.hotelCount ?? 0,
    estimatedTotalPrice: estimatedNightlyPrice * nightCount * state.rooms,
    status: "new",
    currency: "TRY",
    commissionStatus: "pending"
  };
}
