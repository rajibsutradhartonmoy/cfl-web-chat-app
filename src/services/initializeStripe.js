import { stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise;
const getStripe = async () => {
  if (!stripePromise) {
    alert(process.env.REACT_APP_STRIPE_KEY);
    stripePromise = await loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`);
    return stripePromise;
  }
};

export default getStripe;
