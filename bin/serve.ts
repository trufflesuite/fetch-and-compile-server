import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";

import { handleProjectInfo, handleTransaction } from "../src";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/projectInfo", handleProjectInfo);
app.get("/tx", handleTransaction);
console.log(`Starting on port ${process.env.PORT}`);

app.listen(process.env.PORT);
