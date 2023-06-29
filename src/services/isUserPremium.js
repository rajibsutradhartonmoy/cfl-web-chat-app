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
  const decodedToken = await auth.currentUser?.getIdTokenResult();
  console.log("decoded Token", decodedToken);
  return decodedToken?.claims?.stripeRole ? true : false;
};
