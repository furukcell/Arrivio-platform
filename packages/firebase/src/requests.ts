import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import type {
  TransferRequest,
  CarRentalRequest,
  HotelRequest,
  TicketRequest
} from "@arrivio/shared";
import { firestoreDb } from "./client";
import { COLLECTIONS } from "./collections";

type CreateTransferPayload = Omit<TransferRequest, "id" | "createdAt" | "updatedAt">;
type CreateCarRentalPayload = Omit<CarRentalRequest, "id" | "createdAt" | "updatedAt">;
type CreateHotelPayload = Omit<HotelRequest, "id" | "createdAt" | "updatedAt">;
type CreateTicketPayload = Omit<TicketRequest, "id" | "createdAt" | "updatedAt">;

function withTimestamps<T extends object>(payload: T) {
  return {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

export async function createTransferRequest(payload: CreateTransferPayload) {
  return addDoc(collection(firestoreDb, COLLECTIONS.transferRequests), withTimestamps(payload));
}

export async function listTransferRequests(maxItems = 50): Promise<TransferRequest[]> {
  const transferQuery = query(
    collection(firestoreDb, COLLECTIONS.transferRequests),
    orderBy("createdAt", "desc"),
    limit(maxItems)
  );
  const snapshot = await getDocs(transferQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as TransferRequest) }));
}

export async function createCarRentalRequest(payload: CreateCarRentalPayload) {
  return addDoc(collection(firestoreDb, COLLECTIONS.carRentalRequests), withTimestamps(payload));
}

export async function createHotelRequest(payload: CreateHotelPayload) {
  return addDoc(collection(firestoreDb, COLLECTIONS.hotelRequests), withTimestamps(payload));
}

export async function createTicketRequest(payload: CreateTicketPayload) {
  return addDoc(collection(firestoreDb, COLLECTIONS.ticketRequests), withTimestamps(payload));
}
