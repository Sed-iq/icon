import express from "express";
import { pay } from "./controllers.js";
const app = express();

app.set("view engine", "ejs");
app.use("/public", express.static("public"));
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
  res.render("generate");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.use((req, res) => {
  res.status(404).send("404 Page not found");
});
export default app;
