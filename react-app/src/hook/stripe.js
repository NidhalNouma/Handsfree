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
