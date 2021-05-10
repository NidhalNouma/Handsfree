import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

function Paypal({ p, my }) {
  console.log("product => ", p);
  const [planId, setPlanId] = useState(my ? p.paypal : p.paypalY);
  useEffect(() => {
    setPlanId(my ? p.paypal : p.paypalY);
  }, [p]);

  return (
    <div className="mt-4 text-center">
      {planId && (
        <PayPalScriptProvider
          options={{
            "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
            vault: true,
            intent: "subscription",
          }}
        >
          <PayPalButtons
            style={{
              color: "silver",
              size: "large",
              label: "subscribe",
              layout: "horizontal",
              tagline: false,
            }}
            createSubscription={(order, action) =>
              action.subscription.create({
                plan_id: planId,
              })
            }
            onApprove={(data, actions) => {
              axios
                .post(
                  `/paypal/subscribe/succes?id=${data.subscriptionID}&type=${p.name}`
                )
                .then((r) => {
                  console.log(r);
                });
              // alert("You have successfully created subscription "); // Optional message given to subscriber
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
}

export default Paypal;
