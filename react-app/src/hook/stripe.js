import axios from "axios";

export const createSub = async (
  userId,
  customerId,
  paymentMethodId,
  priceId,
  setUser,
  coupon = ""
) => {
  console.log("Create Subscription ...");
  try {
    const r = await axios.post("/create-subscription", {
      userId,
      customerId,
      paymentMethodId,
      priceId,
      coupon,
    });
    console.log(r);
    if (r.data && r.data.newUser && r.data.newUser.res)
      setUser(r.data.newUser.res);
  } catch (e) {
    console.error("Create Subscription .", e);
  }
};

export const cancelSub = async (subscriptionId, user, setUser) => {
  console.log("cancel Subscription ...");
  setUser({ ...user, subs: user.subs.filter((i) => i.id !== subscriptionId) });
  try {
    const r = await axios.post("/cancel-subscription", {
      subscriptionId,
    });
    console.log(r);
  } catch (e) {
    console.error("cancel Subscription .", e);
  }
};

export const checkCoupon = async (coupon, setCoupon, price, setPrice) => {
  if (coupon.load) return;
  if (coupon.value === "") {
    setCoupon({ ...coupon, err: "Invalid coupon" });
    return;
  }
  setCoupon({ ...coupon, err: "", load: true });
  console.log("Checking coupon ... ", coupon.value);
  try {
    const r = await axios.post("/check-coupon", {
      coupon: coupon.value,
    });

    if (r.data.err && r.data.err.raw) {
      setCoupon({ ...coupon, err: r.data.err.raw.message, load: false });
      setPrice({ ...price, new: -1 });
      return;
    } else if (r.data.res) {
      let np = -1;
      const off = r.data.res.percent_off;
      const aoff = r.data.res.amount_off;
      if (off) {
        np = price.old - (price.old * off) / 100;
      } else if (aoff && aoff > 0) {
        np = price.old - aoff;
        if (np < 0) np = 0;
      }
      setPrice({ ...price, new: np });
    }
  } catch (e) {
    console.error("Checcking coupon .", e);
  }
  setCoupon({ ...coupon, load: false, err: "" });
};

export const addPaymMethod = async function (paymentMethod, user, setUser) {
  console.log("Adding Payment Method ...");
  try {
    const r = await axios.post("/add-payment-method", {
      customerId: user.customerId,
      paymentMethodId: paymentMethod.id,
    });
    console.log(r);
    setUser({
      ...user,
      paymentMethods: [paymentMethod, ...user.paymentMethods],
    });
  } catch (e) {
    console.error("Adding Payment Method Subscription .", e);
  }
};
