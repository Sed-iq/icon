import request from "request-promise";

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
  console.log(encode(id, secret));
  res.end();
  //   request
  //     .post(
  //       `${process.env.BASE_URL}/api/v1/merchant/transactions/init-transaction`,
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(transactionData),
  //       }
  //     )
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   console.log(randomGen(8));
  res.end();
}
function randomGen(range) {
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
