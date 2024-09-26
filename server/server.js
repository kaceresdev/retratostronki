const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const functions = require("firebase-functions");

const app = express();
const port = 8443;

app.use(bodyParser.json());
app.use(cors());

app.post("/send-email", (req, res) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "retratostronkiweb@gmail.com",
      pass: "zqet pldk elwy jrkx",
    },
  });

  const mailOptions = {
    from: email,
    to: "retratostronkiweb@gmail.com",
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});

exports.app = functions.https.onRequest(app);
