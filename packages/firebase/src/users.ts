import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { AppUser, UserRole } from "@arrivio/shared";
import { getFirestoreDb } from "./client";
import { COLLECTIONS } from "./collections";

export type UpsertAppUserPayload = {
  uid: string;
  role: UserRole;
  providerId?: string;
  email?: string;
  displayName?: string;
};

export async function getAppUserByUid(uid: string): Promise<AppUser | null> {
  const userRef = doc(getFirestoreDb(), COLLECTIONS.users, uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...(snapshot.data() as AppUser) };
}

export async function upsertAppUser(payload: UpsertAppUserPayload) {
  const userRef = doc(getFirestoreDb(), COLLECTIONS.users, payload.uid);
  return setDoc(userRef, {
    ...payload,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export function isProviderUser(user: AppUser | null): boolean {
  return user?.role === "provider" && Boolean(user.providerId);
}

export function isAdminUser(user: AppUser | null): boolean {
  return user?.role === "admin";
}
