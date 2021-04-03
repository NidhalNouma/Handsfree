import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserC } from "../hook/user";

function ForgetPassword() {
  const user = useContext(UserC);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="antialiased p-6">
      <nav className="flex items-center justify-between flex-wrap">
        <img
          width="80px"
          height="50px"
          src="https://www.dominateforex.info/wp-content/uploads/2020/04/cropped-C13AD53B-1FA1-4810-9042-A18E80BA7F94.jpeg"
          alt="logo"
        />
      </nav>
      <div className="flex justify-center">
        <div className="w-full max-w-sm m-6">
          <div className="text-pasha font-semibold text-xl mb-4 text-center">
            Forget Password?
          </div>
          <div>
            <div>
              <input
                className="my-3 appearance-none border-2 border-gray-200 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pasha"
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {err && (
                <div
                  className="bg-red-100 text-red-700 px-4 py-2 rounded relative mb-3"
                  role="alert"
                >
                  <span className="block sm:inline">{err}</span>
                </div>
              )}
              {done && (
                <div
                  className="bg-green-100 text-green-700 px-4 py-2 rounded relative mb-3"
                  role="alert"
                >
                  <span className="block sm:inline">
                    Please check your email
                  </span>
                </div>
              )}
              <button
                className="w-full bg-pasha hover:shadow-outline focus:shadow-outline text-white font-light py-2 px-4 rounded"
                onClick={(e) => user.forgetPassword(email, setErr, setDone)}
              >
                <div id="loading" className="hidden">
                  Submit ...
                </div>
                <span id="button-text">Submit</span>
              </button>

              <Link
                className="text-pasha outline-none mt-3 px-2 float-left"
                to="/"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
