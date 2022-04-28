import React, { useContext, useState } from "react";
import { UserC } from "../../hook/user";
import { Dash } from "../../hook/Dash";

import Accounts from "./Accounts";
import Subscription from "./Subscription";

function Dashboard() {
  const { user } = useContext(UserC);
  const { allusers, addUser, removeAccount, setShown } = Dash(user);

  return (
    <div className="mt-8">
      <div className="text-gray-500 text-xl mb-2 mt-3 font-medium text-center">
        Admin dashboard
      </div>
      <h1 className="text-center text-gray-500 text-xl mt-4">Users</h1>
      <Add add={addUser} />
      <ul className="block accounts-ul mb-6 w-full sm:w-9/12 lg:w-6/12 justify-center mx-auto">
        {allusers &&
          allusers.map((i, ii) => (
            <Li
              index={ii}
              key={ii}
              i={i}
              remove={removeAccount}
              setShown={setShown}
            />
          ))}
      </ul>
    </div>
  );
}

export default Dashboard;

const Li = ({ index, i, remove, setShown }) => {
  const { user } = useContext(UserC);
  const [show, setShow] = useState(false);
  const hidden = !i.shown || i.shown === "1";

  return (
    <li>
      <div className="flex items-center">
        Email: <span className="font-bold ml-1 mr-2">{i.email}</span>
        <span className="font-bold mx-1">{i.server}</span>
        <button
          onClick={(e) => setShow(!show)}
          className="ml-auto text-pasha hover:shadow-outline focus:shadow-outline focus:bg-white font-light py-0 px-2 rounded-md"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {show && (
        <div>
          {i.subs.length > 0 && <Subscription subs={i.subs} user={i} />}
          {i.accounts.length > 0 && (
            <Accounts acc={i.accounts} remove={remove} email={i.email} />
          )}

          {user.admin === "1" && (
            <button
              onClick={async (e) => {
                if (hidden) await setShown(i.email, "2");
                else await setShown(i.email, "1");
              }}
              className="mt-2 ml-auto text-pasha hover:shadow-outline focus:shadow-outline focus:bg-white font-light py-0 rounded-md"
            >
              {hidden
                ? "Make user visible to other admins"
                : "Make user invisible to other admins"}
            </button>
          )}
        </div>
      )}
    </li>
  );
};

const Add = ({ add }) => {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);

  return (
    <div className="text-center">
      {!show ? (
        <button
          onClick={(e) => setShow(true)}
          className="ml-auto text-pasha hover:shadow-outline focus:shadow-outline focus:bg-white font-light py-0 px-2 rounded-md"
        >
          New user
        </button>
      ) : (
        <div className="">
          <input
            className="my-3 appearance-none border-2 border-gray-200 rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pasha"
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="bg-pasha hover:shadow-outline focus:shadow-outline text-white font-light py-2 px-4 rounded"
            onClick={async () => {
              if (!email) return;
              setLoad(true);
              await add(email, email);
              setEmail("");
              setLoad(false);
              setShow(false);
            }}
          >
            {load ? "Adding" : "Add"}
          </button>
        </div>
      )}
    </div>
  );
};
