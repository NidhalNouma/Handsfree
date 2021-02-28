import React from "react";

function Register({ rev }) {
  return (
    <div>
      <input
        className="my-3 appearance-none border-2 border-gray-200 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pasha"
        type="text"
        placeholder="Email address"
        required
      />
      <input
        className="mb-3 appearance-none border-2 border-gray-200 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pasha"
        type="password"
        placeholder="Password"
        required
      />
      <input
        className="mb-4 appearance-none border-2 border-gray-200 rounded-md w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-pasha"
        type="password"
        placeholder="Confirm Password"
        required
      />

      <button
        className="w-full bg-pasha hover:bg-red-200 hover:shadow-outline rounded-md hover:text-pasha hover:border hover:border-black focus:shadow-outline text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded"
        type="submit"
      >
        <span id="button-text">Register</span>
      </button>

      <button
        className="text-pasha outline-none mt-3 px-2 float-right"
        onClick={rev}
      >
        Login
      </button>
    </div>
  );
}

export default Register;
