import { generateRequestCode } from "@arrivio/shared";

export type TransferVehicleClass = "economic" | "vip" | "minibus" | "luxury";

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
  vehicleClass: TransferVehicleClass;
};

type PriceMap = Record<TransferVehicleClass, number>;

export type TransferDestinationOption = {
  value: string;
  trLabel: string;
  enLabel: string;
  prices: PriceMap;
};

export const TRANSFER_DESTINATION_OPTIONS: TransferDestinationOption[] = [
  { value: "Bodrum Merkez", trLabel: "Bodrum Merkez", enLabel: "Bodrum Center", prices: { economic: 1400, vip: 1900, minibus: 2400, luxury: 3200 } },
  { value: "Gümbet", trLabel: "Gümbet", enLabel: "Gumbet", prices: { economic: 1450, vip: 1950, minibus: 2500, luxury: 3300 } },
  { value: "Yalıkavak", trLabel: "Yalıkavak", enLabel: "Yalikavak", prices: { economic: 2100, vip: 2800, minibus: 3400, luxury: 4600 } },
  { value: "Turgutreis", trLabel: "Turgutreis", enLabel: "Turgutreis", prices: { economic: 2200, vip: 2900, minibus: 3500, luxury: 4700 } },
  { value: "Türkbükü", trLabel: "Türkbükü", enLabel: "Turkbuku", prices: { economic: 2300, vip: 3100, minibus: 3700, luxury: 4900 } },
  { value: "Milas", trLabel: "Milas", enLabel: "Milas", prices: { economic: 850, vip: 1250, minibus: 1700, luxury: 2400 } }
];

export const TRANSFER_VEHICLE_OPTIONS: Array<{ value: TransferVehicleClass; trLabel: string; enLabel: string }> = [
  { value: "economic", trLabel: "Ekonomik", enLabel: "Economic" },
  { value: "vip", trLabel: "VIP / Vito", enLabel: "VIP / Vito" },
  { value: "minibus", trLabel: "Minibüs", enLabel: "Minibus" },
  { value: "luxury", trLabel: "Lüks", enLabel: "Luxury" }
];

export const initialTransferFormState: TransferFormState = {
  passengerName: "",
  passengerPhone: "",
  language: "en",
  airportCode: "BJV",
  flightCode: "",
  destination: TRANSFER_DESTINATION_OPTIONS[0].value,
  passengers: 1,
  bags: 1,
  pickupDate: "",
  pickupTime: "",
  vehicleClass: "economic"
};

export function createTransferRequestCode(): string {
  return generateRequestCode("transfer", Date.now() % 9000);
}

export function estimateTransferPrice(state: Pick<TransferFormState, "destination" | "vehicleClass" | "passengers">): number {
  const destination = TRANSFER_DESTINATION_OPTIONS.find((item) => item.value === state.destination) || TRANSFER_DESTINATION_OPTIONS[0];
  const basePrice = destination.prices[state.vehicleClass] || destination.prices.economic;
  const extraPassengerFee = state.passengers > 4 && state.vehicleClass === "economic" ? 300 : 0;
  return basePrice + extraPassengerFee;
}

export function validateTransferForm(state: TransferFormState): string | null {
  if (!state.destination.trim()) return "Destination is required.";
  if (!state.pickupDate.trim()) return "Pickup date is required.";
  if (!state.pickupTime.trim()) return "Pickup time is required.";
  if (state.passengers < 1) return "Passenger count must be at least 1.";
  if (!state.passengerName.trim()) return "Passenger name is required.";
  if (!state.passengerPhone.trim()) return "Passenger phone is required.";
  return null;
}
