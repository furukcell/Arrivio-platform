import { generateRequestCode, type CarRentalDailyPrice } from "@arrivio/shared";

export type CarRentalClass = "economic" | "middle" | "suv" | "luxury";
export type CarRentalTransmission = "manual" | "automatic";

export type CarRentalFormState = {
  passengerName: string;
  passengerPhone: string;
  language: "tr" | "en";
  airportCode: string;
  flightCode: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
  carClass: CarRentalClass;
  transmission: CarRentalTransmission;
  passengers: number;
};

export type CarRentalPriceSummary = {
  minDailyPrice: number;
  maxDailyPrice: number;
  vehicleCount: number;
  rentalDays: number;
  currency: "TRY";
};

export const CAR_RENTAL_PICKUP_OPTIONS = [
  { value: "Milas-Bodrum Airport", trLabel: "Milas-Bodrum Havalimanı", enLabel: "Milas-Bodrum Airport" },
  { value: "Bodrum Merkez", trLabel: "Bodrum Merkez", enLabel: "Bodrum Center" },
  { value: "Gümbet", trLabel: "Gümbet", enLabel: "Gumbet" },
  { value: "Yalıkavak", trLabel: "Yalıkavak", enLabel: "Yalikavak" },
  { value: "Turgutreis", trLabel: "Turgutreis", enLabel: "Turgutreis" },
  { value: "Otele teslim", trLabel: "Otele teslim", enLabel: "Hotel delivery" }
];

export const CAR_RENTAL_CLASS_OPTIONS: Array<{ value: CarRentalClass; trLabel: string; enLabel: string; seats: string; bags: string; baseDailyPrice: number }> = [
  { value: "economic", trLabel: "Ekonomik", enLabel: "Economic", seats: "1-4", bags: "2", baseDailyPrice: 1050 },
  { value: "middle", trLabel: "Orta sınıf", enLabel: "Middle class", seats: "1-5", bags: "3", baseDailyPrice: 1450 },
  { value: "suv", trLabel: "SUV", enLabel: "SUV", seats: "1-5", bags: "4", baseDailyPrice: 2300 },
  { value: "luxury", trLabel: "Lüks", enLabel: "Luxury", seats: "1-4", bags: "3", baseDailyPrice: 3400 }
];

export const CAR_RENTAL_TRANSMISSION_OPTIONS: Array<{ value: CarRentalTransmission; trLabel: string; enLabel: string }> = [
  { value: "automatic", trLabel: "Otomatik", enLabel: "Automatic" },
  { value: "manual", trLabel: "Manuel", enLabel: "Manual" }
];

const RENTAL_PRICE_FACTORS = [0.9, 1, 1.08, 1.16, 1.28, 1.42];

export const CAR_RENTAL_DAILY_PRICE_SEED: CarRentalDailyPrice[] = CAR_RENTAL_PICKUP_OPTIONS.flatMap((pickup) =>
  CAR_RENTAL_CLASS_OPTIONS.flatMap((carClass) =>
    CAR_RENTAL_TRANSMISSION_OPTIONS.flatMap((transmission) =>
      RENTAL_PRICE_FACTORS.map((factor, index) => ({
        providerId: `seed-rental-${index + 1}`,
        airportCode: "BJV",
        pickupLocation: pickup.value,
        carClass: carClass.value,
        transmission: transmission.value,
        dailyPrice: Math.round((carClass.baseDailyPrice * (transmission.value === "automatic" ? 1.08 : 1) * factor) / 50) * 50,
        currency: "TRY" as const,
        airportDelivery: pickup.value === "Milas-Bodrum Airport" || pickup.value === "Otele teslim",
        depositAmount: carClass.value === "luxury" ? 15000 : carClass.value === "suv" ? 10000 : 5000,
        isActive: true,
        isVerified: true
      }))
    )
  )
);

export const initialCarRentalFormState: CarRentalFormState = {
  passengerName: "",
  passengerPhone: "",
  language: "en",
  airportCode: "BJV",
  flightCode: "",
  pickupLocation: "Milas-Bodrum Airport",
  dropoffLocation: "",
  pickupDate: "",
  dropoffDate: "",
  pickupTime: "",
  dropoffTime: "",
  carClass: "economic",
  transmission: "automatic",
  passengers: 1
};

export function createCarRentalRequestCode(): string {
  return generateRequestCode("carRental", Date.now() % 9000);
}

export function getRentalDays(pickupDate: string, dropoffDate: string): number {
  if (!pickupDate || !dropoffDate) return 1;
  const start = new Date(`${pickupDate}T00:00:00`);
  const end = new Date(`${dropoffDate}T00:00:00`);
  const diffMs = end.getTime() - start.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) return 1;
  return Math.max(1, Math.ceil(diffMs / 86400000));
}

export function listMatchingCarRentalPrices(state: Pick<CarRentalFormState, "airportCode" | "pickupLocation" | "carClass" | "transmission">, prices = CAR_RENTAL_DAILY_PRICE_SEED): CarRentalDailyPrice[] {
  return prices.filter((item) =>
    item.isActive !== false &&
    item.isVerified !== false &&
    item.airportCode === state.airportCode &&
    item.pickupLocation === state.pickupLocation &&
    item.carClass === state.carClass &&
    item.transmission === state.transmission &&
    item.dailyPrice > 0
  );
}

export function getCarRentalPriceSummary(state: Pick<CarRentalFormState, "airportCode" | "pickupLocation" | "carClass" | "transmission" | "pickupDate" | "dropoffDate">, prices = CAR_RENTAL_DAILY_PRICE_SEED): CarRentalPriceSummary | null {
  const matchedPrices = listMatchingCarRentalPrices(state, prices).map((item) => item.dailyPrice);
  if (!matchedPrices.length) return null;
  return {
    minDailyPrice: Math.min(...matchedPrices),
    maxDailyPrice: Math.max(...matchedPrices),
    vehicleCount: matchedPrices.length,
    rentalDays: getRentalDays(state.pickupDate, state.dropoffDate),
    currency: "TRY"
  };
}

export function estimateCarRentalDailyPrice(state: Pick<CarRentalFormState, "airportCode" | "pickupLocation" | "carClass" | "transmission" | "pickupDate" | "dropoffDate">): number {
  const summary = getCarRentalPriceSummary(state);
  if (summary) return summary.minDailyPrice;
  const option = CAR_RENTAL_CLASS_OPTIONS.find((item) => item.value === state.carClass) || CAR_RENTAL_CLASS_OPTIONS[0];
  return Math.round(option.baseDailyPrice * (state.transmission === "automatic" ? 1.08 : 1));
}

export function formatCarRentalDailyPriceRange(summary: CarRentalPriceSummary | null): string {
  if (!summary) return "Fiyat kontrol edilecek";
  if (summary.minDailyPrice === summary.maxDailyPrice) return `${summary.minDailyPrice.toLocaleString("tr-TR")} TL / gün`;
  return `${summary.minDailyPrice.toLocaleString("tr-TR")} - ${summary.maxDailyPrice.toLocaleString("tr-TR")} TL / gün`;
}

export function validateCarRentalForm(state: CarRentalFormState): string | null {
  if (!state.passengerName.trim()) return "Passenger name is required.";
  if (!state.passengerPhone.trim()) return "Passenger phone is required.";
  if (!state.pickupLocation.trim()) return "Pickup location is required.";
  if (!state.pickupDate.trim()) return "Pickup date is required.";
  if (!state.dropoffDate.trim()) return "Dropoff date is required.";
  if (state.passengers < 1) return "Passenger count must be at least 1.";
  return null;
}
