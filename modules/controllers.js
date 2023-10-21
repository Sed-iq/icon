import request from "request-promise";
import transporter from "./transporter.js";
import { Transaction, User } from "./schema.js";
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
function sendEmail(message, subject, link, email) {
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
  <a href="${link}">Click to verify</a> <br/>
  <small>Copyright© ICON ${new Date().getFullYear()} </small>
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
  const { whitelist, firstname, email, dob, gender, phone, lastname } =
    req.body;
  if (
    (!whitelist || !firstname, !lastname || !email || !dob || !gender || !phone)
  ) {
    req.flash("error", "Fill in all the fields");
    res.redirect("/signup");
  } else {
    try {
      User.findOne({ email }).then((data) => {
        if (data) {
          // Email already exsit
          req.flash("error", "Email is associated with another account");
          res.redirect("/signup");
        } else {
          Transaction.findOne({ productCode: whitelist })
            .then(async (data) => {
              if (data) {
                if (data.email === email) {
                  // Credentials in order
                  // Hashes all data into a token
                  const userCredentials = {
                    whitelist,
                    firstname,
                    lastname,
                    email,
                    dob,
                    gender,
                    phone,
                  };
                  const token = jwt.sign(
                    { data: userCredentials },
                    process.env.SECRET,
                    {
                      expiresIn: "600s", // change
                    }
                  ); // Expires in 10 minutes
                  const message = `
                Thank you for signing up to Icon ${firstname},
                There's one more step for you to compelete,
                Here is your whitelist code: <b>${whitelist}</b>
                Please do not share this with anybody as it can be used to log into your account.
                Verify by clicking on the link below. (Expires in 10 minutes)
                `; // Message to be sent to user
                  sendEmail(
                    message,
                    "Email Verification",
                    `http://localhost:5000/verify/${token}`,
                    email
                  )
                    .then(() => {
                      console.log("email sent");
                      res.render("authnotification");
                    })
                    .catch((err) => {
                      console.log(err);
                      req.flash("error", "Error sending email, try again");
                      res.redirect("/signup");
                    });
                } else {
                  req.flash(
                    "error",
                    "Email is not associated with Whitelist code"
                  );
                  res.redirect("/signup");
                }
              } else {
                req.flash(
                  "error",
                  "Whitelist Code is wrong, proceed to buy before signing in"
                );
                res.redirect("/generate");
              }
            })
            .catch((err) => {
              console.log(err);
              req.flash("error", "There seems to be an error");
              res.redirect("/signup");
            });
        }
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "There seems to be an error");
      res.redirect("/signup");
    }
  }
}
export function tokenVerify(req, res) {
  try {
    const { token } = req.params;
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        console.log(err);
        req.flash("error", "Link is expired");
        res.redirect("/signup");
      } else if (decoded) {
        const { data } = decoded;
        const user = new User({
          firstname: data.firstname,
          lastname: data.lastname,
          DOB: data.dob,
          gender: data.gender,
          email: data.email,
          whitelist: data.whitelist,
          phonenumber: data.phone,
        });
        const $user = await User.findOne({ email: data.email });
        if ($user) {
          // User exsits
          res.send("Link expired");
        } else {
          user
            .save()
            .then(() => res.send("Details Saved, Welcome to ICON"))
            .catch((err) => {
              console.log(err);
              req.flash("error", "There seems to be an error");
              res.redirect("/signup");
            });
        }
      } else {
        req.flash("error", "There seems to be an error");
        res.redirect("/signup");
      }
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "There seems to be an error");
    res.redirect("/signup");
  }
}
