const express = require("express");
const app = express();
require("dotenv").config({ path: "./.env" });
const { resolve } = require("path");
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

app.post("/user/forget", async function (req, res) {
  const { email } = req.body;
  console.log(email);
  const url = req.protocol + "://" + req.get("host");
  const r = await User.forgetPassword(email, url);
  res.json(r);
});

app.get("/user/reset-password/:email/:token", async function (req, res) {
  const { email, token } = req.params;
  console.log(email);
  const r = await User.confirmResetPassword(email, token);

  if (r.ok) {
    const path = resolve(process.env.HTML_DIR + "/index.html");
    return res.sendFile(path);
  } else return res.redirect("/");
});

app.post("/user/reset-password", async function (req, res) {
  const { email, password } = req.body;
  console.log(email);
  const r = await User.resetPassword(email, password);
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
    result: [],
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
    } else {
      r.Accounts = au.res.accounts.length;
      if (au.res.paypal.subscription.forex != null) {
        r.found = true;
        console.log(au.res);
        // to-do add forex paypal subscription check
        r.sub = true;
      }
      if (au.res.paypal.subscription.crypto != null) {
        r.found = true;
        console.log(au.res);
        // to-do add forex paypal subscription check
        r.sub = true;
      }
      if (au.res.paypal.subscription.indices != null) {
        r.found = true;
        console.log(au.res);
        // to-do add forex paypal subscription check
        r.sub = true;
      }
      if (au.res.paypal.subscription.stock != null) {
        r.found = true;
        console.log(au.res);
        // to-do add forex paypal subscription check
        r.sub = true;
      }
    }

    if (req.body.ip && req.body.server) {
      const ap = await User.addAccount(email, req.body.ip, req.body.server);
      console.log("adding new account ", ap.res ? ap.res.nModified : app.err);
    }
  } catch (e) {
    console.log("DY_DB_CUS_ERROR => ", e);
  }

  const { data } = subscriptions;

  if (data.length > 0) {
    r.found = true;
    const da = data.map((i) => {
      let sub = [];
      if (i.plan && i.status === "active") {
        let type = null;
        if (
          i.plan.id == process.env.FOREX ||
          i.plan.id == process.env.FOREX_Y
        ) {
          type = "FOREX";
          if (type === req.body.type) r.sub = true;
        } else if (
          i.plan.id == process.env.CRYPTO ||
          i.plan.id == process.env.CRYPTO_Y
        ) {
          type = "CRYPTO";
          if (type === req.body.type) r.sub = true;
        } else if (
          i.plan.id == process.env.INDICES ||
          i.plan.id == process.env.INDICES_Y
        ) {
          type = "INDICES";
          if (type === req.body.type) r.sub = true;
        } else if (
          i.plan.id == process.env.STOCK ||
          i.plan.id == process.env.STOCK_Y
        ) {
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
    r.result = [...r.result, da];
  }

  res.json(r);
});

module.exports = app;
