import { stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise;
const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = await loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);
    return stripePromise;
  }
};

export default getStripe;
