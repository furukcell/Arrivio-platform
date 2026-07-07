import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import type { Provider, ProviderType } from "@arrivio/shared";
import { firestoreDb } from "./client";
import { COLLECTIONS } from "./collections";

export type CreateProviderPayload = {
  type: ProviderType;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  notes?: string;
};

export async function createProvider(payload: CreateProviderPayload) {
  return addDoc(collection(firestoreDb, COLLECTIONS.providers), {
    ...payload,
    isVerified: false,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function listProviders(): Promise<Provider[]> {
  const providerQuery = query(collection(firestoreDb, COLLECTIONS.providers), orderBy("name", "asc"));
  const snapshot = await getDocs(providerQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Provider) }));
}

export function filterTransferProviders(providers: Provider[]): Provider[] {
  return providers.filter((provider) => provider.type === "transfer" && provider.isActive !== false);
}
