require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const userSchema = new Schema({
  customerId: { type: String },
  stripe: {},
  subs: [],
  paymentMethods: [],
  email: {
    type: String,
    required: [true, "Email is require"],
    unique: [true, "Email exist"],
  },
  password: { type: String, required: true },
  rememberToken: { type: String },
  createdAt: { type: Date, default: Date.now() },
  accounts: [
    {
      name: { type: String },
      server: { type: String },
      result: { type: [], default: [] },
      show: { type: Boolean, default: true },
    },
  ],
});

userSchema.post("findOne", async function (res) {
  // res.customerId = "cus_IuFu90sFYKSbBf";
  if (res && res.customerId) {
    const cusP = stripe.customers.retrieve(res.customerId);
    const subscriptionsP = stripe.subscriptions.list({
      customer: res.customerId,
    });
    const paymethP = stripe.paymentMethods.list({
      customer: res.customerId,
      type: "card",
    });
    const [cus, subscriptions, paymeth] = await Promise.all([
      cusP,
      subscriptionsP,
      paymethP,
    ]);
    res["stripe"] = cus;
    if (subscriptions && subscriptions.data && subscriptions.data.length > 0) {
      const { data } = subscriptions;
      const sub = data.map((i) => {
        let price = null;
        for (v in process.env) {
          if (process.env[v] === i.plan.id) price = v;
        }
        return {
          created: i.created,
          start: i.current_period_start,
          end: i.current_period_end,
          amount: i.plan.amount,
          status: i.status,
          id: i.id,
          price: price,
          interval: i.plan.interval,
        };
      });
      res["subs"] = sub;
    }
    if (paymeth) {
      const { data } = paymeth;
      if (data) res.paymentMethods = data;
    }
  }
});

const User = model("User", userSchema);

const addUser = async function (email, password) {
  const r = { res: null, err: null };

  try {
    let customer = await stripe.customers.list({ email });

    if (customer.data.length === 0) {
      customer = await stripe.customers.create({ email });
    } else {
      customer = customer.data[0];
    }
    const user = new User({ email, password, customerId: customer.id });
    r.res = await user.save();
  } catch (err) {
    console.log(err);
    r.err = "Email Exist";
  }

  console.log("adding new user ... ", r.err);
  return r;
};

const findOne = async function (email, password) {
  const r = { res: null, err: null };

  try {
    r.res = await User.findOne(
      { email, password },
      {
        password: 0,
        createdAt: 0,
      }
    );
  } catch (err) {
    r.err = err.message;
  }

  console.log("Finding user ... ", r.err);
  return r;
};

const findByEmail = async function (email) {
  const r = { res: null, err: null };

  try {
    r.res = await User.findOne({ email }).select("-password -createdAt -_id");
  } catch (err) {
    r.err = err.message;
  }

  console.log("Finding user by email ... ", r.err);
  return r;
};

const findByToken = async function (rememberToken) {
  const r = { res: null, err: null };

  try {
    r.res = await User.findOne({ rememberToken }).select("-password");
  } catch (err) {
    r.err = err.message;
  }

  console.log("Finding user by token ... ", r.err);
  return r;
};

const findById = async function (_id) {
  const r = { res: null, err: null };

  try {
    r.res = await User.findOne({ _id }).select("-password");
  } catch (err) {
    r.err = err.message;
  }

  console.log("Finding user by ID ... ", r.err);
  return r;
};

const findAccount = async function (email, account) {
  const r = { res: null, err: null };

  try {
    r.res = await User.findOne({ email, "accounts.name": account }).select(
      "-password -accounts.result -accounts.show -subs -stripe -paymentMethods"
    );
  } catch (err) {
    r.err = err.message;
  }

  console.log("Finding user account(ip) ... ", r.err);
  return r;
};

const addAccount = async function (email, name, server) {
  const r = { res: null, err: null };

  try {
    const f = await User.findOne({
      email,
      "accounts.name": name,
      "accounts.server": server,
    });
    if (f) {
      r.res = null;
    } else {
      r.res = await User.updateOne(
        { email },
        { $push: { accounts: { name, server } } }
      );
    }
  } catch (err) {
    r.err = err.message;
  }

  console.log("Adding account to user ... ", r.err);
  return r;
};

const hideAccount = async function (email, name, server) {
  const r = { res: null, err: null };

  try {
    r.res = await User.updateOne(
      {
        email,
        "accounts.name": name,
        "accounts.server": server,
      },
      { $pull: { accounts: { name, server } } }
    );
  } catch (err) {
    r.err = err.message;
  }

  console.log("Hiding account to user ... ", r.err);
  return r;
};

const addResult = async function (email, name, result) {
  const r = { res: null, err: null };

  try {
    r.res = await User.updateOne(
      { email, "accounts.name": name },
      { "accounts.$.result": result }
    );
  } catch (err) {
    r.err = err.message;
  }

  console.log("Adding account result to user ... ", r.err);
  return r;
};

module.exports = {
  addUser,
  findOne,
  findByEmail,
  findByToken,
  findById,
  findAccount,
  addAccount,
  hideAccount,
  addResult,
};
