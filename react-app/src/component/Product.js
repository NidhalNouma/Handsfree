import React from "react";

function Product({ p, my, s, sp }) {
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
          <button
            onClick={s}
            className="w-10/12 bg-pasha hover:bg-white outline-none hover:text-pasha hover:border hover:border-black text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-lg"
          >
            <div className="w-auto -mx-2 md:mx-0">
              {sp && p.title === sp.title ? "Selected" : "Select"}
            </div>
          </button>
          <button
            className="hidden bg-pasha hover:bg-white outline-none hover:text-pasha hover:border hover:border-black text-white focus:bg-white focus:text-pasha font-light py-2 px-4 rounded-lg"
            type="submit"
          >
            <div className="w-auto -mx-2 md:mx-0">Download</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
