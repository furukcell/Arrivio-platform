import type { CarRentalDailyPrice, CarRentalRequest } from "@arrivio/shared";
import type { WebLanguage } from "./supportModel";
import { estimateCarRentalDailyPrice, getCarRentalPriceSummary, type CarRentalFormState } from "./carRentalFormModel";

export function mapRentalFormToRequest(
  state: CarRentalFormState,
  requestCode: string,
  qrSourceId?: string,
  languageOverride?: WebLanguage,
  dailyPrices?: CarRentalDailyPrice[]
): Omit<CarRentalRequest, "id" | "createdAt" | "updatedAt"> {
  const priceSummary = getCarRentalPriceSummary(state, dailyPrices);
  const estimatedDailyPrice = priceSummary?.minDailyPrice ?? estimateCarRentalDailyPrice(state);
  const rentalDays = priceSummary?.rentalDays ?? 1;

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
    pickupTime: state.pickupTime || undefined,
    dropoffTime: state.dropoffTime || undefined,
    carClass: state.carClass,
    transmission: state.transmission,
    passengers: state.passengers,
    estimatedDailyPriceMin: priceSummary?.minDailyPrice ?? estimatedDailyPrice,
    estimatedDailyPriceMax: priceSummary?.maxDailyPrice ?? estimatedDailyPrice,
    estimatedRentalDays: rentalDays,
    matchedVehicleCount: priceSummary?.vehicleCount ?? 0,
    estimatedTotalPrice: estimatedDailyPrice * rentalDays,
    status: "new",
    currency: "TRY",
    commissionStatus: "pending"
  };
}
