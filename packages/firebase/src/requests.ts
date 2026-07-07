import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import type {
  TransferRequest,
  TransferStatus,
  CommissionStatus,
  CarRentalRequest,
  CarRentalStatus,
  HotelRequest,
  HotelStatus,
  TicketRequest,
  TicketStatus
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

export type UpdateTransferStatusPayload = {
  requestId: string;
  status: TransferStatus;
  providerNote?: string;
};

export type UpdateTransferCommissionPayload = {
  requestId: string;
  estimatedTotalPrice: number;
  commissionAmount: number;
  commissionStatus: CommissionStatus;
  adminNote?: string;
};

export type UpdateLeadStatusPayload<TStatus extends string> = {
  requestId: string;
  status: TStatus;
  adminNote?: string;
};

function withTimestamps<T extends object>(payload: T) {
  return {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function leadStatusUpdate<TStatus extends string>(status: TStatus, adminNote?: string) {
  return {
    status,
    adminNote: adminNote || "",
    updatedAt: serverTimestamp()
  };
}

async function getRequestById<TRequest>(collectionName: string, requestId: string): Promise<TRequest | null> {
  const requestRef = doc(firestoreDb, collectionName, requestId);
  const snapshot = await getDoc(requestRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...(snapshot.data() as TRequest) };
}

export async function createTransferRequest(payload: CreateTransferPayload) {
  return addDoc(collection(firestoreDb, COLLECTIONS.transferRequests), withTimestamps(payload));
}

export async function getTransferRequest(requestId: string): Promise<TransferRequest | null> {
  return getRequestById<TransferRequest>(COLLECTIONS.transferRequests, requestId);
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

export async function listTransferRequestsForProvider(providerId: string, maxItems = 50): Promise<TransferRequest[]> {
  const transferQuery = query(
    collection(firestoreDb, COLLECTIONS.transferRequests),
    where("assignedProviderId", "==", providerId),
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

export async function updateTransferStatus(payload: UpdateTransferStatusPayload) {
  const transferRef = doc(firestoreDb, COLLECTIONS.transferRequests, payload.requestId);
  return updateDoc(transferRef, {
    status: payload.status,
    providerNote: payload.providerNote || "",
    updatedAt: serverTimestamp()
  });
}

export async function updateTransferCommission(payload: UpdateTransferCommissionPayload) {
  const transferRef = doc(firestoreDb, COLLECTIONS.transferRequests, payload.requestId);
  return updateDoc(transferRef, {
    estimatedTotalPrice: payload.estimatedTotalPrice,
    commissionAmount: payload.commissionAmount,
    commissionStatus: payload.commissionStatus,
    adminNote: payload.adminNote || "",
    updatedAt: serverTimestamp()
  });
}

export async function createCarRentalRequest(payload: CreateCarRentalPayload) {
  return addDoc(collection(firestoreDb, COLLECTIONS.carRentalRequests), withTimestamps(payload));
}

export async function getCarRentalRequest(requestId: string): Promise<CarRentalRequest | null> {
  return getRequestById<CarRentalRequest>(COLLECTIONS.carRentalRequests, requestId);
}

export async function listCarRentalRequests(maxItems = 50): Promise<CarRentalRequest[]> {
  const carRentalQuery = query(
    collection(firestoreDb, COLLECTIONS.carRentalRequests),
    orderBy("createdAt", "desc"),
    limit(maxItems)
  );
  const snapshot = await getDocs(carRentalQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as CarRentalRequest) }));
}

export async function updateCarRentalStatus(payload: UpdateLeadStatusPayload<CarRentalStatus>) {
  const requestRef = doc(firestoreDb, COLLECTIONS.carRentalRequests, payload.requestId);
  return updateDoc(requestRef, leadStatusUpdate(payload.status, payload.adminNote));
}

export async function createHotelRequest(payload: CreateHotelPayload) {
  return addDoc(collection(firestoreDb, COLLECTIONS.hotelRequests), withTimestamps(payload));
}

export async function getHotelRequest(requestId: string): Promise<HotelRequest | null> {
  return getRequestById<HotelRequest>(COLLECTIONS.hotelRequests, requestId);
}

export async function listHotelRequests(maxItems = 50): Promise<HotelRequest[]> {
  const hotelQuery = query(
    collection(firestoreDb, COLLECTIONS.hotelRequests),
    orderBy("createdAt", "desc"),
    limit(maxItems)
  );
  const snapshot = await getDocs(hotelQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as HotelRequest) }));
}

export async function updateHotelStatus(payload: UpdateLeadStatusPayload<HotelStatus>) {
  const requestRef = doc(firestoreDb, COLLECTIONS.hotelRequests, payload.requestId);
  return updateDoc(requestRef, leadStatusUpdate(payload.status, payload.adminNote));
}

export async function createTicketRequest(payload: CreateTicketPayload) {
  return addDoc(collection(firestoreDb, COLLECTIONS.ticketRequests), withTimestamps(payload));
}

export async function getTicketRequest(requestId: string): Promise<TicketRequest | null> {
  return getRequestById<TicketRequest>(COLLECTIONS.ticketRequests, requestId);
}

export async function listTicketRequests(maxItems = 50): Promise<TicketRequest[]> {
  const ticketQuery = query(
    collection(firestoreDb, COLLECTIONS.ticketRequests),
    orderBy("createdAt", "desc"),
    limit(maxItems)
  );
  const snapshot = await getDocs(ticketQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as TicketRequest) }));
}

export async function updateTicketStatus(payload: UpdateLeadStatusPayload<TicketStatus>) {
  const requestRef = doc(firestoreDb, COLLECTIONS.ticketRequests, payload.requestId);
  return updateDoc(requestRef, leadStatusUpdate(payload.status, payload.adminNote));
}
