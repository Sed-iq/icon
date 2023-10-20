import mongoose from "mongoose";

const schemas = {
  user: new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      couponCode: {
        type: String,
        required: true,
      },
      password: {
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
        required: true,
      },
    },
    { timestamps: true }
  ),
};
const User = mongoose.model("user", schemas.user);
export { User };
