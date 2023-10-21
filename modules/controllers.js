import request from "request-promise";
import transporter from "./transporter.js";
import { Transaction } from "./schema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export function pay(req, res) {
  const { name, email } = req.body;
  const id = process.env.API_KEY;
  const secret = process.env.SECRET_KEY;
  const transactionData = {
    amount: 3000.0,
    customerName: name,
    customerEmail: email,
    paymentReference: randomGen(8),
    paymentDescription: "Coupon Generation",
    currencyCode: "NGN",
    contractCode: process.env.CONTRACT,
    redirectUrl: "http://localhost:5000/signup",
    paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
  };
  request
    .post(`${process.env.BASE_URL}/api/v1/auth/login`, {
      headers: {
        Authorization: `Basic ${encode(id, secret)}`,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((response) => {
      const token = JSON.parse(response).responseBody.accessToken;
      // Proceed to pay function
      request
        .post(
          `${process.env.BASE_URL}/api/v1/merchant/transactions/init-transaction`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(transactionData),
          }
        )
        .then(async (response) => {
          const data = JSON.parse(response).responseBody;
          const url = data.checkoutUrl;
          const paymentReference = data.paymentReference;
          if (url) {
            // Save into transaction record (coupon not generated here)
            try {
              const transaction = new Transaction({
                email: email,
                ref: paymentReference,
                paid: false,
              });
              await transaction.save(); // Saves to transaction table
              res.redirect(url); // Goes to monnify payment page
            } catch (err) {
              console.log(err);
              res.redirect("/generate");
            }
          } else res.redirect("/generate");
        })
        .catch((err) => {
          res.redirect("/generate");
        });
    })
    .catch((err) => {
      res.redirect("/generate");
    });
  // console.log(encode(id, secret));
}
export function randomGen(range) {
  let strNum = "";
  let arrNum = [];
  for (let i = 0; i < range; i++) {
    let number = Math.floor(Math.random() * 9);
    arrNum.push(number);
  }
  arrNum.forEach((num) => {
    strNum += num;
  });
  return strNum;
}
function encode(id, secret) {
  let buffer = Buffer.from(`${id}:${secret}`);
  return buffer.toString("base64");
}
function sendEmail(message, subject, email) {
  const mailData = {
    from: "ICON " + "<icon1notification@gmail.com>",
    to: email,
    subject,
    html: `
  <div style="background-color: #f1f1f1; padding: 1em; text-align: center">
  <h1>${subject}</h1>
  <p style="margin-bottom: 1em">
   ${message}<br />
  </p>
  <small>Copyright© ICON </small>
 </div>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter
      .verify()
      .then(() => {
        transporter.sendMail(mailData, (err, infomation) => {
          if (err) {
            reject(err);
          } else resolve(infomation);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function SignUp(req, res) {
  res.render("signup", {
    error: req.flash("error"),
    whitelist: req.ref,
    success: req.success,
  });
}
export async function createUser(req, res) {
  const { whitelist, firstname, email, dob, gender } = req.body;
  if (!whitelist || !firstname || !email || !dob || !gender) {
    req.flash("error", "Fill in all the fields");
    res.redirect("/signup");
  } else {
    try {
      Transaction.findOne({ productCode: whitelist })
        .then(async (data) => {
          if (data) {
            if (data.email === email) {
              // Credentials in order
              // Hashes all data into a token
              const userCredentials = {
                whitelist,
                firstname,
                email,
                dob,
                gender,
              };
              const token = jwt.sign(
                JSON.stringify(userCredentials),
                process.env.SECRET,
                {
                  expiresIn: "600s",
                }
              ); // Expires in 10 minutes
            } else {
              req.flash("error", "Email is not associated with Whitelist code");
              res.redirect("/signup");
            }
          } else {
            req.flash("error", "Whitelist Code is wrong, try again");
            res.redirect("/signup");
          }
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "There seems to be an error");
          res.redirect("/signup");
        });
    } catch (error) {
      console.log(error);
      req.flash("error", "There seems to be an error");
      res.redirect("/signup");
    }
  }
}
export function tokenVerify(req, res) {
  console.log(req.params.token);
}
