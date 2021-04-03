import React, { useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { UserC } from "../hook/user";

function ResetPassword() {
  const { email } = useParams();
  const user = useContext(UserC);
  const [err, setErr] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const history = useHistory();
  const setDone = () => {
    history.push("/");
  };

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
            Reset Password
          </div>
          <div>
            <div>
              <input
                disabled
                className="my-3 opacity-75 cursor-not-allowed appearance-none border-2 border-gray-200 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-200"
                type="email"
                placeholder="Email address"
                required
                value={email}
              />
              <input
                className="mb-3 appearance-none border-2 border-gray-200 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pasha"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                className="mb-4 appearance-none border-2 border-gray-200 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pasha"
                type="password"
                placeholder="Confirm Password"
                required
                value={cpassword}
                onChange={(e) => setCPassword(e.target.value)}
              />
              {err && (
                <div
                  className="bg-red-100 text-red-700 px-4 py-2 rounded relative mb-3"
                  role="alert"
                >
                  <span className="block sm:inline">{err}</span>
                </div>
              )}
              <button
                className="w-full bg-pasha hover:shadow-outline focus:shadow-outline text-white font-light py-2 px-4 rounded"
                onClick={(e) =>
                  user.resetPassword(
                    email,
                    password,
                    cpassword,
                    setErr,
                    setDone
                  )
                }
              >
                <div id="loading" className="hidden">
                  Submit ...
                </div>
                <span id="button-text">Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
