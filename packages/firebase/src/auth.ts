import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { firebaseAuth } from "./client";

export type AuthUser = User;

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export function logoutCurrentUser() {
  return signOut(firebaseAuth);
}

export function listenToCurrentUser(callback: (user: AuthUser | null) => void) {
  return onAuthStateChanged(firebaseAuth, callback);
}

export function getCurrentAuthUser() {
  return firebaseAuth.currentUser;
}
