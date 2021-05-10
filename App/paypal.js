const express = require("express");
const app = express();
const axios = require("axios");
const querystring = require("querystring");
require("dotenv").config({ path: "./.env" });
const user = require("../Database/user");
var bodyParser = require("body-parser");
app.use(bodyParser.json());

const PaypalUrl =
  process.env.PAYPAL_ENV === "test"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

app.get("/subscribe", async function (req, res) {
  const { type, plan_id, url } = req.query;
  const token = await getToken();
  if (!token) res.send("Invalid Token").status("401");
  const urlRet =
    req.protocol +
    "://" +
    req.get("host") +
    "/paypal/subscribe/succes?type=" +
    type +
    "&url=" +
    url;

  console.log(urlRet);

  const data = {
    plan_id: plan_id,
    application_context: {
      return_url: urlRet,
      cancel_url: urlRet,
    },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let r = { res: null, err: null, url: null };
  try {
    const payment = await axios({
      method: "POST",
      url: `${PaypalUrl}/v1/billing/subscriptions`,
      data: data,
      headers,
    });
    r.res = payment.data;

    console.log("Create Payment Response ", url);
    for (let i = 0; i < payment.data.links.length; i++) {
      if (payment.data.links[i].rel === "approve") {
        r.url = payment.data.links[i].href;
      }
    }
  } catch (e) {
    r.err = e;
  }

  if (r.url) {
    return res.redirect(r.url);
  }
  res.json(r);
});

app.get("/subscribe/succes", async (req, res) => {
  const token = await getToken();
  const { type, id, subscription_id, url } = req.query;
  if (!id) id = subscription_id;
  // console.log(req.query);
  if (!token || !id) res.redirect(url);
  console.log(`GET => PAYPAL new subscription succes ${id}`);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let r = { res: null, err: null, usr: null };
  try {
    const ax = await axios({
      method: "GET",
      url: `${PaypalUrl}/v1/billing/subscriptions/${id}`,
      data: {},
      headers,
    });
    r.res = ax.data;
    if (r.res.status === "ACTIVE") {
      r.usr = await user.paypalSubscribe(
        r.res.subscriber.email_address,
        id,
        type
      );
    }
  } catch (e) {
    r.err = e;
  }

  res.redirect(url);
});

app.post("/subscribe/succes", async (req, res) => {
  const token = await getToken();
  const { type, id, subscription_id } = req.query;
  if (!id) id = subscription_id;
  // console.log(req.query);
  if (!token) res.send("Invalid Token").status("401");
  console.log(`POST => PAYPAL new subscription succes ${id}`);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  let r = { res: null, err: null, usr: null };
  try {
    const ax = await axios({
      method: "GET",
      url: `${PaypalUrl}/v1/billing/subscriptions/${id}`,
      data: {},
      headers,
    });
    r.res = ax.data;
    if (r.res.status === "ACTIVE") {
      r.usr = await user.paypalSubscribe(
        r.res.subscriber.email_address,
        id,
        type
      );
    }
  } catch (e) {
    r.err = e;
  }

  res.json(r);
});

app.post("/plan/create", async function (req, res) {
  const { name, price } = req.body;
  const token = await getToken();
  if (!token) res.send("Invalid Token").status("401");

  const data = {
    product_id: process.env.PAYPAL_PRODUCT_ID,
    name: name,
    description: name,
    status: "ACTIVE",
    billing_cycles: [
      {
        frequency: {
          interval_unit: "MONTH",
          interval_count: 1,
        },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 2,
        pricing_scheme: {
          fixed_price: {
            value: price,
            currency_code: "USD",
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      // setup_fee: {
      //   value: price,
      //   currency_code: "USD",
      // },
      // setup_fee_failure_action: "CONTINUE",
      payment_failure_threshold: 1,
    },
  };
  let r = { res: null, err: null };
  try {
    const ax = await axios.post(`${PaypalUrl}/v1/billing/plans`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    r.res = ax.data;
  } catch (e) {
    r.err = e;
  }

  res.json(r);
});

app.post("/get/subscription/:id", async (req, res) => {
  const token = await getToken();
  const { id } = req.params;
  if (!token) res.send("Invalid Token").status("401");

  const headers = {
    "Content-Type": "application/json",
    // Authorization: `Basic ${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
    Authorization: `Bearer ${token}`,
  };

  let r = { res: null, err: null };
  try {
    const ax = await axios({
      method: "GET",
      url: `${PaypalUrl}/v1/billing/subscriptions/${id}`,
      data: {},
      headers,
    });
    r.res = ax.data;
  } catch (e) {
    r.err = e;
  }

  console.log(r);
  res.json(r);
});

module.exports = app;

async function getToken() {
  const data = { grant_type: "client_credentials" };
  const headers = {
    Accept: "application/json",
    "Accept-Language": "en_US",
  };

  let r = null;
  try {
    const req = await axios({
      method: "POST",
      url: `${PaypalUrl}/v1/oauth2/token`,
      data: querystring.stringify(data),
      headers,
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      },
    });

    if (req) {
      r = req.data.access_token;
    }
  } catch (e) {
    console.error("get token error => ", e);
  }
  return r;
}
