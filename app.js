import express from "express";
import dotenv from "dotenv";
import router from "./modules/router.js";
dotenv.config();

const app = express();
app.use(router);
app.listen(process.env.PORT, console.log("Running... " + process.env.PORT));
