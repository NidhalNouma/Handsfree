import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./stripe/CardMinimul";

import Visa from "./svg/Visa";
import Mastercard from "./svg/Mastercard";
import Paypal from "./Paypal";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Payment({ pay, my, p, close, change = false, coupon }) {
  const [ne, setNe] = useState(pay.length > 0 ? false : true);
  const [pm, setPm] = useState(null);
  return (
    <>
      <div className="mt-1 mb-1">
        {pay.map((i, ii) => (
          <Card key={ii} i={i} set={setPm} pm={pm} />
        ))}
        {pay.length > 0 && (
          <button onClick={(e) => setNe(!ne)} className="mt-2 text-pasha">
            {!ne ? "Add new card" : "Hide new card"}
          </button>
        )}
      </div>
      <Elements stripe={stripePromise}>
        <Checkout
          my={my}
          p={p}
          pm={pm}
          setPm={setPm}
          show={ne}
          setShow={setNe}
          close={close}
          change={change}
          coupon={coupon}
        />
      </Elements>
      {p && (
        <div>
          <h4>Or</h4>
          <Paypal p={p} my={my} />
        </div>
      )}
    </>
  );
}

export default Payment;

const Card = ({ i, set, pm }) => {
  return (
    <div
      onClick={() => set(i.id)}
      className={
        (pm === i.id ? "bg-gray-300" : "") +
        " py-2 px-1 border border-gray-300 rounded my-2 cursor cursor-pointer hover:bg-gray-300 flex items-center"
      }
    >
      <span className="ml-1 my-2 py-2 px-3 bg-gray-500 text-white rounded">
        {i.card.brand === "visa" ? (
          <Visa />
        ) : i.card.brand === "mastercard" ? (
          <Mastercard />
        ) : (
          i.card.brand
        )}
      </span>

      <div className="flex flex-col mx-4 items-start">
        <span className="text-sm"> ****{i.card.last4} </span>
        <span className="text-gray-400">
          Expire on {i.card.exp_month}/{i.card.exp_year}
        </span>
      </div>
    </div>
  );
};
