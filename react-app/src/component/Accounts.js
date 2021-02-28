import React from "react";

function Accounts() {
  return (
    <div>
      <div className="text-gray-500 text-xl mb-2 font-medium text-center">
        Your Accounts
      </div>
      <ul className="accounts-ul mb-6 w-full sm:w-9/12 lg:w-6/12 flex justify-center mx-auto">
        <li className="flex items-center">
          Account Number: <span className="font-bold ml-1 mr-2">12344555</span>
          Server:
          <span className="font-bold mx-1">TestServer</span>
          <button className="ml-auto bg-white text-pasha border hover:border-pasha hover:shadow-outline hover:border focus:shadow-outline text-white focus:bg-white font-light py-0 px-2 rounded-md">
            X
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Accounts;
