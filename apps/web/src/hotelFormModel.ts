import { generateRequestCode } from "@arrivio/shared";

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
};

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
  wantsTransfer: true
};

export function createHotelRequestCode(): string {
  return generateRequestCode("hotel", Date.now() % 9000);
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
