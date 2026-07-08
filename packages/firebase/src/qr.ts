import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import type { QrSource, QrSourceType } from "@arrivio/shared";
import { getFirestoreDb } from "./client";
import { COLLECTIONS } from "./collections";

export type CreateQrSourcePayload = {
  slug: string;
  title: string;
  type: QrSourceType;
  airportCode?: string;
  locationLabel?: string;
};

export type CreateQrEventPayload = {
  qrSourceId: string;
  slug: string;
  path: string;
  userAgent?: string;
};

export type QrEvent = CreateQrEventPayload & {
  id?: string;
  createdAt?: unknown;
};

export async function createQrSource(payload: CreateQrSourcePayload) {
  return addDoc(collection(getFirestoreDb(), COLLECTIONS.qrSources), {
    ...payload,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function listQrSources(maxItems = 100): Promise<QrSource[]> {
  const sourceQuery = query(collection(getFirestoreDb(), COLLECTIONS.qrSources), orderBy("slug", "asc"), limit(maxItems));
  const snapshot = await getDocs(sourceQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as QrSource) }));
}

export async function findQrSourceBySlug(slug: string): Promise<QrSource | null> {
  const sourceQuery = query(collection(getFirestoreDb(), COLLECTIONS.qrSources), where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(sourceQuery);
  if (snapshot.empty) return null;
  const first = snapshot.docs[0];
  return { id: first.id, ...(first.data() as QrSource) };
}

export async function recordQrEvent(payload: CreateQrEventPayload) {
  return addDoc(collection(getFirestoreDb(), COLLECTIONS.qrEvents), {
    ...payload,
    createdAt: serverTimestamp()
  });
}

export async function listRecentQrEvents(maxItems = 100): Promise<QrEvent[]> {
  const eventQuery = query(collection(getFirestoreDb(), COLLECTIONS.qrEvents), orderBy("createdAt", "desc"), limit(maxItems));
  const snapshot = await getDocs(eventQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as QrEvent) }));
}
