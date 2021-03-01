import React, { useState, useContext } from "react";
import Product from "../component/Product";
import { p } from "../products";
import Stripe from "../component/stripe";
import Accounts from "../component/Accounts";
import file from "../files/EA_instructions.pdf";
import { UserC } from "../hook/user";

function Dashboard() {
  const [my, setMy] = useState(true);
  const [sp, setSp] = useState(null);
  const { user, removeAccount } = useContext(UserC);

  return (
    <div className="antialiased p-6">
      <nav className="flex items-center justify-between flex-wrap">
        <img
          alt="logo"
          width="80px"
          height="50px"
          src="https://www.dominateforex.info/wp-content/uploads/2020/04/cropped-C13AD53B-1FA1-4810-9042-A18E80BA7F94.jpeg"
        />
        <div>
          <a
            href="https://dominateforexhandsfree.s3.us-east-2.amazonaws.com/videohu.mp4"
            target="_blank"
            rel="noreferrer"
            className="mr-4 py-2 px-4 rounded font-bold text-pasha hover:border hover:border-black hover:shadow-outline"
          >
            Install Robot Video
          </a>
          <a
            href={file}
            target="_blank"
            rel="noreferrer"
            className="mr-4 py-2 px-4 rounded font-bold text-pasha hover:border hover:border-black hover:shadow-outline"
          >
            How to use
          </a>
          <button
            className="bg-white hover:shadow-outline  hover:border hover:border-black focus:shadow-outline text-pasha focus:bg-white focus:text-pasha font-light py-2 px-4 rounded"
            type="button"
            //onclick="resetDemo()"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="flex flex-wrap justify-center mt-8">
        <div className="w-full md:w-11/12">
          <div className="text-center text-pasha font-bold text-2xl mt-4 mb-6">
            Subscribe to a plan
          </div>

          <div className="text-center mt-4 mb-8">
            <button
              className={
                my === true
                  ? "px-6 py-2 border border-pasha bg-pasha text-white rounded"
                  : "px-6 py-2 border border-pasha bg-white text-pasha rounded"
              }
              onClick={(e) => setMy(true)}
            >
              Monthly
            </button>
            <button
              className={
                my === false
                  ? "px-6 py-2 border border-pasha bg-pasha text-white rounded"
                  : "px-6 py-2 border border-pasha bg-white text-pasha rounded"
              }
              onClick={(e) => setMy(false)}
            >
              annually
            </button>
          </div>

          <div className="justify-between mb-8 grid grid-cols-2 md:grid-cols-4">
            {p.map((p, i) => (
              <Product key={i} p={p} sp={sp} my={my} s={() => setSp(p)} />
            ))}
          </div>

          {user && user.accounts.length > 0 && (
            <Accounts acc={user.accounts} rem={removeAccount} />
          )}
          {sp && <Stripe p={sp} my={my} />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
