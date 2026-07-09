import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import type { CarRentalDailyPrice, HotelNightlyPrice, TransferRoutePrice } from "@arrivio/shared";
import { getFirestoreDb } from "./client";
import { COLLECTIONS } from "./collections";

export type CreateTransferRoutePricePayload = Omit<TransferRoutePrice, "id" | "createdAt" | "updatedAt">;
export type CreateCarRentalDailyPricePayload = Omit<CarRentalDailyPrice, "id" | "createdAt" | "updatedAt">;
export type CreateHotelNightlyPricePayload = Omit<HotelNightlyPrice, "id" | "createdAt" | "updatedAt">;

function sortByUpdatedAt<T extends { updatedAt?: unknown }>(items: T[]): T[] {
  return items;
}

export async function createTransferRoutePrice(payload: CreateTransferRoutePricePayload) {
  return addDoc(collection(getFirestoreDb(), COLLECTIONS.transferRoutePrices), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function createCarRentalDailyPrice(payload: CreateCarRentalDailyPricePayload) {
  return addDoc(collection(getFirestoreDb(), COLLECTIONS.carRentalDailyPrices), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function createHotelNightlyPrice(payload: CreateHotelNightlyPricePayload) {
  return addDoc(collection(getFirestoreDb(), COLLECTIONS.hotelNightlyPrices), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function listProviderTransferRoutePrices(providerId: string): Promise<TransferRoutePrice[]> {
  const priceQuery = query(collection(getFirestoreDb(), COLLECTIONS.transferRoutePrices), where("providerId", "==", providerId));
  const snapshot = await getDocs(priceQuery);
  return sortByUpdatedAt(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as TransferRoutePrice) })));
}

export async function listProviderCarRentalDailyPrices(providerId: string): Promise<CarRentalDailyPrice[]> {
  const priceQuery = query(collection(getFirestoreDb(), COLLECTIONS.carRentalDailyPrices), where("providerId", "==", providerId));
  const snapshot = await getDocs(priceQuery);
  return sortByUpdatedAt(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as CarRentalDailyPrice) })));
}

export async function listProviderHotelNightlyPrices(providerId: string): Promise<HotelNightlyPrice[]> {
  const priceQuery = query(collection(getFirestoreDb(), COLLECTIONS.hotelNightlyPrices), where("providerId", "==", providerId));
  const snapshot = await getDocs(priceQuery);
  return sortByUpdatedAt(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as HotelNightlyPrice) })));
}

export async function listPublicTransferRoutePrices(): Promise<TransferRoutePrice[]> {
  const priceQuery = query(
    collection(getFirestoreDb(), COLLECTIONS.transferRoutePrices),
    where("isActive", "==", true),
    where("isVerified", "==", true)
  );
  const snapshot = await getDocs(priceQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as TransferRoutePrice) }));
}

export async function listPublicCarRentalDailyPrices(): Promise<CarRentalDailyPrice[]> {
  const priceQuery = query(
    collection(getFirestoreDb(), COLLECTIONS.carRentalDailyPrices),
    where("isActive", "==", true),
    where("isVerified", "==", true)
  );
  const snapshot = await getDocs(priceQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as CarRentalDailyPrice) }));
}

export async function listPublicHotelNightlyPrices(): Promise<HotelNightlyPrice[]> {
  const priceQuery = query(
    collection(getFirestoreDb(), COLLECTIONS.hotelNightlyPrices),
    where("isActive", "==", true),
    where("isVerified", "==", true)
  );
  const snapshot = await getDocs(priceQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as HotelNightlyPrice) }));
}
