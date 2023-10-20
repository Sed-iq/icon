import express from "express";
import dotenv from "dotenv";
import router from "./modules/router.js";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(
  session({
    cookie: { maxAge: 600 * 200 * 3 },
    resave: true,
    secret: process.env.CONTRACT,
    saveUninitialized: false,
  })
);
app.use(cookieParser(process.env.SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(router);
mongoose
  .connect(process.env.DB)
  .then(() => {
    app.listen(process.env.PORT, console.log("Running... " + process.env.PORT));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
