import React, { useContext } from "react";
// import Checkout from "./CardMinimul";
import Payment from "../Payment";
import { UserC } from "../../hook/user";

function Index({ p, my, close }) {
  const { user } = useContext(UserC);
  return (
    <div>
      <div className="flex justify-center ">
        <div className="w-full inline-block border p-4 rounded-md">
          <div className="flex justify-between">
            <div className="font-bold text-xl mb-2">
              Enter your card details. <br />
              Your subscription will start now.
            </div>
            <button
              onClick={close}
              className="h-7 bg-white text-pasha border hover:border-pasha hover:shadow-outline hover:border focus:shadow-outline text-white focus:bg-white font-light py-0 px-2 rounded-md"
            >
              X
            </button>
          </div>
          <p className="text-gray-700 text-base">
            → Total due now <span>${my ? p.priceM : p.priceY}</span>
            <span className="spanCou"></span>
          </p>
          <p className="text-gray-700 text-base mb-4">
            → Subscribing to <span className="font-bold">{p.name}</span>
          </p>

          <div className="w-full">
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className=" px-3 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Coupon
                </label>
                <input
                  className="appearance-none block bg-gray-200 border rounded-md py-3 px-2 mb-3 leading-tight focus:outline-none"
                  type="text"
                  placeholder="Coupon code"
                  required
                />
                <button className="bg-pasha hover:shadow-outline hover:border hover:border-black focus:shadow-outline text-white font-light py-2 px-4 rounded-md">
                  <span>Check coupon</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full px-3 mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Card
                </label>
                <Payment
                  my={my}
                  p={p}
                  pay={user.paymentMethods}
                  close={close}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
