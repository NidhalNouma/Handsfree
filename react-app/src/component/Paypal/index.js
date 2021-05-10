import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

function Stripe({ p, my }) {
  console.log("product => ", p);

  return (
    <div className="mt-4 text-center">
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
              plan_id: my ? p.paypal : p.paypalY,
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
    </div>
  );
}

export default Stripe;
