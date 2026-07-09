import { generateRequestCode, type HotelNightlyPrice } from "@arrivio/shared";

export type HotelAccommodationType = "airport_hotel" | "bodrum_center" | "apart_pension" | "family_room" | "luxury_hotel";

export type HotelFormState = {
  passengerName: string;
  passengerPhone: string;
  language: "tr" | "en";
  airportCode: string;
  flightCode: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms: number;
  radiusKm: number;
  wantsTransfer: boolean;
  accommodationType: HotelAccommodationType;
};

export type HotelPriceSummary = {
  minNightlyPrice: number;
  maxNightlyPrice: number;
  hotelCount: number;
  nightCount: number;
  currency: "TRY";
};

export const HOTEL_ACCOMMODATION_OPTIONS: Array<{ value: HotelAccommodationType; trLabel: string; enLabel: string; baseNightlyPrice: number }> = [
  { value: "airport_hotel", trLabel: "Havalimanına yakın otel", enLabel: "Airport area hotel", baseNightlyPrice: 1800 },
  { value: "bodrum_center", trLabel: "Bodrum merkez otel", enLabel: "Bodrum center hotel", baseNightlyPrice: 2600 },
  { value: "apart_pension", trLabel: "Apart / pansiyon", enLabel: "Apart / pension", baseNightlyPrice: 1500 },
  { value: "family_room", trLabel: "Aile odası", enLabel: "Family room", baseNightlyPrice: 3200 },
  { value: "luxury_hotel", trLabel: "Lüks otel", enLabel: "Luxury hotel", baseNightlyPrice: 6500 }
];

const HOTEL_PRICE_FACTORS = [0.86, 1, 1.14, 1.32, 1.55, 1.85];

export const HOTEL_NIGHTLY_PRICE_SEED: HotelNightlyPrice[] = HOTEL_ACCOMMODATION_OPTIONS.flatMap((option) =>
  HOTEL_PRICE_FACTORS.map((factor, index) => ({
    providerId: `seed-hotel-${index + 1}`,
    airportCode: "BJV",
    accommodationType: option.value,
    nightlyPrice: Math.round((option.baseNightlyPrice * factor) / 50) * 50,
    currency: "TRY" as const,
    maxGuests: option.value === "family_room" ? 5 : option.value === "luxury_hotel" ? 4 : 3,
    hasTransfer: option.value !== "apart_pension",
    isActive: true,
    isVerified: true
  }))
);

export const initialHotelFormState: HotelFormState = {
  passengerName: "",
  passengerPhone: "",
  language: "en",
  airportCode: "BJV",
  flightCode: "",
  checkInDate: "",
  checkOutDate: "",
  guests: 2,
  rooms: 1,
  radiusKm: 25,
  wantsTransfer: true,
  accommodationType: "airport_hotel"
};

export function createHotelRequestCode(): string {
  return generateRequestCode("hotel", Date.now() % 9000);
}

export function getHotelNightCount(checkInDate: string, checkOutDate: string): number {
  if (!checkInDate || !checkOutDate) return 1;
  const start = new Date(`${checkInDate}T00:00:00`);
  const end = new Date(`${checkOutDate}T00:00:00`);
  const diffMs = end.getTime() - start.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) return 1;
  return Math.max(1, Math.ceil(diffMs / 86400000));
}

export function listMatchingHotelPrices(state: Pick<HotelFormState, "airportCode" | "accommodationType" | "guests" | "wantsTransfer">, prices = HOTEL_NIGHTLY_PRICE_SEED): HotelNightlyPrice[] {
  return prices.filter((item) =>
    item.isActive !== false &&
    item.isVerified !== false &&
    item.airportCode === state.airportCode &&
    item.accommodationType === state.accommodationType &&
    (!item.maxGuests || item.maxGuests >= state.guests) &&
    (!state.wantsTransfer || item.hasTransfer !== false) &&
    item.nightlyPrice > 0
  );
}

export function getHotelPriceSummary(state: Pick<HotelFormState, "airportCode" | "accommodationType" | "guests" | "wantsTransfer" | "checkInDate" | "checkOutDate">, prices = HOTEL_NIGHTLY_PRICE_SEED): HotelPriceSummary | null {
  const matchedPrices = listMatchingHotelPrices(state, prices).map((item) => item.nightlyPrice);
  if (!matchedPrices.length) return null;
  return {
    minNightlyPrice: Math.min(...matchedPrices),
    maxNightlyPrice: Math.max(...matchedPrices),
    hotelCount: matchedPrices.length,
    nightCount: getHotelNightCount(state.checkInDate, state.checkOutDate),
    currency: "TRY"
  };
}

export function estimateHotelNightlyPrice(state: Pick<HotelFormState, "airportCode" | "accommodationType" | "guests" | "wantsTransfer" | "checkInDate" | "checkOutDate">): number {
  const summary = getHotelPriceSummary(state);
  if (summary) return summary.minNightlyPrice;
  const option = HOTEL_ACCOMMODATION_OPTIONS.find((item) => item.value === state.accommodationType) || HOTEL_ACCOMMODATION_OPTIONS[0];
  return option.baseNightlyPrice;
}

export function formatHotelNightlyPriceRange(summary: HotelPriceSummary | null): string {
  if (!summary) return "Fiyat kontrol edilecek";
  if (summary.minNightlyPrice === summary.maxNightlyPrice) return `${summary.minNightlyPrice.toLocaleString("tr-TR")} TL / gece`;
  return `${summary.minNightlyPrice.toLocaleString("tr-TR")} - ${summary.maxNightlyPrice.toLocaleString("tr-TR")} TL / gece`;
}

export function validateHotelForm(state: HotelFormState): string | null {
  if (!state.passengerName.trim()) return "Passenger name is required.";
  if (!state.passengerPhone.trim()) return "Passenger phone is required.";
  if (!state.checkInDate.trim()) return "Check-in date is required.";
  if (!state.checkOutDate.trim()) return "Check-out date is required.";
  if (state.guests < 1) return "Guest count must be at least 1.";
  if (state.rooms < 1) return "Room count must be at least 1.";
  return null;
}
