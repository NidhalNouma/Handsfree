import React from "react";

function Product({ p, my, s, sp, subs }) {
  const down = check(subs, p);
  return (
    <div className="w-2/2 rounded overflow-hidden border rounded-md p-2 mx-2 mb-3">
      <div className="px-2 py-2">
        <h3 className="text-gray-500 text-xl mb-2 font-medium">{p.title}</h3>
        <p className="text-pasha text-2xl font-extrabold">
          ${my ? p.priceM : p.priceY}
        </p>
        <div className="flex-wrap">
          <div className="leading-none text-gray-500 text-xs font-medium">
            <img src={"/images/" + p.img} alt="pimg" />
          </div>
          <div className="leading-none text-gray-500 text-xs font-medium mt-4">
            {my ? "Billed monthly" : "Billed annually"}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          {down ? (
            <form
              className="w-full flex"
              method="GET"
              action={"/Robot/" + p.dwnUrl}
            >
              <button className="w-10/12 py-2 px-4 m-auto text-pasha font-bold border border-pasha hover:bg-pasha hover:text-white focus:bg-pasha focus:text-white rounded">
                Download
              </button>
            </form>
          ) : (
            <button
              onClick={s}
              className={
                (sp && p.title === sp.title
                  ? "text-white bg-pasha"
                  : "text-pasha bg-white") +
                " w-10/12 border border-pasha hover:bg-pasha hover:text-white focus:text-white focus:bg-pasha font-light py-2 px-4 rounded"
              }
            >
              <div className="w-auto -mx-2 md:mx-0">
                {sp && p.title === sp.title ? "Selected" : "Select"}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;

function check(subs, p) {
  let r = false;
  subs.forEach((i) => {
    if (i.price === p.nameP || i.price === p.namePY) r = true;
  });
  return r;
}
