import express from "express";
import { SignUp, createUser, pay, tokenVerify } from "./controllers.js";
import flash from "express-flash";
import dotenv from "dotenv";
import { signup } from "./auth.js";
dotenv.config();
const app = express();
app.use(flash(process.env.SECRET));

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/pay", pay);
app.get("/slot", (req, res) => {
  res.render("slot");
});
app.get("/generator", (req, res) => {
  res.render("generator");
});
app.get("/generate", (req, res) => {
  res.render("generate", { error: req.flash("error") });
});
app.get("/verify/:token", tokenVerify);
app.get("/signup", signup, SignUp);
app.post("/create_user", createUser);
app.use((req, res) => {
  res.status(404).send("404 Page not found");
});
export default app;
