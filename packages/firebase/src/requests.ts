import type {
  TransferRequest,
  CarRentalRequest,
  HotelRequest,
  TicketRequest
} from "@arrivio/shared";

export async function createTransferRequest(
  payload: Omit<TransferRequest, "id" | "createdAt" | "updatedAt">
) {
  return { id: payload.requestCode };
}

export async function createCarRentalRequest(
  payload: Omit<CarRentalRequest, "id" | "createdAt" | "updatedAt">
) {
  return { id: payload.requestCode };
}

export async function createHotelRequest(
  payload: Omit<HotelRequest, "id" | "createdAt" | "updatedAt">
) {
  return { id: payload.requestCode };
}

export async function createTicketRequest(
  payload: Omit<TicketRequest, "id" | "createdAt" | "updatedAt">
) {
  return { id: payload.requestCode };
}
