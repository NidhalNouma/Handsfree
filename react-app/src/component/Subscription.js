import React, { useState, useContext } from "react";
import { UserC } from "../hook/user";
import { p } from "../products";
import Payment from "./Payment";
import { cancelSub } from "../hook/stripe";

function Subscription({ subs }) {
  return (
    <div>
      <div className="mt-8">
        <div className="text-gray-500 text-xl mb-2 mt-3 font-medium text-center">
          Your Subscriptions
        </div>
        <ul className="block accounts-ul mb-6 w-full sm:w-9/12 lg:w-6/12 justify-center mx-auto">
          {subs && subs.map((i, ii) => <Li index={ii} key={ii} i={i} />)}
        </ul>
      </div>
    </div>
  );
}

export default Subscription;

const Li = ({ i }) => {
  const { user, setUser } = useContext(UserC);
  const [more, setMore] = useState(false);
  const [rem, setRem] = useState(false);
  const [chp, setChp] = useState(false);
  let pr = "";
  p.forEach((ii) => {
    if (ii.nameP === i.price || ii.namePY === i.price) pr = ii.name;
  });
  return (
    <li>
      <div className="flex items-center">
        <span className="font-bold mx-1 text-pasha">{pr}</span>
        renews
        <span className="text-pasha ml-1 mr-2">
          {new Date(i.end * 1000).getDay().toString()}/
          {new Date(i.end * 1000).getMonth().toString()}/
          {new Date(i.end * 1000).getFullYear().toString()}
        </span>
        <button
          onClick={(e) => setMore(!more)}
          className="font-light text-sm text-pasha underline"
        >
          {more ? "Hide" : "more"}
        </button>
      </div>

      {more && (
        <div
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded relative mt-2 mb-1"
          role="alert"
        >
          <p className="my-0">
            <span className="font-bold">{i.interval}</span> subscription, start
            on
            <span className="text-pasha ml-1 mr-2">
              {new Date(i.start * 1000).getDay().toString()}/
              {new Date(i.start * 1000).getMonth().toString()}/
              {new Date(i.start * 1000).getFullYear().toString()}
            </span>
          </p>
          <p className="my-0">
            status: <span className="font-bold">{i.status}</span>
          </p>
          <p className="my-0">
            price:{" "}
            <span className="font-bold text-sm">
              ${i.amount / 100}/{i.interval}
            </span>
          </p>
          <div>
            <div className="flex">
              <button className="text-pasha" onClick={() => setChp(!chp)}>
                change payment method
              </button>

              <button
                onClick={(e) => setRem(!rem)}
                className="ml-auto text-pasha border hover:border-pasha hover:shadow-outline hover:border focus:shadow-outline text-white font-light py-0 px-2 rounded-md"
              >
                X
              </button>
            </div>
            {chp && <Payment pay={user.paymentMethods} change={true} />}
          </div>
        </div>
      )}
      {rem && (
        <div
          className="bg-red-100 text-red-700 px-4 py-2 rounded relative mt-2 mb-1"
          role="alert"
        >
          <span className="block sm:inline">
            Cancel subscription, all <span className="font-bold">{pr}</span>{" "}
            robots will be removed from your accounts.
          </span>
          <button
            className="block mx-auto font-bold px-2"
            onClick={() => {
              setRem(false);
              setMore(false);
              cancelSub(i.id, user, setUser);
            }}
          >
            Click here to accept
          </button>
        </div>
      )}
    </li>
  );
};
