import { app } from "./firebase";
import {
  getFirestore,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import getStripe from "./initializeStripe";

export const createCheckoutSession = async (uid) => {
  const db = getFirestore(app);
  const docRef = collection(db, "members", uid, "checkout_sessions");
  const checkoutSessionRef = await addDoc(docRef, {
    lineItems: [{ price: "price_1NFbDjKxqE4k52I9tC0Esapp", quantity: 1 }],
    mode: "subscription",
    successUrl: window.location.origin,
    cancelUrl: window.location.origin,
  });

  // console.table(
  //   onSnapshot(checkoutSessionRef, async (snap) => {
  //     console.log(snap.id);
  //   })
  // );

  onSnapshot(checkoutSessionRef, async (snap) => {
    const sessionId = snap.data();
    console.log(sessionId);
    if (sessionId) {
      console.log(sessionId);
      const stripe = await getStripe();
      stripe.redirectToCheckout(sessionId);
    }
  });
};
