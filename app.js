import express from "express";
import dotenv from "dotenv";
import router from "./modules/router.js";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(router);
app.listen(process.env.PORT, console.log("Running... " + process.env.PORT));
