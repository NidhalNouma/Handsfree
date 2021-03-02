const express = require("express");
const app = express();
require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../Database/user");

app.post("/user/add", async function (req, res) {
  const { email, password } = req.body;
  const r = await User.addUser(email, password);
  res.json(r);
});

app.post("/user", async function (req, res) {
  const { email, password } = req.body;
  console.log(email);
  const r = await User.findOne(email, password);
  res.json(r);
});

app.post("/user/:id", async function (req, res) {
  const id = req.params.id;
  const r = await User.findById(id);
  res.json(r);
});

app.post("/account", async function (req, res) {
  const { email, name, server } = req.body;
  const r = await User.addAccount(email, name, server);
  res.json(r);
});

app.post("/account/hide", async function (req, res) {
  const { email, name, server } = req.body;
  const r = await User.hideAccount(email, name, server);
  res.json(r);
});

app.post("/check-ip", async function (req, res) {
  let r = { valid: false, accounts: {} };
  const { ip, email } = req.body;
  if (!ip || !email) return res.json(r);

  const r1 = await User.findAccount(email, ip);
  if (r1.err) return res.json(r);

  const { accounts } = r1.res;
  r.accounts = accounts;

  accounts.map((i) => {
    if (i.name === ip) r.valid = true;
  });
  res.json(r);
});

app.post("/result", async function (req, res) {
  const { email, account: name, data: result } = req.body;
  if (!email || !name) return res.json("Email and account require");
  const r = await User.addResult(email, name, result);
  res.json(r);
});

app.post("/customer", async function (req, res) {
  const r = {
    found: false,
    type: null,
    sub: false,
    Accounts: 0,
    result: null,
    email: "",
  };
  if (!req.body.email && !req.body.id) {
    res.json(r);
    return;
  }

  let email = req.body.email;
  let customers = req.body.id;
  if (!customers) {
    customers = await stripe.customers.list({
      email: email,
    });
    if (customers.data.length === 0) return res.json({ err: "invalid Email" });
    customers = customers.data[0].id;
  }
  if (!email) {
    const customer = await stripe.customers.retrieve(customers);
    if (!customer.email) return res.json({ err: "invalid Email" });
    email = customer.email;
  }

  r.email = email;
  const subscriptions = await stripe.subscriptions.list({
    customer: customers,
  });

  try {
    const au = await User.findByEmail(email);
    if (!au.res) {
      //   await addUser(customers, email);
      return res.json({ err: "Email not register" });
      r.Accounts = 0;
    } else {
      r.Accounts = au.res.accounts.length;
    }

    if (req.body.ip && req.body.server) {
      const ap = await user.addAccount(email, req.body.ip, req.body.server);
      console.log(ap);
    }
  } catch (e) {
    console.log("DY_DB_CUS_ERROR => ", e);
  }

  const { data } = subscriptions;

  if (data.length > 0) {
    r.found = true;
    r.result = data.map((i) => {
      let sub = [];
      if (i.plan) {
        let type = null;
        if (i.plan.id == process.env.FOREX) {
          type = "FOREX";
          if (type === req.body.type) r.sub = true;
        } else if (i.plan.id == process.env.CRYPTO) {
          type = "CRYPTO";
          if (type === req.body.type) r.sub = true;
        } else if (i.plan.id == process.env.INDICES) {
          type = "INDICES";
          if (type === req.body.type) r.sub = true;
        } else if (i.plan.id == process.env.STOCK) {
          type = "STOCK";
          if (type === req.body.type) r.sub = true;
        }
        sub.push(type);
        r.type = type;
      }
      return {
        email: i.email,
        id: i.id,
        subs: sub,
      };
    });
  }

  res.json(r);
});

module.exports = app;
