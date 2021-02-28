import React from "react";
import Checkout from "./CardMinimul";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_JJ1eMdKN0Hp4UFJ6kWXWO4ix00jtXzq5XG");

function Index({ p, my }) {
  return (
    <div>
      <div id="payment-form" class="flex justify-center ">
        <div class="w-full inline-block border p-4 rounded-md">
          <div class="font-bold text-xl mb-2">
            Enter your card details. <br />
            Your subscription will start now.
          </div>
          <p class="text-gray-700 text-base">
            → Total due now <span>${my ? p.priceM : p.priceY}</span>
            <span className="spanCou"></span>
          </p>
          <p className="text-gray-700 text-base mb-4">
            → Subscribing to <span className="font-bold">{p.name}</span>
          </p>

          <div className="w-full">
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className=" px-3 md:mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  Coupon
                </label>
                <input
                  class="appearance-none block bg-gray-200 border rounded-md py-3 px-2 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="coupon"
                  type="text"
                  placeholder="Coupon code"
                  required
                />
                <button
                  id="coupon-btn"
                  class="bg-pasha hover:bg-white hover:shadow-outline hover:text-pasha hover:border hover:border-black focus:shadow-outline text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-md"
                  type="submit"
                >
                  <div class="">
                    <div id="checking-cou" class="hidden">
                      Checking...
                    </div>
                    <span id="check-cou" class="">
                      Check coupon
                    </span>
                  </div>
                </button>
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-3">
              <div class="w-full px-3 mb-0">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  Card
                </label>
                <div class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded-md py-3 px-2 leading-tight focus:outline-none focus:bg-white">
                  <Elements stripe={stripePromise}>
                    <Checkout />
                  </Elements>
                </div>
              </div>
            </div>
            <button
              id="submit-premium"
              class="w-full bg-pasha hover:bg-white hover:shadow-outline hover:text-pasha hover:border hover:border-black focus:shadow-outline text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-md"
              type="submit"
            >
              <div class="">
                <div id="loading" class="hidden">
                  Subscribing...
                </div>
                <span id="button-text" class="">
                  Subscribe
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
