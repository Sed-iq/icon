import dotenv from "dotenv";
import { Transaction } from "./schema.js";
import { randomGen } from "./controllers.js";
dotenv.config();
export function signup(req, res, next) {
  const { paymentReference } = req.query;
  if (paymentReference) {
    // Check if it's valid refernce
    Transaction.findOne({ ref: paymentReference })
      .then(async (data) => {
        if (data) {
          if (data.signed == true) {
            req.flash("error", "Expired payment reference");
            res.redirect("/signup");
          } else if (data.productCode) {
            req.ref = data.productCode;
            next();
          } else {
            // if no product code then proceed to generate coupon and save
            const whitelistCode = randomGen(10);
            await Transaction.findOneAndUpdate(
              { ref: data.ref },
              { paid: true, productCode: whitelistCode }
            ); // Adds whitelist code
            req.ref = whitelistCode;
            req.success = "WhitelistCode generated Successfully!";
            next();
          }
        } else {
          console.log(paymentReference);
          req.flash("error", "Invalid Payment Reference");
          res.redirect("/signup");
        }
      })
      .catch((err) => {
        console.log(err);
        req.flash("error", "Error validating Payment Refernce");
        res.redirect("/signup");
      });
  } else next();
}
