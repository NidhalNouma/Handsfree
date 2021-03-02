import { useContext, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createSub } from "../../hook/stripe";
import { UserC } from "../../hook/user";
import Spinner from "../Spinner";
// import Payment from "../Payment";

const CheckoutForm = ({ my, p, pm, show, close, change }) => {
  const { user, setUser } = useContext(UserC);
  const [err, setErr] = useState("");
  const [spin, setSpin] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    if (spin) return;
    setErr("");
    setSpin(true);
    // Block native form submission.
    event.preventDefault();

    console.log(pm);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded
      setSpin(false);
      return;
    }
    if (show && !pm) {
      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardElement);

      // Use your card Element with other Stripe.js APIs
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        console.log("[error]", error);
        setSpin(false);
        return;
      }
      if (!pm) {
        pm = paymentMethod.id;
      }
      console.log("[PaymentMethod]", paymentMethod);
    }

    if (pm === null) {
      setErr("Invalid Card, Select a card");

      setSpin(false);
      return;
    }
    const priceId = my ? p.nameP : p.namePY;
    await createSub(user._id, user.customerId, pm, priceId, setUser);
    close();
    setSpin(false);
  };

  return (
    <div>
      {/* {user.paymentMethods.length > 0 && <Payment pay={user.paymentMethods} />} */}
      {show && (
        <div className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-md py-3 px-2 leading-tight focus:outline-none focus:bg-white">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      )}
      {err && (
        <div
          className="bg-red-100 text-red-700 px-4 py-2 rounded relative mb-0 mt-4"
          role="alert"
        >
          <span className="block sm:inline text-sm">{err}</span>
        </div>
      )}
      <button
        disabled={!stripe}
        className="relative mt-3 mb-2 w-full bg-pasha hover:shadow-outline hover:border hover:border-black focus:shadow-outline text-white font-light py-2 px-4 rounded-md"
        type="submit"
        onClick={handleSubmit}
      >
        {spin ? <Spinner /> : <span>{change ? "Change" : "Subscribe"}</span>}
      </button>
    </div>
  );
};

export default CheckoutForm;
