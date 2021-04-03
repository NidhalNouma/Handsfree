import React, { useState } from "react";
import SignIn from "../component/SignIn";
import Register from "../component/Register";
import video from "../files/video.mp4";

function Welcom() {
  const [login, setLogin] = useState(true);
  const setLoginFn = () => setLogin(!login);

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
          <div className="flex items-center mb-8 w-full">
            <video
              width="320"
              height="240"
              className="flex-1 w-24 vid"
              muted
              autoPlay
              loop
              controls
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="text-pasha font-semibold text-xl mb-4 text-center">
            Subscribe to the DominateForex HandsFree Robot. Cancel anytime.
          </div>
          {login ? <SignIn rev={setLoginFn} /> : <Register rev={setLoginFn} />}
        </div>
      </div>
    </div>
  );
}

export default Welcom;
