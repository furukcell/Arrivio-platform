import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
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

export type AssignTransferProviderPayload = {
  requestId: string;
  providerId: string;
  providerName: string;
};

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
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as TransferRequest) }));
}

export async function assignTransferProvider(payload: AssignTransferProviderPayload) {
  const transferRef = doc(firestoreDb, COLLECTIONS.transferRequests, payload.requestId);
  return updateDoc(transferRef, {
    assignedProviderId: payload.providerId,
    providerName: payload.providerName,
    status: "provider_pending",
    updatedAt: serverTimestamp()
  });
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
