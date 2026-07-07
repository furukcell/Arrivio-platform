import { generateRequestCode } from "@arrivio/shared";

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
  carClass: "economic" | "middle" | "suv" | "luxury";
  transmission: "manual" | "automatic";
  passengers: number;
};

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
  carClass: "economic",
  transmission: "automatic",
  passengers: 1
};

export function createCarRentalRequestCode(): string {
  return generateRequestCode("carRental", Date.now() % 9000);
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
