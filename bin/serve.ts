import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { handleSingle, handleMultiple } from "../src";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/address", handleSingle);
app.get("/addresses", handleMultiple);
app.get("/status", (req, res) => res.sendStatus(200));
console.log(`Starting on port ${process.env.PORT}`);

app.listen(process.env.PORT);
