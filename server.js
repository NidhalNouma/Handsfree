const express = require("express");
const app = express();
const { resolve } = require("path");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./.env" });
const user = require("./App");
const stripe = require("./App/stripe");

const {
  // findUser,
  // addUser,
  // addIP,
  // removeIP,
  // findIP,
  // addResult,
  findMsg,
} = require("./DynamoDb");

if (
  !process.env.STRIPE_SECRET_KEY ||
  !process.env.STRIPE_PUBLISHABLE_KEY ||
  !process.env.FOREX ||
  !process.env.CRYPTO ||
  !process.env.INDICES ||
  !process.env.STOCK ||
  !process.env.STATIC_DIR
) {
  console.log(
    "The .env file is not configured. Follow the instructions in the readme to configure the .env file. https://github.com/stripe-samples/subscription-use-cases"
  );
  console.log("");
  process.env.STRIPE_SECRET_KEY
    ? ""
    : console.log("Add STRIPE_SECRET_KEY to your .env file.");

  process.env.STRIPE_PUBLISHABLE_KEY
    ? ""
    : console.log("Add STRIPE_PUBLISHABLE_KEY to your .env file.");

  process.env.FOREX
    ? ""
    : console.log(
        "Add Forex priceID to your .env file. See repo readme for setup instructions."
      );

  process.env.STOCK
    ? ""
    : console.log(
        "Add Stock priceID to your .env file. See repo readme for setup instructions."
      );

  process.env.INDICES
    ? ""
    : console.log(
        "Add Indices priceID to your .env file. See repo readme for setup instructions."
      );

  process.env.CRYPTO
    ? ""
    : console.log(
        "Add Crypto priceID to your .env file. See repo readme for setup instructions."
      );

  process.env.STATIC_DIR
    ? ""
    : console.log(
        "Add STATIC_DIR to your .env file. Check .env.example in the root folder for an example"
      );

  process.exit();
}

app.use(express.static(process.env.STATIC_DIR));
// Use JSON parser for all non-webhook routes.
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

app.use(user);
app.use(stripe);

app.get("/", (req, res) => {
  const path = resolve(process.env.HTML_DIR + "/index.html");
  res.sendFile(path);
});

app.get("/dashboard", (req, res) => {
  const path = resolve(process.env.HTML_DIR + "/index.html");
  res.sendFile(path);
});

app.get("/config", async (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// app.post("/check-ip", async function (req, res) {
//   let r = { valid: false, accounts: {} };
//   const { ip, email } = req.body;
//   if (!ip || !email) return res.json(r);

//   const r1 = await findIP(email);
//   if (!r1.Item) return res.json(r);

//   const { Accounts } = r1.Item;
//   r.accounts = Accounts;

//   Accounts.map((i) => {
//     if (i.ANo === ip) r.valid = true;
//   });
//   res.json(r);
// });

// app.post("/get-ip", async function (req, res) {
//   let r = {};
//   const { email } = req.body;
//   if (!email) return res.json(r);

//   const r1 = await findUser(email);
//   res.json(r1);
// });

// app.post("/remove-ip", async function (req, res) {
//   let r = {};
//   const { ind, email } = req.body;

//   if (!email || ind === undefined) return res.json(r);
//   const r1 = await removeIP(email, ind);
//   res.json(r1);
// });

app.post("/message", async function (req, res) {
  let r = "";
  try {
    const { Item } = await findMsg();
    if (Item.ver > req.body.version) r = Item.message;
  } catch (err) {
    console.log("message: error ==> ", err);
  }

  res.json(r);
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Node server listening on port ${port}!`));
