const nodemailer = require("nodemailer");
require("dotenv").config();
var aws = require("aws-sdk");

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "us-east-1",
});

let transport = nodemailer.createTransport({
  SES: { ses, aws },
});

// var transport = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: true,
//   requireTLS: false,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// var transport = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "cdd15777442946",
//     pass: "ba153f7551da9f",
//   },
// });

async function sendResetEmail(email, url) {
  // const html = `<div><h1>HandsFree</h1><p>Click the Link bellow to reset your password</p><a href="${url}">Reset password</a><p>This link will expire after 1 hour.</p></div>`;
  const html = `<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <style>
    html {
      --pcolor: #ad2218;
      --scolor: rgba(229, 231, 235);
      --tcolor: #a8cf3b;
      --pricecolor: #f27a02;
      --bgcolor: white;
      --shcolor: #a8cf3b59;
      --textcolor: black;
      --timecolor: #a0b0a0;
      --cancelcolor: rgb(170, 160, 32);
    }

    body {
      /* width: 100%; */
      margin: 0;
      background-color: rgba(229, 231, 235);;
    }

    .container {
      width: 100%;
      background-color: rgba(229, 231, 235);;
    }

    .bodyC {
      margin: 2rem auto 0;
      width: 80%;
      background-color: var(--bgcolor);
      padding: 1rem 1.8rem;
      border-radius: 8px;
      box-sizing: border-box;
    }

    .footer {
      width: 80%;
      margin: 2rem auto;
      background-color: var(--scolor);
    }

    .flexC {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header {
      height: 100px;
      width: 100%;
      background-color: var(--bgcolor);
    }

    .logo svg {
      margin: 0;
      width: 100px;
      height: 28px;
      fill: none;
      stroke: none;
      font-family: "TimesNewRomanPS-BoldMT", "Times New Roman";
      /* stroke-width: 0px; */
    }

    .h2 {
      text-align: center;
      color: #ad2218;
    }

    .h3 {
      font-size: 1.4rem;
      color: var(--pcolor);
      font-family: "Times New Roman 400", serif;
      -webkit-user-select: none;
      user-select: none;
      margin: 0.5rem 0;
    }

    .pgb {
      font-size: 1rem;
      color: var(--textcolor);
      font-family: "Avenir", "Arial", sans-serif;
      background-color: inherit;
      margin: 0.5rem 0;
    }

    .buttonP {
      font-size: 1.05rem;
      font-family: "Times New Roman 400", serif;
      padding: 0.4rem 1.4rem;
      border-radius: 5px;
      margin: 0.5rem 0 1rem;
      color: white !important;
      background-color: #ad2218;
      outline: none;
      border: none;
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
      transition: box-shadow 0.2s ease-in-out, opacity 0.3s linear,
        outline-offset 0.3s ease-in-out;
    }

    .span {
      /* padding: 0.1rem 0.3rem; */
      /* border-radius: 6px; */
      cursor: default;
      color: var(--pcolor);
      overflow: hidden;
      /* background-color: var(--scolor); */
    }

    .btnc {
      width: 100%;
      margin: 1rem 0;
    }

    @media only screen and (max-width: 600px) {
      /* .inner-body {
        width: 100% !important;
      } */

    }

    @media only screen and (max-width: 500px) {
      .bodyC {
        margin-top: 0;
        width: 100%;
      }
    }
  </style>
</head>

<body>
  <!-- Email Body -->
  <div class="container">
    <div class="bodyC">

      <div class="header flexC">
      <h2 class="h2">HandsFree</h2> 
      </div><!-- Body content -->
<h3 class="h3">Hello!</h3>

<p class="pgb">
  You are receiving this email because we received a
  password reset request for your account.
</p>

<div class="btnc flexC">
  <a class="buttonP" href="${url}">Reset Password</a>
</div>

<p class="pgb">
  This password reset link will expire in 60 minutes.
</p>
<p class="pgb">
  If you did not request a password reset, no further
  action is required.
</p>

<br />
<p class="pgb" style="margin-top: 1rem;">
  Regards,<br />
  <span style="font-weight: bold; color: var(--pcolor);">TradingRev</span>
</p>

<br />
</div>
    <div class="footer">
        <p style="
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
      position: relative;
      line-height: 1.5em;
      margin-top: 0;
      color: #b0adc5;
      font-size: 12px;
      text-align: center;
    ">
          © Dominate. All rights reserved.
        </p>
      </div>
  
    </div>
  </body>
  
  </html>
`;
  let info = await transport.sendMail({
    from: '"HandsFree 👻" <' + process.env.EMAIL + ">", // sender address
    to: "nidhal.nouma.0@gmail.com", //email, // list of receivers
    subject: "Reset Password ✔", // Subject line
    html, // html body
  });
  return info;
}

module.exports = { sendResetEmail };
