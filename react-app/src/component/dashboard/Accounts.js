import React, { useState } from "react";

function Accounts({ acc, remove, email }) {
  return (
    <div className="mt-8">
      <div className="text-gray-500 text-xl mb-2 mt-3 font-medium text-center">
        Accounts
      </div>
      <ul className="block accounts-ul mb-6 w-full justify-center mx-auto">
        {acc &&
          acc.map((i, ii) => (
            <Li index={ii} key={ii} i={i} remove={remove} email={email} />
          ))}
      </ul>
    </div>
  );
}

export default Accounts;

const Li = ({ index, i, remove, email }) => {
  const [rem, setRem] = useState(false);
  return (
    <li>
      <div className="flex items-center">
        Account Number: <span className="font-bold ml-1 mr-2">{i.name}</span>
        Server:
        <span className="font-bold mx-1">{i.server}</span>
        <button
          onClick={(e) => setRem(!rem)}
          className="ml-auto bg-white text-pasha border hover:border-pasha hover:shadow-outline hover:border focus:shadow-outline text-white focus:bg-white font-light py-0 px-2 rounded-md"
        >
          X
        </button>
      </div>
      {rem && (
        <div
          className="bg-red-100 text-red-700 px-4 py-2 rounded relative mt-2 mb-1"
          role="alert"
        >
          <span className="block sm:inline">
            This account will remove, if you have any handsfree robot in this
            account it'll remove
          </span>
          <button
            className="block mx-auto font-bold px-2"
            onClick={() => {
              remove(email, i.name, i.server, index);
              setRem(false);
            }}
          >
            Click here to accept
          </button>
        </div>
      )}
    </li>
  );
};
