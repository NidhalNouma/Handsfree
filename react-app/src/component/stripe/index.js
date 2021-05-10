import React, { useContext, useState, useEffect } from "react";
import Payment from "../Payment";
import { UserC } from "../../hook/user";
import { checkCoupon } from "../../hook/stripe";

function Index({ p, my, close }) {
  const { user } = useContext(UserC);
  const [coupon, setCoupon] = useState({ value: "", err: "", load: false });
  const [price, setPrice] = useState({
    old: my ? p.priceM : p.priceY,
    new: -1,
  });

  useEffect(() => {
    setPrice({ old: my ? p.priceM : p.priceY, new: -1 });
  }, [p, my]);

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
              className="h-7 bg-white text-pasha border hover:border-pasha hover:shadow-outline hover:border focus:shadow-outline focus:bg-white font-light py-0 px-2 rounded-md"
            >
              X
            </button>
          </div>
          <p className="text-gray-700 text-base">
            → Total due now{" "}
            <span className={price.new >= 0 ? "line-through" : "text-pasha"}>
              ${price.old}
            </span>
            {price.new >= 0 && (
              <span className="font-bold text-pasha ml-1">${price.new}</span>
            )}
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
                  className="appearance-none block bg-gray-200 border rounded-md py-2 px-2 mb-3 leading-tight focus:outline-none"
                  type="text"
                  placeholder="Coupon code"
                  value={coupon.value}
                  onChange={(e) =>
                    setCoupon({ ...coupon, value: e.target.value })
                  }
                />
                {coupon.err && (
                  <div
                    className="bg-red-100 text-red-600 px-4 py-1 rounded relative my-2"
                    role="alert"
                  >
                    <span className="block sm:inline text-sm">
                      {coupon.err}
                    </span>
                  </div>
                )}
                <button
                  onClick={(e) =>
                    checkCoupon(coupon, setCoupon, price, setPrice)
                  }
                  className="bg-pasha hover:shadow-outline hover:border hover:border-black focus:shadow-outline text-white font-light py-2 px-4 rounded-md"
                >
                  <span>{coupon.load ? "Checking ..." : "Check coupon"}</span>
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
                  coupon={coupon.value}
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
