import { getAuth } from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

export const isUserPremium = async () => {
  const auth = getAuth();
  await auth.currentUser?.getIdToken(true);
  const decodeToken = auth.currentUser?.getIdTokenResult();
  return decodeToken?.claims?.stripeRole ? true : false;
};
