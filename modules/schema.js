import mongoose from "mongoose";

const schemas = {
  user: new mongoose.Schema(
    {
      firstname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      phonenumber: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      DOB: {
        type: String,
        required: true,
      },
      address: {
        type: String,
      },
      whitelist: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  ),
  transaction: new mongoose.Schema(
    // For keeping track of transactions and who made them
    {
      ref: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      productCode: {
        type: String,
      },
      paid: {
        type: Boolean,
        default: false,
      },
      signed: { type: Boolean, default: false }, // To check if user has signed up
    },
    { timestamps: true }
  ),
};
const User = mongoose.model("user", schemas.user);
const Transaction = mongoose.model("transaction", schemas.transaction);
export { User, Transaction };
