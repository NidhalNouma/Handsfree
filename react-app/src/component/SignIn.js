import React, { useContext, useState } from "react";
import { UserC } from "../hook/user";

function SignIn({ rev }) {
  const user = useContext(UserC);
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <input
        className="my-3 appearance-none border-2 border-gray-200 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pasha"
        type="text"
        placeholder="Email address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-4 appearance-none border-2 border-gray-200 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pasha"
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {err && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3"
          role="alert"
        >
          <span className="block sm:inline">{err}</span>
        </div>
      )}
      <button
        className="w-full bg-pasha hover:bg-red-200 hover:shadow-outline rounded-md hover:text-pasha hover:border hover:border-black focus:shadow-outline text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded"
        onClick={(e) => user.login(email, password, setErr)}
      >
        <div id="loading" className="hidden">
          Signing up...
        </div>
        <span id="button-text">Sign up</span>
      </button>

      <button
        className="text-pasha outline-none mt-3 px-2 float-right"
        onClick={rev}
      >
        Register
      </button>
    </div>
  );
}

export default SignIn;
