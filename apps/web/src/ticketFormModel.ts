import { generateRequestCode } from "@arrivio/shared";

export type TicketFormState = {
  passengerName: string;
  passengerPhone: string;
  language: "tr" | "en";
  airportCode: string;
  flightCode: string;
  fromAirportOrCity: string;
  toAirportOrCity: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
};

export const initialTicketFormState: TicketFormState = {
  passengerName: "",
  passengerPhone: "",
  language: "en",
  airportCode: "BJV",
  flightCode: "",
  fromAirportOrCity: "Bodrum / BJV",
  toAirportOrCity: "",
  departureDate: "",
  returnDate: "",
  passengers: 1
};

export function createTicketRequestCode(): string {
  return generateRequestCode("ticket", Date.now() % 9000);
}

export function validateTicketForm(state: TicketFormState): string | null {
  if (!state.passengerName.trim()) return "Passenger name is required.";
  if (!state.passengerPhone.trim()) return "Passenger phone is required.";
  if (!state.fromAirportOrCity.trim()) return "From city or airport is required.";
  if (!state.toAirportOrCity.trim()) return "To city or airport is required.";
  if (!state.departureDate.trim()) return "Departure date is required.";
  if (state.passengers < 1) return "Passenger count must be at least 1.";
  return null;
}
