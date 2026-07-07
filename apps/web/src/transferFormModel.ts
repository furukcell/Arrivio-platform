import { generateRequestCode } from "@arrivio/shared";

export type TransferFormState = {
  passengerName: string;
  passengerPhone: string;
  language: "tr" | "en";
  airportCode: string;
  flightCode: string;
  destination: string;
  passengers: number;
  bags: number;
  pickupDate: string;
  pickupTime: string;
};

export const initialTransferFormState: TransferFormState = {
  passengerName: "",
  passengerPhone: "",
  language: "en",
  airportCode: "BJV",
  flightCode: "",
  destination: "",
  passengers: 1,
  bags: 1,
  pickupDate: "",
  pickupTime: ""
};

export function createTransferRequestCode(): string {
  return generateRequestCode("transfer", Date.now() % 9000);
}

export function validateTransferForm(state: TransferFormState): string | null {
  if (!state.passengerName.trim()) return "Passenger name is required.";
  if (!state.passengerPhone.trim()) return "Passenger phone is required.";
  if (!state.destination.trim()) return "Destination is required.";
  if (state.passengers < 1) return "Passenger count must be at least 1.";
  return null;
}
