import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "./client";

export type AuthUser = User;

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export function logoutCurrentUser() {
  return signOut(getFirebaseAuth());
}

export function listenToCurrentUser(callback: (user: AuthUser | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export function getCurrentAuthUser() {
  return getFirebaseAuth().currentUser;
}
